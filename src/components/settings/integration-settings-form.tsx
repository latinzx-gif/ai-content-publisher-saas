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

interface IntegrationSettingsFormProps {
  openaiStatus?: string | null
  bufferStatus?: string | null
}

export function IntegrationSettingsForm({ openaiStatus, bufferStatus }: IntegrationSettingsFormProps) {
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
    if (!keys[provider]) return toast.error('กรุณาระบุ API Key หรือ Access Token')
    
    setLoading(provider)
    try {
      await saveIntegrationSecret(provider, keys[provider])
      toast.success(`บันทึก ${provider.toUpperCase()} เรียบร้อยแล้ว`)
      setKeys({ ...keys, [provider]: '' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึก'
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
      toast.error('การทดสอบเชื่อมต่อล้มเหลว')
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
                    เชื่อมต่อแล้ว
                </div>
            ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">
                    <AlertCircle className="w-3.5 h-3.5" />
                    ยังไม่ได้เชื่อมต่อ
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
              อัปเดตล่าสุด: {new Date(status).toLocaleString('th-TH')}
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
                กำลังทดสอบ...
              </>
          ) : 'ทดสอบการเชื่อมต่อ'}
        </Button>
        <Button 
          onClick={() => handleSave(provider)} 
          disabled={!!loading || !value}
          className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
        >
          {loading === provider ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                กำลังบันทึก...
              </>
          ) : 'บันทึกข้อมูล'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 gap-10">
      <IntegrationCard 
        provider="openai"
        title="OpenAI Integration"
        description="ใช้สำหรับประมวลผลและสร้างเนื้อหาด้วยปัญญาประดิษฐ์ (GPT-4o)"
        status={openaiStatus}
        value={keys.openai}
        placeholder="sk-..."
        onValueChange={(val) => setKeys({ ...keys, openai: val })}
      />

      <IntegrationCard 
        provider="buffer"
        title="Buffer Integration"
        description="ใช้สำหรับส่งโพสต์ที่อนุมัติแล้วไปยังระบบคิวของ Buffer เพื่อเผยแพร่"
        status={bufferStatus}
        value={keys.buffer}
        placeholder="กรอก Buffer Access Token..."
        onValueChange={(val) => setKeys({ ...keys, buffer: val })}
      />
    </div>
  )
}
