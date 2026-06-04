'use server'

import { getDbClient, requireOwner } from '@/lib/owner-context'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PostMetadata } from '@/types'
import { decrypt } from '@/lib/encryption'
import OpenAI from 'openai'
import { renderTextOverlay, extractCta, qaCheckTextRendered } from '@/lib/image/renderer'

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

const ImageCountSchema = z.union([z.literal(1), z.literal(2), z.literal(3)])

const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/1200x630/faf8f5/1e1d1b?text=Creative+Placeholder'

function countApproxWords(text: string): number {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return 0

  const spacedWords = normalized.match(/[\p{L}\p{N}]+/gu) || []
  if (spacedWords.length > 1) return spacedWords.length

  const nonWhitespaceChars = normalized.replace(/\s/g, '').length
  return Math.max(1, Math.round(nonWhitespaceChars / 5))
}

function getImageSize(platformFormat?: string) {
  if (platformFormat === 'instagram_4_5') return '1024x1536'
  if (platformFormat === 'facebook_post') return '1536x1024'
  return '1024x1024'
}

function buildImagePrompt(metadata: PostMetadata, imageRules?: string | null) {
  const platformFormat = metadata.platform_format || 'facebook_post'
  return [
    'Generate a clean background illustration for a social media post.',
    'DO NOT render any text, words, letters, or characters in the image.',
    'DO NOT include any readable text, quotes, labels, or captions.',
    'The image should be a professional background or illustration only.',
    'Leave empty negative space in the center area for text overlay.',
    `Platform format: ${platformFormat.replace(/_/g, ' ')}.`,
    `Topic: ${metadata.topic || metadata.title}.`,
    `Context: ${metadata.caption?.slice(0, 300) || metadata.title}.`,
    imageRules ? `Brand image rules: ${imageRules}` : 'Visual style: clean, professional, trustworthy, business-friendly.',
    'Color palette: professional, muted backgrounds with good contrast for white text overlay.'
  ].join('\n')
}

function placeholderOption(index: number, prompt: string, warning?: string): NonNullable<PostMetadata['image_options']>[number] {
  return {
    id: `placeholder-${Date.now()}-${index}`,
    url: `https://placehold.co/1024x1024/EBE7E0/1E1D1B?text=Image+Option+${index}`,
    source: 'placeholder',
    prompt,
    warning: warning || 'OpenAI image generation fallback placeholder.'
  }
}

/**
 * Upload a base64-encoded image to Supabase Storage and return the public HTTPS URL.
 * Uses the admin client (via getDbClient()) which has storage access in single-owner mode.
 */
