import { getIntegrations } from '@/actions/settings'
import { IntegrationSettingsForm } from '@/components/settings/integration-settings-form'
import { PageHeader } from '@/components/ui/page-header'

export default async function SettingsPage() {
  const integrations = await getIntegrations()
  
  const openai = integrations.find(i => i.provider === 'openai')
  const buffer = integrations.find(i => i.provider === 'buffer')

  return (
    <div className="space-y-6">
      <PageHeader 
        title="การตั้งค่า" 
        subtitle="จัดการการเชื่อมต่อ API และกุญแจสำคัญสำหรับระบบ AI และการเผยแพร่"
      />
      <div className="max-w-3xl mx-auto pb-20">
        <IntegrationSettingsForm 
            openaiStatus={openai?.updated_at} 
            bufferStatus={buffer?.updated_at} 
        />
      </div>
    </div>
  )
}
