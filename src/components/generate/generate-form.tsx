'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generatePosts } from '@/actions/generate'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface GenerateFormProps {
  initialBrand?: {
    tone: string
    personality: string
  } | null
  hasOpenAIKey: boolean
}

const TOPIC_OPTIONS = [
  { value: 'กฎหมายแรงงาน', label: 'กฎหมายแรงงาน' },
  { value: 'PDPA / คุ้มครองข้อมูลส่วนบุคคล', label: 'PDPA / คุ้มครองข้อมูลส่วนบุคคล' },
  { value: 'อสังหาริมทรัพย์ / โอนกรรมสิทธิ์', label: 'อสังหาริมทรัพย์ / โอนกรรมสิทธิ์' },
  { value: 'การตลาดธุรกิจบริการ', label: 'การตลาดธุรกิจบริการ' },
  { value: 'custom', label: 'กำหนดหัวข้อเอง (Custom Topic)' },
]

const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Simple', label: 'Simple' },
]

const PERSONALITY_OPTIONS = [
  { value: 'น่าเชื่อถือ', label: 'น่าเชื่อถือ' },
  { value: 'เป็นกันเอง', label: 'เป็นกันเอง' },
  { value: 'จริงจัง', label: 'จริงจัง' },
  { value: 'ทันสมัย', label: 'ทันสมัย' },
  { value: 'ผู้เชี่ยวชาญ', label: 'ผู้เชี่ยวชาญ' },
  { value: 'เน้นขาย', label: 'เน้นขาย' },
]

export function GenerateForm({ initialBrand, hasOpenAIKey }: GenerateFormProps) {
  const [loading, setLoading] = useState(false)
  const [successCount, setSuccessCount] = useState<number | null>(null)
  
  const [selectedTopic, setSelectedTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [formData, setFormData] = useState({
    tone: initialBrand?.tone || '',
    personality: initialBrand?.personality || '',
    postCount: 5 as 5 | 10
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const finalTopic = selectedTopic === 'custom' ? customTopic : selectedTopic
    
    if (!finalTopic) {
      toast.error('กรุณาระบุหัวข้อที่ต้องการสร้าง')
      return
    }

    if (!hasOpenAIKey) {
      toast.error('กรุณาเชื่อม OpenAI API Key ในหน้า Settings ก่อน')
      return
    }
    if (!initialBrand) {
      toast.error('กรุณาตั้งค่า Brand Profile ก่อนสร้างคอนเทนต์')
      return
    }

    setLoading(true)
    setSuccessCount(null)
    try {
      const result = await generatePosts({
        topic: finalTopic,
        ...formData
      })
      setSuccessCount(result.count)
      toast.success(`สร้างโพสต์สำเร็จ ${result.count} รายการ!`)
      setSelectedTopic('')
      setCustomTopic('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างคอนเทนต์'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (successCount !== null) {
    return (
      <Card className="border-green-100 bg-green-50/50 shadow-lg animate-in zoom-in duration-300">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl text-green-800">สร้างคอนเทนต์สำเร็จ!</CardTitle>
          <CardDescription className="text-green-700 text-base">
            AI ได้สร้างโพสต์ให้คุณทั้งหมด {successCount} รายการ และบันทึกเป็นร่างเรียบร้อยแล้ว
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center py-6">
          <Link href="/drafts" className={cn(buttonVariants({ size: 'lg' }), "bg-green-600 hover:bg-green-700 shadow-md px-8")}>
            ดูโพสต์ที่สร้างไว้ <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Button variant="outline" size="lg" onClick={() => setSuccessCount(null)} className="border-green-200 text-green-700 hover:bg-green-100">
            สร้างเพิ่มอีก
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {!hasOpenAIKey && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4 text-amber-800 animate-in fade-in duration-500">
          <div className="bg-amber-100 p-2 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-sm font-medium">
            กรุณาเชื่อม <Link href="/settings" className="underline font-bold hover:text-amber-900 transition-colors">OpenAI API Key</Link> ในหน้า Settings ก่อนเริ่มใช้งาน
          </p>
        </div>
      )}

      {!initialBrand && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 text-blue-800 animate-in fade-in duration-500 delay-150">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium">
            กรุณาตั้งค่า <Link href="/profile" className="underline font-bold hover:text-blue-900 transition-colors">Brand Profile</Link> เพื่อให้ AI เข้าใจสไตล์ของแบรนด์คุณ
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-8">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 fill-current text-blue-200" />
              สร้างคอนเทนต์ใหม่
            </CardTitle>
            <CardDescription className="text-blue-100 text-base">
              เลือกหัวข้อ โทนภาษา และจำนวนโพสต์ที่ต้องการให้ AI สร้าง
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-3">
              <Label htmlFor="topic" className="text-base font-bold text-gray-700">หัวข้อคอนเทนต์</Label>
              <Select 
                value={selectedTopic} 
                onValueChange={(val: string | null) => {
                  if (val) setSelectedTopic(val)
                }}
                disabled={loading}
              >
                <SelectTrigger id="topic" className="h-12 text-base rounded-xl border-gray-200 focus:ring-blue-500">
                  <SelectValue placeholder="เลือกหัวข้อที่ต้องการ..." />
                </SelectTrigger>
                <SelectContent>
                  {TOPIC_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTopic === 'custom' && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="customTopic" className="text-base font-bold text-gray-700">ระบุหัวข้อของคุณ</Label>
                <Input
                  id="customTopic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="เช่น ประโยชน์ของการดื่มน้ำ, วิธีเริ่มทำ SaaS"
                  className="h-12 text-base rounded-xl border-gray-200 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="tone" className="text-base font-bold text-gray-700">โทนภาษา</Label>
                <Select 
                  value={formData.tone} 
                  onValueChange={(val: string | null) => {
                    if (val) setFormData({ ...formData, tone: val })
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="tone" className="h-12 text-base rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue placeholder="เลือกโทนภาษา..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="personality" className="text-base font-bold text-gray-700">บุคลิกภาพ</Label>
                <Select 
                  value={formData.personality} 
                  onValueChange={(val: string | null) => {
                    if (val) setFormData({ ...formData, personality: val })
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="personality" className="h-12 text-base rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue placeholder="เลือกบุคลิก..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PERSONALITY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="postCount" className="text-base font-bold text-gray-700">จำนวนโพสต์</Label>
              <Select 
                value={formData.postCount.toString()} 
                onValueChange={(val: string | null) => {
                  if (val) setFormData({ ...formData, postCount: parseInt(val) as 5 | 10 })
                }}
                disabled={loading}
              >
                <SelectTrigger id="postCount" className="h-12 text-base rounded-xl border-gray-200 focus:ring-blue-500">
                  <SelectValue placeholder="เลือกจำนวนโพสต์..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 โพสต์</SelectItem>
                  <SelectItem value="10">10 โพสต์</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t p-8">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loading || !selectedTopic}
            >
              {loading ? (
                <>
                  <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  กำลังสร้างโพสต์ด้วย AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 fill-current" />
                  สร้างโพสต์ด้วย AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
