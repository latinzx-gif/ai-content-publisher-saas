import { createClient } from '@/lib/supabase/server'
import { GenerateForm } from '@/components/generate/generate-form'

export default async function GeneratePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Check Brand Profile
  const { data: brand } = await supabase
    .from('brands')
    .select('tone, personality')
    .eq('user_id', user.id)
    .single()

  // Check OpenAI Key
  const { data: integration } = await supabase
    .from('integrations')
    .select('id')
    .eq('user_id', user.id)
    .eq('provider', 'openai')
    .single()

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Generate Content</h1>
        <p className="text-muted-foreground">Transform your topics into high-quality social media posts.</p>
      </div>
      <GenerateForm initialBrand={brand} hasOpenAIKey={!!integration} />
    </div>
  )
}
