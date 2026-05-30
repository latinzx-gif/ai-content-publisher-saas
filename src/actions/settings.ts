'use server'

import { createClient } from '@/lib/supabase/server'
import { encrypt, decrypt } from '@/lib/encryption'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const BrandProfileSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  business_type: z.string().min(1, 'Business type is required'),
  target_audience: z.string().min(1, 'Target audience is required'),
  tone: z.string().min(1, 'Tone is required'),
  personality: z.string().min(1, 'Personality is required'),
})

export async function saveBrandProfile(formData: z.infer<typeof BrandProfileSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('integrations')
    .select('provider, updated_at')
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  return data
}

export async function testOpenAIConnection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('integrations')
    .select('encrypted_value')
    .eq('user_id', user.id)
    .eq('provider', 'buffer')
    .single()

  if (error || !data) return { success: false, message: 'Buffer key not found' }

  const accessToken = decrypt(data.encrypted_value)

  try {
    const response = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${accessToken}`)

    if (response.ok) {
      return { success: true, message: 'Connection successful' }
    } else {
      return { success: false, message: 'Invalid Access Token' }
    }
  } catch {
    return { success: false, message: 'Network error' }
  }
}
