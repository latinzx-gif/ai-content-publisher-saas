'use server'

import { getDbClient, requireOwner } from '@/lib/owner-context'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Post, PostMetadata } from '@/types'
import { decrypt } from '@/lib/encryption'
import OpenAI from 'openai'

const UpdatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  caption: z.string().min(1),
  hashtags: z.string()
})

const ReviewBoardNoteSchema = z.object({
  boardKey: z.string().min(1).max(80).default('drafts'),
  note: z.string().max(10000)
})

const CreativeReviewSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().url().optional(),
  usePlaceholder: z.boolean().optional(),
  approveCreative: z.boolean().optional()
})

const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/1200x630/faf8f5/1e1d1b?text=Creative+Placeholder'

function countApproxWords(text: string): number {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return 0

  const spacedWords = normalized.match(/[\p{L}\p{N}]+/gu) || []
  if (spacedWords.length > 1) return spacedWords.length

  const nonWhitespaceChars = normalized.replace(/\s/g, '').length
  return Math.max(1, Math.round(nonWhitespaceChars / 5))
}

export async function getPosts(status?: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  let query = supabase
    .from('content_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function getReviewBoardNote(boardKey = 'drafts') {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data, error } = await supabase
    .from('review_board_notes')
    .select('note')
    .eq('user_id', user.id)
    .eq('board_key', boardKey)
    .maybeSingle()

  if (error && error.code === 'PGRST205') return ''
  if (error) throw new Error(error.message)
  return data?.note || ''
}

export async function saveReviewBoardNote(input: z.infer<typeof ReviewBoardNoteSchema>) {
  const supabase = await getDbClient()
  const user = await requireOwner()
  const validated = ReviewBoardNoteSchema.parse(input)

  const { error } = await supabase
    .from('review_board_notes')
    .upsert({
      user_id: user.id,
      board_key: validated.boardKey,
      note: validated.note,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, board_key' })

  if (error && error.code === 'PGRST205') {
    throw new Error('Review notes table is not deployed. Run migration 0005_review_board_notes.sql first.')
  }
  if (error) throw new Error(error.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'review_note_saved',
    topic: validated.boardKey,
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true }
}

export async function updatePost(input: z.infer<typeof UpdatePostSchema>) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const validated = UpdatePostSchema.parse(input)

  // Verify ownership and status
  const { data: post, error: fetchError } = await supabase
    .from('content_posts')
    .select('status, metadata')
    .eq('id', validated.id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !post) throw new Error('Post not found')
  if (post.status === 'published') throw new Error('Cannot edit published posts')

  const updatedMetadata: Partial<PostMetadata> = {
    ...(post.metadata as object),
    title: validated.title,
    caption: validated.caption,
    hashtags: validated.hashtags,
    actual_word_count: countApproxWords(validated.caption),
    creative_status: (post.metadata as { platform_format?: string })?.platform_format === 'text_only' ? 'not_required' : 'needs_review'
  }

  const { error: updateError } = await supabase
    .from('content_posts')
    .update({
      content: `${validated.title}

${validated.caption}

${validated.hashtags}`,
      metadata: updatedMetadata,
      status: 'draft', // Reset to draft after edit
      updated_at: new Date().toISOString()
    })
    .eq('id', validated.id)

  if (updateError) throw new Error(updateError.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'draft_updated',
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true }
}

export async function generateImageOptions(postId: string, count: 1 | 2 | 3) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  // 1. Get Post and Brand
  const { data: post, error: postError } = await supabase
    .from('content_posts')
    .select('metadata')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  if (postError || !post) throw new Error('Post not found.')

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('image_rules')
    .eq('user_id', user.id)
    .single()
  if (brandError || !brand) throw new Error('Brand profile not found.')

  // 2. Set status to 'generating'
  const initialMetadata = post.metadata as PostMetadata
  await supabase
    .from('content_posts')
    .update({
      metadata: { ...initialMetadata, creative_status: 'generating' },
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
  revalidatePath('/drafts')

  // 3. Get OpenAI Key
  const { data: integration, error: intError } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'openai')
    .single()
  if (intError || !integration) throw new Error('OpenAI key not found.')
  const apiKey = decrypt(integration.encrypted_value)
  const openai = new OpenAI({ apiKey })

  // 4. Generate prompt and images
  const imagePrompt = `Digital art, ${brand.image_rules || ''}. The content is about: ${initialMetadata.topic || initialMetadata.title}.`
  const imageOptions: PostMetadata['image_options'] = []

  for (let i = 0; i < count; i++) {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        quality: 'standard',
        size: '1024x1024',
        response_format: 'url'
      })
      const url = response.data?.[0]?.url
      if (url) {
        imageOptions.push({ url, source: 'openai', prompt: imagePrompt })
      } else {
        throw new Error('No URL returned from OpenAI')
      }
    } catch (error) {
      console.error(`OpenAI image generation failed (iteration ${i + 1}):`, error)
      imageOptions.push({
        url: `https://placehold.co/1024x1024/EBE7E0/1E1D1B?text=Fallback+Option+${i + 1}`,
        source: 'placeholder',
        prompt: 'Placeholder due to generation error.'
      })
    }
  }

  // 5. Update post with options
  const finalMetadata: PostMetadata = {
    ...initialMetadata,
    image_prompt: imagePrompt,
    image_options: imageOptions,
    creative_status: 'review_options'
  }
  await supabase
    .from('content_posts')
    .update({ metadata: finalMetadata, updated_at: new Date().toISOString() })
    .eq('id', postId)

  revalidatePath('/drafts')
  return { success: true, options: imageOptions }
}

