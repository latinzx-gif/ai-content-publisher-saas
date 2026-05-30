'use server'

import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { getPublishingAdapter, PublishInput } from '@/lib/publishing'
import { revalidatePath } from 'next/cache'
import { PostMetadata } from '@/types'

export async function sendPostToBuffer(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Fetch post and verify
  const { data: post, error: postError } = await supabase
    .from('content_posts')
    .select('*')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()

  if (postError || !post) throw new Error('Post not found')
  if (post.status !== 'approved' && post.status !== 'failed') {
    throw new Error('Only approved or failed posts can be published.')
  }

  // 2. Get Buffer integration
  const { data: integration, error: intError } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'buffer')
    .single()

  if (intError || !integration) {
    throw new Error('Buffer is not connected. Please connect it in Settings.')
  }

  const accessToken = decrypt(integration.encrypted_value)
  const metadata = post.metadata as PostMetadata
  const adapter = getPublishingAdapter('buffer')

  const publishInput: PublishInput = {
    title: metadata.title,
    caption: metadata.caption,
    hashtags: metadata.hashtags,
    platform: 'facebook' // Default for MVP
  }

  // 3. Send to Buffer
  const result = await adapter.sendPost(publishInput, accessToken)

  // 4. Update Database
  if (result.success) {
    const updatedMetadata = {
      ...metadata,
      external_id: result.externalId,
      external_url: result.externalUrl,
      published_at: new Date().toISOString()
    }

    await supabase
      .from('content_posts')
      .update({
        status: 'published',
        buffer_post_id: result.externalId,
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    await supabase.from('workflow_logs').insert({
      user_id: user.id,
      action: 'buffer_publish_success',
      topic: metadata.topic,
      status: 'completed'
    })

    revalidatePath('/drafts')
    return { success: true, externalUrl: result.externalUrl }
  } else {
    const updatedMetadata = {
      ...metadata,
      last_error: result.error
    }

    await supabase
      .from('content_posts')
      .update({
        status: 'failed',
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    await supabase.from('workflow_logs').insert({
      user_id: user.id,
      action: 'buffer_publish_failed',
      topic: metadata.topic,
      status: 'failed'
    })

    revalidatePath('/drafts')
    throw new Error(result.error || 'Failed to publish to Buffer')
  }
}

export async function sendApprovedPostsToBuffer() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: posts, error: fetchError } = await supabase
        .from('content_posts')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'approved')

    if (fetchError) throw new Error(fetchError.message)
    if (!posts.length) return { success: true, count: 0 }

    let successCount = 0
    let failCount = 0

    for (const post of posts) {
        try {
            await sendPostToBuffer(post.id)
            successCount++
        } catch (error) {
            console.error(`Failed to publish post ${post.id}:`, error)
            failCount++
        }
    }

    revalidatePath('/drafts')
    return { success: true, successCount, failCount }
}
