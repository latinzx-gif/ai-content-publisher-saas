import { GenerateForm } from '@/components/generate/generate-form'
import { PageHeader } from '@/components/ui/page-header'
import { getCurrentOwner, getDbClient } from '@/lib/owner-context'

export default async function GeneratePage() {
  const supabase = await getDbClient()
  const user = await getCurrentOwner()

  if (!user) return null

  // Check Brand Profile
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
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
    <div className="max-w-5xl mx-auto px-6 py-8 md:px-8 md:py-10 space-y-6">
      <PageHeader 
        title="Editor Canvas" 
        subtitle="Draft premium social media posts aligned with your brand guidelines."
      />
      <div className="w-full">
        <GenerateForm initialBrand={brand} hasOpenAIKey={!!integration} />
      </div>
    </div>
  )
}
