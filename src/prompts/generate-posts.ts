export interface BrandProfile {
  name: string
  business_type: string
  target_audience: string
  tone: string
  personality: string
  brand_description?: string | null
  brand_instructions?: string | null
  content_rules?: string | null
  image_rules?: string | null
}

export type ContentLanguage = 'TH' | 'EN' | 'CN' | 'JP'
export type HashtagCount = 0 | 5 | 10 | 15

interface GeneratePromptOptions {
  language: ContentLanguage
  secondaryLanguage?: ContentLanguage
  outputMode?: string
  hashtagCount: HashtagCount
  manualHashtags?: string[]
  knowledgeContext?: string
  platform?: string
  audience?: string
  objective?: string
  format?: string
  wordCount?: string
}

const LANGUAGE_LABELS: Record<ContentLanguage, string> = {
  TH: 'Thai',
  EN: 'English',
  CN: 'Chinese',
  JP: 'Japanese',
}

function compact(value?: string | null, maxLength = 1200) {
  return value?.trim().replace(/\s+/g, ' ').slice(0, maxLength) || ''
}

export function getGeneratePostsPrompt(
  brand: BrandProfile,
  topic: string,
  tone: string,
  personality: string,
  count: number,
  options: GeneratePromptOptions
) {
  const outputLanguage = LANGUAGE_LABELS[options.language]
  const contextSection = options.knowledgeContext
    ? `\nKnowledge Sources and Manual Context:\n${options.knowledgeContext}\n`
    : ''

  const memoryLines = [
    ['Brand Description', compact(brand.brand_description)],
    ['Brand Instructions', compact(brand.brand_instructions)],
    ['Content Rules', compact(brand.content_rules)],
    ['Image Rules', compact(brand.image_rules)],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `- ${label}: ${value}`)
    .join('\n')

  const memorySection = memoryLines
    ? `\nBrand Memory:\n${memoryLines}\n`
    : ''

  const manualTags = options.manualHashtags?.map(tag => tag.replace(/^#/, '').trim()).filter(Boolean) || []
  const hashtagInstruction = options.hashtagCount === 0
    ? 'Set hashtags to an empty string. Do not generate hashtags.'
    : `Generate up to ${options.hashtagCount} relevant hashtags. Include these manual hashtags if relevant, but do not exceed ${options.hashtagCount} total: ${manualTags.map(tag => `#${tag}`).join(' ') || 'none'}.`

  const audienceTarget = options.audience ? `- Target Audience: ${options.audience}` : `- Default Audience: ${brand.target_audience}`
  const platformTarget = options.platform || 'Facebook'
  const objectiveTarget = options.objective || 'Not specified'
  const formatTarget = options.format || 'Educational Post'
  const wordCountTarget = options.wordCount ? `Aim for approximately ${options.wordCount} words per post.` : ''

  let languageInstruction = `Write the title, caption, and hashtags entirely in ${outputLanguage}. Do not mix languages unless a brand rule explicitly requires a proper noun.`
  
  if (options.outputMode && options.outputMode.toLowerCase().includes('bilingual') && options.secondaryLanguage) {
    const secondaryLabel = LANGUAGE_LABELS[options.secondaryLanguage] || options.secondaryLanguage
    languageInstruction = `Write the title, caption, and hashtags bilingually. Provide the primary version in ${outputLanguage}, followed immediately by the secondary version in ${secondaryLabel} within the same caption string.`
  }

  return `You are an expert social media content creator. Generate ${count} social media posts for the following brand and topic.

Brand Context:
- Name: ${brand.name}
- Business Type: ${brand.business_type}
${audienceTarget}
- Default Tone: ${brand.tone}
- Default Personality: ${brand.personality}
${memorySection}
${contextSection}
Current Task:
- Topic: ${topic}
- Requested Tone: ${tone}
- Requested Personality: ${personality}
- Selected Platform: ${platformTarget}
- Objective: ${objectiveTarget}
- Format: ${formatTarget}
- Word Count: ${wordCountTarget}
- Selected Language: ${outputLanguage}

Requirements:
1. Language: ${languageInstruction}
2. Format: Strictly JSON output.
3. Brand Memory: Follow Brand Description, Brand Instructions, Content Rules, Image Rules, Knowledge Sources, and Current Topic. Image Rules are guidance only; do not generate image prompts or image assets.
4. Hashtags: ${hashtagInstruction}
5. Content Angle Mix: Ensure a diverse mix of the following angles:
   - Educational
   - FAQ
   - Checklist
   - Warning
   - Myth vs Fact
   - Case Study
   - Common Mistake
   - Action Plan
6. Platform Style: Adapt the formatting, spacing, and tone specifically for ${platformTarget}.

JSON Structure:
{
  "posts": [
    {
      "title": "Hook sentence / Catchy title",
      "caption": "The main body content of the post",
      "hashtags": "List of relevant hashtags starting with #",
      "platform": "facebook",
      "angle_type": "The specific angle used from the list above"
    }
  ]
}

Important: Do not include any text before or after the JSON. Output only valid JSON.`
}
