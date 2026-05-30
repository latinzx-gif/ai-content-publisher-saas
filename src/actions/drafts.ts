'use server'

import { getDbClient, requireOwner } from '@/lib/owner-context'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const UpdatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  caption: z.string().min(1),
  hashtags: z.string()
})

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

  const updatedMetadata = {
    ...(post.metadata as object),
    title: validated.title,
    caption: validated.caption,
    hashtags: validated.hashtags
  }

  const { error: updateError } = await supabase
    .from('content_posts')
    .update({
      content: `${validated.title}\n\n${validated.caption}\n\n${validated.hashtags}`,
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

export async function approvePost(id: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { error } = await supabase
    .from('content_posts')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
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
