import { createClient } from '@/lib/supabase/server'
import { GenerateForm } from '@/components/generate/generate-form'
import { PageHeader } from '@/components/ui/page-header'

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
    <div className="space-y-6">
      <PageHeader 
        title="สร้างคอนเทนต์" 
        subtitle="เปลี่ยนหัวข้อของคุณให้เป็นโพสต์โซเชียลมีเดียคุณภาพสูงด้วยพลังของ AI"
      />
      <div className="max-w-3xl mx-auto">
        <GenerateForm initialBrand={brand} hasOpenAIKey={!!integration} />
      </div>
    </div>
  )
}
