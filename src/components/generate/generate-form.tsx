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
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Layout, Sliders, Settings2, Rocket } from 'lucide-react'

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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [successCount, setSuccessCount] = useState<number | null>(null)
  
  const [selectedTopic, setSelectedTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [formData, setFormData] = useState({
    tone: initialBrand?.tone || '',
    personality: initialBrand?.personality || '',
    postCount: 5 as 5 | 10
  })

  const stages = [
    { label: 'Preparing AI Request', desc: 'Analyzing brand profile and topic guidelines' },
    { label: 'Generating Content', desc: 'Drafting social media posts via GPT-4o' },
    { label: 'Formatting Posts', desc: 'Structuring hooks, captions, and hashtags' },
    { label: 'Saving Drafts', desc: 'Storing generated posts in database storage' }
  ]

  async function handleSubmit() {
    const finalTopic = selectedTopic === 'custom' ? customTopic : selectedTopic
    
    setLoading(true)
    setLoadingStage(0)
    
    // Simulate step progress increments every 2.5 seconds
    const intervalId = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < 3) return prev + 1
        return prev
      })
    }, 2500)

    try {
      const result = await generatePosts({
        topic: finalTopic,
        ...formData
      })
      setSuccessCount(result.count)
      toast.success(`สร้างโพสต์สำเร็จ ${result.count} รายการ!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'
      toast.error(message)
    } finally {
      clearInterval(intervalId)
      setLoading(false)
    }
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  if (loading) {
    return (
      <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden animate-in fade-in duration-300">
        <CardContent className="p-12 text-center space-y-8 flex flex-col items-center justify-center min-h-[450px]">
          <div className="relative">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Generating Content...</h3>
            <p className="text-gray-500 text-base font-semibold max-w-sm mx-auto leading-relaxed">
              Please wait while AI creates your posts.
            </p>
          </div>

          <div className="w-full max-w-xs mx-auto space-y-4 pt-4 text-left">
            {stages.map((stage, idx) => {
              const isCompleted = loadingStage > idx;
              const isActive = loadingStage === idx;
              return (
                <div key={idx} className={cn("flex items-start gap-3 transition-opacity duration-300", !isCompleted && !isActive ? "opacity-40" : "opacity-100")}>
                  <div className="flex h-5 w-5 items-center justify-center shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isActive ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn("text-sm font-bold leading-none", isActive ? "text-indigo-700" : isCompleted ? "text-gray-900" : "text-gray-400")}>
                      {stage.label}
                    </p>
                    {isActive && (
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">{stage.desc}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (successCount !== null) {
    return (
      <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden animate-in zoom-in duration-500">
        <CardContent className="p-12 text-center space-y-8">
          <div className="mx-auto w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner border border-green-100">
            <Rocket className="w-12 h-12" />
          </div>
          <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">คลังคอนเทนต์พร้อมแล้ว!</h2>
              <p className="text-gray-500 text-lg">เราได้สร้างโพสต์ให้คุณ {successCount} รายการตามสไตล์ที่กำหนด</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/drafts" className={cn(buttonVariants({ size: 'lg' }), "bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 px-10 h-14 rounded-2xl font-bold text-lg")}>
              ตรวจสอบโพสต์เลย <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Button variant="ghost" size="lg" onClick={() => { setSuccessCount(null); setStep(1); }} className="h-14 rounded-2xl font-bold text-gray-400">
              สร้างใหม่อีกครั้ง
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Step Indicator */}
      <div className="flex justify-between items-center px-2">
          {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300",
                      step === i ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110" : 
                      step > i ? "bg-green-500 text-white" : "bg-white text-gray-300 border border-gray-200"
                  )}>
                      {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                  </div>
                  {i < 3 && <div className={cn("w-12 h-0.5 rounded-full", step > i ? "bg-green-500" : "bg-gray-100")} />}
              </div>
          ))}
      </div>

      <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white animate-in slide-in-from-bottom-8 duration-700">
        <CardHeader className="p-8 border-b bg-gray-50/50">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    {step === 1 && <Layout className="w-5 h-5 text-blue-600" />}
                    {step === 2 && <Sliders className="w-5 h-5 text-indigo-600" />}
                    {step === 3 && <Settings2 className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-gray-900 tracking-tight">
                        {step === 1 && "Step 1: เลือกหัวข้อ"}
                        {step === 2 && "Step 2: ปรับแต่งสไตล์"}
                        {step === 3 && "Step 3: ตั้งค่าการสร้าง"}
                    </CardTitle>
                    <CardDescription className="font-medium">
                        {step === 1 && "ระบุสิ่งที่คุณต้องการสื่อสารผ่านโซเชียลมีเดีย"}
                        {step === 2 && "กำหนดโทนและบุคลิกภาพของเนื้อหา"}
                        {step === 3 && "ระบุจำนวนโพสต์ที่ต้องการให้ AI ประมวลผล"}
                    </CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent className="p-8 min-h-[300px] flex flex-col justify-center">
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-700">หัวข้อหลัก</Label>
                        <Select value={selectedTopic} onValueChange={(val: string | null) => val && setSelectedTopic(val)}>
                            <SelectTrigger className="h-14 text-lg rounded-2xl border-gray-200 focus:ring-blue-500 px-6">
                                <SelectValue placeholder="เลือกหัวข้อคอนเทนต์..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                {TOPIC_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className="h-12 font-medium">{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedTopic === 'custom' && (
                        <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                            <Label className="text-base font-bold text-gray-700">ระบุหัวข้อของคุณ</Label>
                            <Input
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                placeholder="เช่น วิธีการยื่นภาษีสำหรับมือใหม่..."
                                className="h-14 text-lg rounded-2xl border-gray-200 focus:ring-blue-500 px-6"
                            />
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-base font-bold text-gray-700">โทนภาษา</Label>
                            <Select value={formData.tone} onValueChange={(val: string | null) => val && setFormData({ ...formData, tone: val })}>
                                <SelectTrigger className="h-14 text-lg rounded-2xl">
                                    <SelectValue placeholder="เลือกโทน..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {TONE_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-bold text-gray-700">บุคลิกภาพ</Label>
                            <Select value={formData.personality} onValueChange={(val: string | null) => val && setFormData({ ...formData, personality: val })}>
                                <SelectTrigger className="h-14 text-lg rounded-2xl">
                                    <SelectValue placeholder="เลือกบุคลิก..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {PERSONALITY_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 text-blue-800">
                        <Sparkles className="w-6 h-6 shrink-0 mt-1" />
                        <p className="text-sm leading-relaxed font-medium">สไตล์เหล่านี้จะช่วยให้ AI สร้างเนื้อหาที่ตรงกับความต้องการของคุณมากที่สุด หากเลือกเป็น Expert โพสต์จะเน้นข้อมูลเชิงลึกเป็นพิเศษ</p>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-700">จำนวนที่ต้องการสร้าง</Label>
                        <Select value={formData.postCount.toString()} onValueChange={(val: string | null) => val && setFormData({ ...formData, postCount: parseInt(val) as 5 | 10 })}>
                            <SelectTrigger className="h-14 text-lg rounded-2xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                <SelectItem value="5" className="h-12 font-bold text-lg">5 โพสต์</SelectItem>
                                <SelectItem value="10" className="h-12 font-bold text-lg">10 โพสต์</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="border-t pt-8 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Selected Model</span>
                            <span className="text-sm font-black text-gray-900">GPT-4o (High Quality)</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Language</span>
                            <span className="text-sm font-black text-gray-900">Thai (ภาษาไทย)</span>
                        </div>
                    </div>
                </div>
            )}
        </CardContent>

        <CardFooter className="p-8 border-t bg-gray-50/30 flex gap-4">
            {step > 1 && (
                <Button variant="ghost" onClick={prevStep} className="h-14 px-8 rounded-2xl font-bold text-gray-400" disabled={loading}>
                    <ArrowLeft className="mr-2 w-5 h-5" /> ย้อนกลับ
                </Button>
            )}
            <Button 
                onClick={step === 3 ? handleSubmit : nextStep}
                className={cn(
                    "flex-1 h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98]",
                    step === 3 ? "bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100" : "bg-gray-900 hover:bg-black text-white"
                )}
                disabled={loading || (step === 1 && !selectedTopic)}
            >
                {loading ? (
                    <>
                        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
                        AI กำลังร่ายมนตร์...
                    </>
                ) : (
                    <>
                        {step === 3 ? "เริ่มการสร้างโพสต์" : "ดำเนินการต่อ"}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                )}
            </Button>
        </CardFooter>
      </Card>
      
      {!hasOpenAIKey && (
          <p className="text-center text-sm font-bold text-red-500 bg-red-50 py-3 rounded-2xl border border-red-100">
              * กรุณาเชื่อมต่อ OpenAI API Key ในหน้า Settings ก่อนเริ่มใช้งาน
          </p>
      )}
    </div>
  )
}
