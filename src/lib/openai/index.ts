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

type OpenAIErrorLike = {
  status?: number
  code?: string
}

export async function callOpenAI(apiKey: string, prompt: string) {
  const openai = new OpenAI({ apiKey })

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional social media content generator. Follow the requested output language exactly and always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
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
