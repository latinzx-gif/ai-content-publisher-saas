import { getIntegrations } from '@/actions/settings'
import { IntegrationSettingsForm } from '@/components/settings/integration-settings-form'

export default async function SettingsPage() {
  const integrations = await getIntegrations()
  
  const openai = integrations.find(i => i.provider === 'openai')
  const buffer = integrations.find(i => i.provider === 'buffer')

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <IntegrationSettingsForm 
          openaiStatus={openai?.updated_at} 
          bufferStatus={buffer?.updated_at} 
      />
    </div>
  )
}
