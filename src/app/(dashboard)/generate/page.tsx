import { GenerateForm } from '@/components/generate/generate-form'
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
    <div className="flex-1 bg-[#FAF9F6] text-slate-800 p-6 sm:p-8 flex flex-col space-y-6 select-none font-sans min-h-screen">
      <div className="w-full">
        <GenerateForm initialBrand={brand} hasOpenAIKey={!!integration} />
      </div>
    </div>
  )
}
