'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { saveIntegrationSecret, testOpenAIConnection, testBufferConnection } from '@/actions/settings'
import { toast } from 'sonner'

interface IntegrationSettingsFormProps {
  openaiStatus?: string | null
  bufferStatus?: string | null
}

export function IntegrationSettingsForm({ openaiStatus, bufferStatus }: IntegrationSettingsFormProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [keys, setKeys] = useState({
    openai: '',
    buffer: '',
  })

  async function handleSave(provider: 'openai' | 'buffer') {
    if (!keys[provider]) return toast.error('API key is required')
    
    setLoading(provider)
    try {
      await saveIntegrationSecret(provider, keys[provider])
      toast.success(`${provider.toUpperCase()} key saved successfully`)
      setKeys({ ...keys, [provider]: '' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save key'
      toast.error(message)
    } finally {
      setLoading(null)
    }
  }

  async function handleTest(provider: 'openai' | 'buffer') {
    setTesting(provider)
    try {
      const result = provider === 'openai' 
        ? await testOpenAIConnection() 
        : await testBufferConnection()
      
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Test failed')
    } finally {
      setTesting(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Integration</CardTitle>
          <CardDescription>
            Provide your OpenAI API key for content generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai_key">API Key</Label>
            <Input
              id="openai_key"
              type="password"
              value={keys.openai}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeys({ ...keys, openai: e.target.value })}
              placeholder={openaiStatus ? '••••••••••••••••' : 'sk-...'}
            />
            {openaiStatus && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(openaiStatus).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => handleTest('openai')} 
            disabled={!!testing || !!loading}
          >
            {testing === 'openai' ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            onClick={() => handleSave('openai')} 
            disabled={!!loading || !keys.openai}
          >
            {loading === 'openai' ? 'Saving...' : 'Save Key'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buffer Integration</CardTitle>
          <CardDescription>
            Provide your Buffer Access Token for publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buffer_key">Access Token</Label>
            <Input
              id="buffer_key"
              type="password"
              value={keys.buffer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeys({ ...keys, buffer: e.target.value })}
              placeholder={bufferStatus ? '••••••••••••••••' : 'Enter Buffer Access Token'}
            />
            {bufferStatus && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(bufferStatus).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => handleTest('buffer')} 
            disabled={!!testing || !!loading}
          >
            {testing === 'buffer' ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            onClick={() => handleSave('buffer')} 
            disabled={!!loading || !keys.buffer}
          >
            {loading === 'buffer' ? 'Saving...' : 'Save Token'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