export async function selectImageOption(postId: string, imageUrl: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data: post, error: fetchError } = await supabase
    .from('content_posts')
    .select('metadata')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  if (fetchError || !post) throw new Error('Post not found.')

  const metadata = post.metadata as PostMetadata
  const selectedOption = metadata.image_options?.find(opt => opt.url === imageUrl)

  const updatedMetadata: PostMetadata = {
    ...metadata,
    selected_image_url: imageUrl,
    image_url: imageUrl, // also update the main image_url
    image_source: selectedOption?.source || 'openai'
  }

  const { error } = await supabase
    .from('content_posts')
    .update({ metadata: updatedMetadata, updated_at: new Date().toISOString() })
    .eq('id', postId)
  if (error) throw new Error(error.message)

  revalidatePath('/drafts')
  return { success: true, metadata: updatedMetadata }
}


export async function saveCreativeReview(input: z.infer<typeof CreativeReviewSchema>) {
  const supabase = await getDbClient()
  const user = await requireOwner()
  const validated = CreativeReviewSchema.parse(input)

  const { data: post, error: fetchError } = await supabase
    .from('content_posts')
    .select('status, metadata')
    .eq('id', validated.id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !post) throw new Error('Post not found')
  if (post.status !== 'approved') throw new Error('Creative review is available after text approval.')

  const metadata = (post.metadata || {}) as PostMetadata
  const isTextOnly = metadata.platform_format === 'text_only'
  
  // Use selected_image_url if available, otherwise fallback to existing logic
  const finalImageUrl = metadata.selected_image_url || (validated.usePlaceholder ? PLACEHOLDER_IMAGE_URL : validated.imageUrl || metadata.image_url || null)

  if (!isTextOnly && validated.approveCreative && !finalImageUrl) {
    throw new Error('An image must be generated and selected, or a placeholder used, before approving.')
  }

  const updatedMetadata: PostMetadata = {
    ...metadata,
    image_url: finalImageUrl,
    creative_status: isTextOnly ? 'not_required' : validated.approveCreative ? 'approved' : metadata.creative_status,
    // creative_reviewed_at: validated.approveCreative ? new Date().toISOString() : undefined
  }

  const { error } = await supabase
    .from('content_posts')
    .update({
      metadata: updatedMetadata,
      updated_at: new Date().toISOString()
    })
    .eq('id', validated.id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: validated.approveCreative ? 'creative_approved' : 'creative_updated',
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true, metadata: updatedMetadata }
}

export async function approvePost(id: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data: post, error: fetchError } = await supabase
    .from('content_posts')
    .select('metadata')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !post) throw new Error('Post not found')

  const metadata = (post.metadata || {}) as PostMetadata
  const creativeStatus = metadata.platform_format === 'text_only' || !metadata.platform_format ? 'not_required' : 'needs_review'

  const { error } = await supabase
    .from('content_posts')
    .update({
      status: 'approved',
      metadata: {
        ...metadata,
        creative_status: creativeStatus
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'draft_approved',
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true }
}

export async function rejectPost(id: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { error } = await supabase
    .from('content_posts')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'draft_rejected',
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true }
}

export async function approveAllDrafts() {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data: posts, error: fetchError } = await supabase
    .from('content_posts')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'draft')

  if (fetchError) throw new Error(fetchError.message)
  if (!posts.length) return { success: true, count: 0 }

  const ids = posts.map(p => p.id)

  const { error: updateError } = await supabase
    .from('content_posts')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .in('id', ids)

  if (updateError) throw new Error(updateError.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'drafts_approved_all',
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true, count: ids.length }
}

export async function rejectAllDrafts() {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data: posts, error: fetchError } = await supabase
    .from('content_posts')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'draft')

  if (fetchError) throw new Error(fetchError.message)
  if (!posts.length) return { success: true, count: 0 }

  const ids = posts.map(p => p.id)

  const { error: updateError } = await supabase
    .from('content_posts')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .in('id', ids)

  if (updateError) throw new Error(updateError.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'drafts_rejected_all',
    status: 'completed'
  })

  revalidatePath('/drafts')
  return { success: true, count: ids.length }
}
