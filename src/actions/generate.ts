'use server'

import { decrypt } from '@/lib/encryption'
import { getGeneratePostsPrompt } from '@/prompts/generate-posts'
import { callOpenAI } from '@/lib/openai'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireOwner, getDbClient } from '@/lib/owner-context'

const GeneratePostsSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  tone: z.string().min(1, 'Tone is required'),
  personality: z.string().min(1, 'Personality is required'),
  postCount: z.union([z.literal(5), z.literal(10)])
})

export async function generatePosts(input: z.infer<typeof GeneratePostsSchema>) {
  const validated = GeneratePostsSchema.parse(input)
  const supabase = await getDbClient()
  const user = await requireOwner()

  // 1. Get Brand Profile
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
    throw new Error('Please configure your Brand Profile first.')
  }

  // 2. Get OpenAI Integration
  const { data: integration, error: integrationError } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'openai')
    .single()

  if (integrationError || !integration) {
    throw new Error('Please configure your OpenAI API Key in Settings first.')
  }

  // 3. Decrypt Key
  const apiKey = decrypt(integration.encrypted_value)

  // 4. Construct Prompt
  const prompt = getGeneratePostsPrompt(
    {
      name: brand.name,
      business_type: brand.business_type,
      target_audience: brand.target_audience,
      tone: brand.tone,
      personality: brand.personality
    },
    validated.topic,
    validated.tone,
    validated.personality,
    validated.postCount
  )

  // 5. Call OpenAI
  const result = await callOpenAI(apiKey, prompt)

  // 6. Create Workflow Log
  const { data: log, error: logError } = await supabase
    .from('workflow_logs')
    .insert({
      user_id: user.id,
      action: 'generate_request',
      topic: validated.topic,
      status: 'pending'
    })
    .select()
    .single()

  if (logError) throw new Error('Failed to create workflow log')

  // 7. Save Posts as Drafts
  const postsToInsert = result.posts.map(post => ({
    user_id: user.id,
    workflow_id: log.id,
    content: `${post.title}\n\n${post.caption}\n\n${post.hashtags}`,
    status: 'draft',
    metadata: {
        topic: validated.topic,
        tone: validated.tone,
        personality: validated.personality,
        angle_type: post.angle_type,
        platform: post.platform,
        title: post.title,
        caption: post.caption,
        hashtags: post.hashtags
    }
  }))

  const { error: insertError } = await supabase
    .from('content_posts')
    .insert(postsToInsert)

  if (insertError) throw new Error('Failed to save generated posts')

  // 8. Update Log Status
  await supabase
    .from('workflow_logs')
    .update({ status: 'completed' })
    .eq('id', log.id)

  revalidatePath('/drafts')
  return { success: true, count: result.posts.length }
}
