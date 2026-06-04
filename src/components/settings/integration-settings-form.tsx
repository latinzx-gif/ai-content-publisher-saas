'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { saveIntegrationSecret, testOpenAIConnection, testBufferConnection } from '@/actions/settings'
import { toast } from 'sonner'
import { KeyRound, ShieldCheck, Activity, Link2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import { PageHeader } from '@/components/ui/page-header'

interface IntegrationSettingsFormProps {
  openaiStatus?: string | null
  bufferStatus?: string | null
}

export function IntegrationSettingsForm({ openaiStatus, bufferStatus }: IntegrationSettingsFormProps) {
  const { t, currentLanguage } = useLanguage()
  const [loading, setLoading] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [showKey, setShowKey] = useState({
    openai: false,
    buffer: false,
  })
  const [keys, setKeys] = useState({
    openai: '',
    buffer: '',
  })

  async function handleSave(provider: 'openai' | 'buffer') {
    if (!keys[provider]) return toast.error(t('settings.error.emptyKey'))
    
    setLoading(provider)
    try {
      await saveIntegrationSecret(provider, keys[provider])
      toast.success(t('settings.success.save', { provider: provider.toUpperCase() }))
      setKeys({ ...keys, [provider]: '' })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('settings.error.save')
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
      toast.error(t('settings.error.test'))
    } finally {
      setTesting(null)
    }
  }

  const IntegrationCard = ({ 
    provider, 
    title, 
    description, 
    status, 
    value, 
    placeholder,
    onValueChange 
  }: { 
    provider: 'openai' | 'buffer'
    title: string
    description: string
    status?: string | null
    value: string
    placeholder: string
    onValueChange: (val: string) => void
  }) => (
    <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-white border-b pb-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border",
                    provider === 'openai' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                    {provider === 'openai' ? <KeyRound className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
                </div>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </div>
            {status ? (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-tighter">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t('settings.connected')}
                </div>
            ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t('settings.disconnected')}
                </div>
            )}
        </div>
        <CardDescription className="mt-2 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <div className="space-y-3">
          <Label htmlFor={`${provider}_key`} className="text-sm font-bold text-gray-700">
            {provider === 'openai' ? 'OpenAI API Key' : 'Buffer Access Token'}
          </Label>
          <div className="relative">
            <Input
              id={`${provider}_key`}
              type={showKey[provider] ? 'text' : 'password'}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
              placeholder={status ? '••••••••••••••••••••••••••••••••' : placeholder}
              className="h-12 text-base rounded-xl border-gray-200 pr-20 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKey({ ...showKey, [provider]: !showKey[provider] })}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showKey[provider] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {status && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
          {status && (
            <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {t('settings.updatedAt', { time: new Date(status).toLocaleString(currentLanguage === 'th' ? 'th-TH' : 'en-US') })}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50/50 border-t p-6 flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={() => handleTest(provider)} 
          disabled={!!testing || !!loading || !status}
          className="flex-1 h-11 rounded-xl font-bold border-gray-200 bg-white"
        >
          {testing === provider ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                {t('settings.testing')}
              </>
          ) : t('settings.testConnection')}
        </Button>
        <Button 
          onClick={() => handleSave(provider)} 
          disabled={!!loading || !value}
          className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
        >
          {loading === provider ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('settings.saving')}
              </>
          ) : t('settings.saveBtn')}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('settings.title')} 
        subtitle={t('settings.subtitle')}
      />
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
              {currentLanguage === 'th' ? 'ความพร้อมก่อนเดโม' : 'Demo readiness'}
            </p>
            <h3 className="text-sm font-black">
              {currentLanguage === 'th' ? 'เชื่อมต่อบริการหลักก่อนสร้างและเผยแพร่คอนเทนต์' : 'Connect core services before generating and publishing content'}
            </h3>
            <p className="max-w-2xl text-xs font-semibold leading-relaxed text-blue-700">
              {currentLanguage === 'th'
                ? 'OpenAI ใช้สำหรับสร้างข้อความและรูปภาพ ส่วน Buffer ใช้ส่งโพสต์ที่อนุมัติแล้วไปยังช่องทางเผยแพร่'
                : 'OpenAI powers text and image generation. Buffer sends approved posts to the connected publishing channel.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <span className={cn("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider", openaiStatus ? "border-green-200 bg-white text-green-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
              OpenAI {openaiStatus ? 'Ready' : 'Needed'}
            </span>
            <span className={cn("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider", bufferStatus ? "border-green-200 bg-white text-green-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
              Buffer {bufferStatus ? 'Ready' : 'Needed'}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-10">
        <IntegrationCard 
          provider="openai"
          title="OpenAI Integration"
          description={t('settings.openai.desc')}
          status={openaiStatus}
          value={keys.openai}
          placeholder="sk-..."
          onValueChange={(val) => setKeys({ ...keys, openai: val })}
        />

        <IntegrationCard 
          provider="buffer"
          title="Buffer Integration"
          description={t('settings.buffer.desc')}
          status={bufferStatus}
          value={keys.buffer}
          placeholder={t('settings.buffer.placeholder')}
          onValueChange={(val) => setKeys({ ...keys, buffer: val })}
        />
      </div>
    </div>
  )
}
