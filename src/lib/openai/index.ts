import OpenAI from 'openai'
import { z } from 'zod'

export const GeneratedPostSchema = z.object({
  title: z.string(),
  caption: z.string(),
  hashtags: z.string(),
  platform: z.string().default('facebook'),
  angle_type: z.enum([
    'Educational',
    'FAQ',
    'Checklist',
    'Warning',
    'Myth vs Fact',
    'Case Study',
    'Common Mistake',
    'Action Plan'
  ])
})

export const OpenAIResponseSchema = z.object({
  posts: z.array(GeneratedPostSchema)
})

export type GeneratedPost = z.infer<typeof GeneratedPostSchema>

interface CallOpenAIOptions {
  wordCount?: string | number | null
  postCount?: number | null
}

type OpenAIErrorLike = {
  status?: number
  code?: string
}

const WORD_COUNT_TOKEN_MAP = [
  { words: 250, tokens: 700 },
  { words: 500, tokens: 1200 },
  { words: 800, tokens: 1900 },
  { words: 1200, tokens: 2800 },
] as const

const DEFAULT_WORD_COUNT = 500
const MAX_GENERATION_TOKENS = 16_000

function normalizeWordCount(value?: string | number | null) {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value || ''), 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_WORD_COUNT
  return parsed
}

function getPerPostMaxTokens(wordCount?: string | number | null) {
  const normalized = normalizeWordCount(wordCount)
  return WORD_COUNT_TOKEN_MAP.find(entry => normalized <= entry.words)?.tokens || WORD_COUNT_TOKEN_MAP[WORD_COUNT_TOKEN_MAP.length - 1].tokens
}

export function getGenerationMaxTokens(options: CallOpenAIOptions = {}) {
  const postCount = Number.isFinite(options.postCount || 0) && (options.postCount || 0) > 0 ? Number(options.postCount) : 1
  const requestedTokens = getPerPostMaxTokens(options.wordCount) * postCount
  return Math.min(requestedTokens, MAX_GENERATION_TOKENS)
}

export async function callOpenAI(apiKey: string, prompt: string, options: CallOpenAIOptions = {}) {
  const openai = new OpenAI({ apiKey })

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional social media content generator. Follow the requested output language exactly and always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: getGenerationMaxTokens(options)
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Empty response from OpenAI')

    const parsed = JSON.parse(content)
    return OpenAIResponseSchema.parse(parsed)
  } catch (error) {
    const openAIError = error as OpenAIErrorLike
    if (openAIError.status === 401 || openAIError.code === 'invalid_api_key') {
      throw new Error('OpenAI API key is invalid. Update it in Settings and try again.')
    }

    if (error instanceof z.ZodError) {
      throw new Error('AI output format is invalid')
    }
    console.error('OpenAI API Error:', error)
    throw error
  }
}