async function uploadToStorage(
  base64Data: string,
  userId: string,
  postId: string,
  index: number
): Promise<string> {
  const supabase = await getDbClient()

  // Strip data URI prefix if present (e.g. "data:image/webp;base64,...")
  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')

  const filename = `${userId}/${postId}/${Date.now()}_${index}.webp`

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(filename, buffer, {
      contentType: 'image/webp',
      upsert: false,
    })

  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(filename)

  return publicUrl
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
    creative_status: (post.metadata as { platform_format?: string })?.platform_format === 'text_only' ? 'not_required' : 'pending',
    image_options: [],
    selected_image: null,
    selected_image_url: undefined,
    image_url: null,
    image_source: null
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
  const validatedCount = ImageCountSchema.parse(count)

  // 1. Get Post and Brand
  const { data: post, error: postError } = await supabase
    .from('content_posts')
    .select('status, metadata')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  if (postError || !post) throw new Error('Post not found.')

  const currentStatus = String(post.status)
  if (!['text_approved', 'images_ready'].includes(currentStatus)) {
    throw new Error('Images can only be generated after text approval.')
  }

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('name, image_rules')
    .eq('user_id', user.id)
    .single()
  if (brandError || !brand) throw new Error('Brand profile not found.')

  const initialMetadata = post.metadata as PostMetadata
  if (initialMetadata.platform_format === 'text_only') {
    throw new Error('Text-only posts do not require image generation.')
  }

  // 2. Set status to images_pending while generation runs.
  await supabase
    .from('content_posts')
    .update({
      status: 'images_pending',
      metadata: {
        ...initialMetadata,
        creative_status: 'generating',
        image_count: validatedCount,
        image_options: [],
        selected_image: null,
        selected_image_url: undefined,
        image_url: null,
        image_source: null
      },
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

  // 4. Generate background/illustration via AI (no text).
  const imagePrompt = buildImagePrompt(initialMetadata, brand.image_rules)
  const imageOptions: PostMetadata['image_options'] = []

  for (let i = 0; i < validatedCount; i++) {
    try {
      const response = await openai.images.generate({
        model: 'gpt-image-2',
        prompt: imagePrompt,
        n: 1,
        quality: 'low',
        size: getImageSize(initialMetadata.platform_format),
        output_format: 'webp',
        output_compression: 80
      })
      const image = response.data?.[0]
      if (!image?.b64_json) throw new Error('No image data returned from OpenAI')

      // Step A: Upload raw background to storage (preserve original for fallback)
      const rawUrl = await uploadToStorage(image.b64_json, user.id, postId, i + 1)

      // Step B: Download background from storage into buffer
      const bgResponse = await fetch(rawUrl)
      if (!bgResponse.ok) throw new Error(`Failed to download background: HTTP ${bgResponse.status}`)
      const backgroundBuffer = Buffer.from(await bgResponse.arrayBuffer())

      // Step C: Composite text overlay via Sharp + SVG
      const [imgWidth, imgHeight] = getImageSize(initialMetadata.platform_format).split('x').map(Number)
      const brandName = brand.name || 'Smoke Legal Advisory'
      const cta = extractCta(initialMetadata)
      const renderResult = await renderTextOverlay(backgroundBuffer, imgWidth, imgHeight, {
        title: initialMetadata.title,
        body: initialMetadata.caption || initialMetadata.title,
        cta,
        brandName
      })

      // Step D: QA gate — verify text overlay integrity
      const qa = qaCheckTextRendered(renderResult, {
        title: initialMetadata.title,
        body: initialMetadata.caption || initialMetadata.title,
        platformWidth: imgWidth,
        platformHeight: imgHeight
      })
      if (!qa.pass) {
        // QA failed — mark as failed, do NOT include in selectable options
        console.warn(`QA gate rejected image option ${i + 1}: ${qa.reason}`)
        await supabase.from('workflow_logs').insert({
          user_id: user.id,
          action: 'image_overlay_qa_failed',
          topic: `postId=${postId}, platform_format=${initialMetadata.platform_format || 'unknown'}, text_chars=${renderResult.textCharsOverlaid}, reason=${qa.reason}`,
          status: 'failed'
        })
        // Skip this iteration — no image option added
        continue
      }

      // Step E: Upload composited final image (QA passed)
      const compositedFilename = `${user.id}/${postId}/${Date.now()}_${i + 1}_composited.webp`
      const { error: compUploadError } = await supabase.storage
        .from('post-images')
        .upload(compositedFilename, renderResult.buffer, {
          contentType: 'image/webp',
          upsert: false
        })
      if (compUploadError) throw new Error(`Composited upload failed: ${compUploadError.message}`)

      const { data: { publicUrl: compositedUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(compositedFilename)

      // Step F: Cost logging — capture gpt-image-2 usage metadata
      const usage = response.usage
      if (usage) {
        await supabase.from('workflow_logs').insert({
          user_id: user.id,
          action: 'image_gen_usage_v2',
          topic: `input_tokens=${usage.input_tokens}, output_tokens=${usage.output_tokens}, image_tokens=${usage.output_tokens_details?.image_tokens || 0}, total_tokens=${usage.total_tokens}`,
          status: 'completed'
        })
      }

      imageOptions.push({
        id: `openai-${Date.now()}-${i + 1}`,
        url: compositedUrl,
        source: 'openai',
        prompt: imagePrompt,
        overlay_meta: {
          text_chars: renderResult.textCharsOverlaid,
          qa_pass: true,
          model: 'gpt-image-2',
          input_tokens: usage?.input_tokens,
          output_tokens: usage?.output_tokens,
          total_tokens: usage?.total_tokens
        }
      })
    } catch (error) {
      console.error(`Image generation failed (iteration ${i + 1}):`, error)
      const warning = error instanceof Error ? error.message : 'Image generation failed.'
      imageOptions.push(placeholderOption(i + 1, imagePrompt, warning))
    }
  }

  // 5. Update post with options
  const finalMetadata: PostMetadata = {
    ...initialMetadata,
    image_prompt: imagePrompt,
    image_options: imageOptions,
    selected_image: null,
    selected_image_url: undefined,
    image_url: null,
    image_source: null,
    creative_status: 'images_ready'
  }
  await supabase
    .from('content_posts')
    .update({ status: 'images_ready', metadata: finalMetadata, updated_at: new Date().toISOString() })
    .eq('id', postId)

  revalidatePath('/drafts')
  return { success: true, options: imageOptions, metadata: finalMetadata }
}

export async function selectImageOption(postId: string, imageId: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data: post, error: fetchError } = await supabase
    .from('content_posts')
    .select('status, metadata')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  if (fetchError || !post) throw new Error('Post not found.')
  if (post.status !== 'images_ready') throw new Error('Image selection is only available after images are ready.')

  const metadata = post.metadata as PostMetadata
  const selectedOption = metadata.image_options?.find(opt => opt.id === imageId)
  if (!selectedOption) throw new Error('Selected image option was not found.')

  const updatedMetadata: PostMetadata = {
    ...metadata,
    selected_image: selectedOption,
    selected_image_url: selectedOption.url,
    image_url: selectedOption.url,
    image_source: selectedOption.source
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
  if (post.status !== 'images_ready') throw new Error('Creative approval is available after images are ready.')

  const metadata = (post.metadata || {}) as PostMetadata
  const isTextOnly = metadata.platform_format === 'text_only'
  
  // Use selected_image_url if available, otherwise fallback to existing logic
  const fallbackImageUrl = validated.usePlaceholder ? PLACEHOLDER_IMAGE_URL : validated.imageUrl || metadata.image_url || null
  const finalImageUrl = metadata.selected_image?.url || metadata.selected_image_url || fallbackImageUrl

  if (!isTextOnly && validated.approveCreative && !finalImageUrl) {
    throw new Error('Select an image before approving creative.')
  }

  const updatedMetadata: PostMetadata = {
    ...metadata,
    selected_image: metadata.selected_image || (finalImageUrl ? {
      id: 'manual-fallback',
      url: finalImageUrl,
      source: validated.usePlaceholder ? 'placeholder' : 'openai'
    } : null),
    selected_image_url: finalImageUrl || undefined,
    image_url: finalImageUrl,
    creative_status: isTextOnly ? 'not_required' : validated.approveCreative ? 'approved' : metadata.creative_status,
    // creative_reviewed_at: validated.approveCreative ? new Date().toISOString() : undefined
  }

  const { error } = await supabase
    .from('content_posts')
    .update({
      status: validated.approveCreative && !isTextOnly ? 'creative_approved' : post.status,
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
  const creativeStatus = metadata.platform_format === 'text_only' || !metadata.platform_format ? 'not_required' : 'pending'

  const { error } = await supabase
    .from('content_posts')
    .update({
      status: 'text_approved',
      metadata: {
        ...metadata,
        creative_status: creativeStatus,
        image_options: [],
        selected_image: null,
        selected_image_url: undefined,
        image_url: null,
        image_source: null
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'text_approved',
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
    .update({ status: 'text_approved', updated_at: new Date().toISOString() })
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
