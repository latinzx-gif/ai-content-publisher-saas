import { getIntegrations } from '@/actions/settings'
import { IntegrationSettingsForm } from '@/components/settings/integration-settings-form'

export default async function SettingsPage() {
  const integrations = await getIntegrations()
  
  const openai = integrations.find(i => i.provider === 'openai')
  const buffer = integrations.find(i => i.provider === 'buffer')

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your AI and Publishing integrations.</p>
      </div>
      <IntegrationSettingsForm 
        openaiStatus={openai?.updated_at} 
        bufferStatus={buffer?.updated_at} 
      />
    </div>
  )
}
