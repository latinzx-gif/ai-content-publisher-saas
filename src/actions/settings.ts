'use server'

import { encrypt, decrypt } from '@/lib/encryption'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentOwner, requireOwner, getDbClient } from '@/lib/owner-context'

const ReferenceImageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  size: z.number().int().positive().max(2_500_000),
  dataUrl: z.string().startsWith('data:image/').max(4_000_000),
  uploadedAt: z.string().min(1),
})

const BrandProfileSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  business_type: z.string().min(1, 'Business type is required'),
  target_audience: z.string().min(1, 'Target audience is required'),
  tone: z.string().min(1, 'Tone is required'),
  personality: z.string().min(1, 'Personality is required'),
  brand_description: z.string().max(3000).optional().default(''),
  brand_instructions: z.string().max(3000).optional().default(''),
  content_rules: z.string().max(3000).optional().default(''),
  image_rules: z.string().max(3000).optional().default(''),
  reference_images: z.array(ReferenceImageSchema).max(5).optional().default([]),
})

export async function saveBrandProfile(formData: z.infer<typeof BrandProfileSchema>) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const validated = BrandProfileSchema.parse(formData)

  const { error } = await supabase
    .from('brands')
    .upsert({
      user_id: user.id,
      ...validated,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (error) throw new Error(error.message)

  revalidatePath('/profile')
  return { success: true }
}

export async function getBrandProfile() {
  const supabase = await getDbClient()
  const user = await getCurrentOwner()

  if (!user) return null

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data
}

export async function saveIntegrationSecret(provider: 'openai' | 'buffer', api_key: string) {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const encrypted = encrypt(api_key)

  const { error } = await supabase
    .from('integrations')
    .upsert({
      user_id: user.id,
      provider,
      encrypted_value: encrypted,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id, provider' })

  if (error) throw new Error(error.message)

  // Audit log
  await supabase.from('workflow_logs').insert({
    user_id: user.id,
    action: 'integration_saved',
    topic: provider,
    status: 'completed'
  })

  revalidatePath('/settings')
  return { success: true }
}

export async function getIntegrations() {
  const supabase = await getDbClient()
  const user = await getCurrentOwner()

  if (!user) return []

  const { data, error } = await supabase
    .from('integrations')
    .select('provider, updated_at')
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  return data
}

export async function testOpenAIConnection() {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data, error } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'openai')
    .single()

  if (error || !data) return { success: false, message: 'OpenAI key not found' }

  const apiKey = decrypt(data.encrypted_value)

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (response.ok) {
      return { success: true, message: 'Connection successful' }
    } else {
      const errData = await response.json()
      return { success: false, message: errData.error?.message || 'Invalid API key' }
    }
  } catch {
    return { success: false, message: 'Network error' }
  }
}

export async function testBufferConnection() {
  const supabase = await getDbClient()
  const user = await requireOwner()

  const { data, error } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'buffer')
    .single()

  if (error || !data) return { success: false, message: 'Buffer key not found' }

  const accessToken = decrypt(data.encrypted_value)

  try {
    const accountResponse = await fetch('https://api.buffer.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `query BufferAccount {
          account {
            organizations {
              id
              name
            }
          }
        }`,
      }),
    })

    const accountResult = await accountResponse.json()
    const accountError = accountResult.errors?.map((error: { message?: string }) => error.message).filter(Boolean).join('; ')
    if (!accountResponse.ok || accountError) {
      return { success: false, message: accountError || 'Invalid Buffer GraphQL API key' }
    }

    const organizationId = accountResult.data?.account?.organizations?.[0]?.id
    if (!organizationId) {
      return { success: false, message: 'No Buffer organization found for this API key' }
    }

    const channelsResponse = await fetch('https://api.buffer.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `query BufferChannels($organizationId: OrganizationId!) {
          channels(input: { organizationId: $organizationId }) {
            id
            name
            service
          }
        }`,
        variables: { organizationId },
      }),
    })

    const channelsResult = await channelsResponse.json()
    const channelsError = channelsResult.errors?.map((error: { message?: string }) => error.message).filter(Boolean).join('; ')
    if (!channelsResponse.ok || channelsError) {
      return { success: false, message: channelsError || 'Failed to load Buffer channels' }
    }

    const hasFacebookChannel = channelsResult.data?.channels?.some((channel: { service?: string }) => channel.service === 'facebook')
    if (!hasFacebookChannel) {
      return { success: false, message: 'Buffer connected, but no Facebook channel was found' }
    }

    return { success: true, message: 'Buffer GraphQL connection successful' }
  } catch {
    return { success: false, message: 'Network error' }
  }
}
