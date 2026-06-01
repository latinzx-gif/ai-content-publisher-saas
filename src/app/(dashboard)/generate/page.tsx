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
    <div className="flex-1 bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      <div className="space-y-1 text-left pb-3 border-b border-[#E6DFD5] dark:border-slate-800">
        <h2 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
          Editor Canvas
        </h2>
        <p className="text-xs text-[#7C756C] dark:text-slate-400">
          Draft premium social media posts aligned with your brand guidelines.
        </p>
      </div>
      <div className="w-full">
        <GenerateForm initialBrand={brand} hasOpenAIKey={!!integration} />
      </div>
    </div>
  )
}
