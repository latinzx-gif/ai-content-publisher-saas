export interface BrandProfile {
  name: string
  business_type: string
  target_audience: string
  tone: string
  personality: string
}

export function getGeneratePostsPrompt(
  brand: BrandProfile,
  topic: string,
  tone: string,
  personality: string,
  count: number
) {
  return `You are an expert social media content creator. Your task is to generate ${count} social media posts in Thai language for the following brand and topic.

Brand Context:
- Name: ${brand.name}
- Business Type: ${brand.business_type}
- Target Audience: ${brand.target_audience}
- Default Tone: ${brand.tone}
- Default Personality: ${brand.personality}

Current Task:
- Topic: ${topic}
- Requested Tone: ${tone}
- Requested Personality: ${personality}

Requirements:
1. Language: Thai (Professional, engaging, and localized).
2. Format: Strictly JSON output.
3. Content Angle Mix: Ensure a diverse mix of the following angles:
   - Educational
   - FAQ
   - Checklist
   - Warning
   - Myth vs Fact
   - Case Study
   - Common Mistake
   - Action Plan
4. Platform: Facebook (but adaptable).

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
