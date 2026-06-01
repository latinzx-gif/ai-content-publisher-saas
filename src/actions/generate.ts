'use server'

import { decrypt } from '@/lib/encryption'
import { getGeneratePostsPrompt } from '@/prompts/generate-posts'
import { callOpenAI } from '@/lib/openai'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireOwner, getDbClient } from '@/lib/owner-context'
import OpenAI from 'openai'

const GeneratePostsSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  tone: z.string().min(1, 'Tone is required'),
  personality: z.string().min(1, 'Personality is required'),
  postCount: z.union([z.literal(5), z.literal(10)]),
  urls: z.array(z.string().url()).max(5).optional(),
  manualContext: z.string().max(10000).optional()
})

function cleanHtml(html: string): string {
  // Strip script and style blocks completely
  let text = html.replace(/<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/gi, '');
  // Strip all other HTML tags
  text = text.replace(/<[^>]*>?/gm, ' ');
  // Replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return `[Failed to load URL: status ${res.status}]`;
    const html = await res.text();
    const cleaned = cleanHtml(html);
    return cleaned.slice(0, 4000); // truncate to prevent huge token usage
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return `[Failed to load URL: ${err instanceof Error ? err.message : 'unreachable'}]`;
  }
}

async function summarizeSources(apiKey: string, rawTexts: string[]): Promise<string> {
  const combined = rawTexts.join('\n\n--- SOURCE BUNDLE ---\n\n');
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { 
        role: 'system', 
        content: 'You are an AI research assistant. Summarize the following sources into a concise summary in Thai, focusing on legal compliance, key facts, and essential details that can be used to write informative social media posts.' 
      },
      { role: 'user', content: combined.slice(0, 20000) }
    ],
    temperature: 0.3
  });
  return response.choices[0].message.content || '';
}

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
    return { success: false, error: 'Please configure your Brand Profile first.' }
  }

  // 2. Get OpenAI Integration
  const { data: integration, error: integrationError } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'openai')
    .single()

  if (integrationError || !integration) {
    return { success: false, error: 'Please configure your OpenAI API Key in Settings first.' }
  }

  // 3. Decrypt Key
  const apiKey = decrypt(integration.encrypted_value)

  // 4. Scrape & Summarize Knowledge Sources
  const fetchedContents: string[] = []
  if (validated.urls && validated.urls.length > 0) {
    for (const url of validated.urls) {
      const content = await fetchUrlContent(url)
      fetchedContents.push(`URL: ${url}\nContent: ${content}`)
    }
  }

  if (validated.manualContext && validated.manualContext.trim()) {
    fetchedContents.push(`Manual Context:\n${validated.manualContext}`)
  }

  let summarizedContext = ''
  if (fetchedContents.length > 0) {
    summarizedContext = await summarizeSources(apiKey, fetchedContents)
  }

  // 5. Construct Prompt
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
    validated.postCount,
    summarizedContext || undefined
  )

  // 6. Call OpenAI
  const result = await callOpenAI(apiKey, prompt).catch(error => {
    const message = error instanceof Error ? error.message : 'Failed to generate content'
    return { error: message }
  })

  if ('error' in result) {
    return { success: false, error: result.error }
  }

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
  return { success: true, count: result.posts.length, posts: result.posts }
}
