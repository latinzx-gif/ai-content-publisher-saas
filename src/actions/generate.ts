'use server'

import { decrypt } from '@/lib/encryption'
import { getGeneratePostsPrompt, type ContentLanguage, type HashtagCount } from '@/prompts/generate-posts'
import { callOpenAI } from '@/lib/openai'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireOwner, getDbClient } from '@/lib/owner-context'
import OpenAI from 'openai'

const GeneratePostsSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  tone: z.string().min(1, 'Tone is required'),
  personality: z.string().min(1, 'Personality is required'),
  postCount: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(10)]),
  urls: z.array(z.string().url()).max(5).optional(),
  manualContext: z.string().max(10000).optional(),
  language: z.enum(['TH', 'EN', 'CN', 'JP']).default('TH'),
  secondaryLanguage: z.enum(['TH', 'EN', 'CN', 'JP']).optional(),
  outputMode: z.string().optional(),
  platform: z.string().optional(),
  audience: z.string().optional(),
  objective: z.string().optional(),
  format: z.string().optional(),
  platformFormat: z.enum(['text_only', 'facebook_post', 'instagram_4_5', 'instagram_square']).default('text_only'),
  wordCount: z.string().optional(),
  hashtagCount: z.union([z.literal(0), z.literal(5), z.literal(10), z.literal(15)]).default(5),
  manualHashtags: z.array(z.string().max(60)).max(15).optional()
})

const SUMMARY_LANGUAGE_LABELS: Record<ContentLanguage, string> = {
  TH: 'Thai',
  EN: 'English',
  CN: 'Chinese',
  JP: 'Japanese',
}

function normalizeHashtags(hashtags: string, maxCount: HashtagCount): string {
  if (maxCount === 0) return ''

  const seen = new Set<string>()
  const tags = hashtags
    .split(/\s+/)
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .filter(tag => {
      const key = tag.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

  return tags.slice(0, maxCount).join(' ')
}

function cleanHtml(html: string): string {
  // Strip script and style blocks completely
  let text = html.replace(/<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/gi, '');
  // Strip all other HTML tags
  text = text.replace(/<[^>]*>?/gm, ' ');
  // Replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function countApproxWords(text: string): number {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return 0

  const spacedWords = normalized.match(/[\p{L}\p{N}]+/gu) || []
  if (spacedWords.length > 1) return spacedWords.length

  const nonWhitespaceChars = normalized.replace(/\s/g, '').length
  return Math.max(1, Math.round(nonWhitespaceChars / 5))
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

async function summarizeSources(apiKey: string, rawTexts: string[], language: ContentLanguage): Promise<string> {
  const combined = rawTexts.join('\n\n--- SOURCE BUNDLE ---\n\n');
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { 
        role: 'system', 
        content: `You are an AI research assistant. Summarize the following sources into a concise summary in ${SUMMARY_LANGUAGE_LABELS[language]}, focusing on legal compliance, key facts, and essential details that can be used to write informative social media posts.`
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
    summarizedContext = await summarizeSources(apiKey, fetchedContents, validated.language)
  }

  // 5. Construct Prompt
  const prompt = getGeneratePostsPrompt(
    {
      name: brand.name,
      business_type: brand.business_type,
      target_audience: brand.target_audience,
      tone: brand.tone,
      personality: brand.personality,
      brand_description: brand.brand_description,
      brand_instructions: brand.brand_instructions,
      content_rules: brand.content_rules,
      image_rules: brand.image_rules
    },
    validated.topic,
    validated.tone,
    validated.personality,
    validated.postCount,
    {
      language: validated.language,
      secondaryLanguage: validated.secondaryLanguage,
      outputMode: validated.outputMode,
      platform: validated.platform,
      audience: validated.audience,
      objective: validated.objective,
      format: validated.format,
      wordCount: validated.wordCount,
      hashtagCount: validated.hashtagCount as HashtagCount,
      manualHashtags: validated.manualHashtags,
      knowledgeContext: summarizedContext || undefined
    }
  )

  // 6. Call OpenAI
  const result = await callOpenAI(apiKey, prompt).catch(error => {
    const message = error instanceof Error ? error.message : 'Failed to generate content'
    return { error: message }
  })

  if ('error' in result) {
    return { success: false, error: result.error }
  }

  const normalizedPosts = result.posts.map(post => ({
    ...post,
    hashtags: normalizeHashtags(post.hashtags, validated.hashtagCount as HashtagCount)
  }))

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
  const postsToInsert = normalizedPosts.map(post => {
    const creativeStatus = validated.platformFormat === 'text_only' ? 'not_required' : 'needs_review'

    return {
      user_id: user.id,
      workflow_id: log.id,
      content: `${post.title}\n\n${post.caption}\n\n${post.hashtags}`,
      status: 'draft',
      metadata: {
        topic: validated.topic,
        tone: validated.tone,
        personality: validated.personality,
        angle_type: post.angle_type,
        platform: validated.platform || post.platform,
        audience: validated.audience,
        objective: validated.objective,
        format: validated.format,
        output_mode: validated.outputMode,
        secondary_language: validated.secondaryLanguage,
        requested_word_count: validated.wordCount,
        actual_word_count: countApproxWords(post.caption),
        wordCount: validated.wordCount,
        platform_format: validated.platformFormat,
        creative_status: creativeStatus,
        image_url: null,
        image_source: null,
        title: post.title,
        caption: post.caption,
        hashtags: post.hashtags,
        language: validated.language,
        hashtag_count: validated.hashtagCount,
        manual_hashtags: validated.manualHashtags || []
      }
    }
  })

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
  return { success: true, count: normalizedPosts.length, posts: normalizedPosts }
}
