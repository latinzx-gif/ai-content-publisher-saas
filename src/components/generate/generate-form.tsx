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
import { Sparkles, ArrowRight, CheckCircle2, Cpu, SlidersHorizontal, BookOpen, Layers, Terminal, AlertTriangle } from 'lucide-react'

interface GenerateFormProps {
  initialBrand?: {
    name: string
    business_type: string
    target_audience: string
    tone: string
    personality: string
  } | null
  hasOpenAIKey: boolean
}

const TOPIC_OPTIONS = [
  { value: 'กฎหมายแรงงาน', label: 'กฎหมายแรงงาน (Labor Law)' },
  { value: 'PDPA / คุ้มครองข้อมูลส่วนบุคคล', label: 'PDPA & Data Privacy' },
  { value: 'อสังหาริมทรัพย์ / โอนกรรมสิทธิ์', label: 'Real Estate & Property Law' },
  { value: 'การตลาดธุรกิจบริการ', label: 'Service Business Marketing' },
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
  { value: 'น่าเชื่อถือ', label: 'น่าเชื่อถือ (Trustworthy)' },
  { value: 'เป็นกันเอง', label: 'เป็นกันเอง (Approachable)' },
  { value: 'จริงจัง', label: 'จริงจัง (Serious)' },
  { value: 'ทันสมัย', label: 'ทันสมัย (Modern)' },
  { value: 'ผู้เชี่ยวชาญ', label: 'ผู้เชี่ยวชาญ (Authority)' },
  { value: 'เน้นขาย', label: 'เน้นขาย (Sales)' },
]

export function GenerateForm({ initialBrand, hasOpenAIKey }: GenerateFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [successCount, setSuccessCount] = useState<number | null>(null)
  
  const [selectedTopic, setSelectedTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [formData, setFormData] = useState({
    tone: initialBrand?.tone || 'Professional',
    personality: initialBrand?.personality || 'น่าเชื่อถือ',
    postCount: 5 as 5 | 10
  })

  const stages = [
    { label: 'Preparing AI Request', desc: 'Analyzing brand profile parameters and topic parameters' },
    { label: 'Generating Content drafts', desc: 'Drafting multi-format social posts via GPT-4o context engines' },
    { label: 'Formatting and Structuring', desc: 'Adding hooks, captions, and platform-specific hashtags' },
    { label: 'Saving to Draft Board', desc: 'Committing post entities into database records' }
  ]

  async function handleSubmit() {
    const finalTopic = selectedTopic === 'custom' ? customTopic : selectedTopic
    if (!finalTopic) {
      toast.error('กรุณาระบุหัวข้อคอนเทนต์')
      return
    }

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start select-none">
      
      {/* Left panel: Active Brand Guidelines Engine */}
      <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-indigo-650" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Brand Engine Guidelines</h3>
        </div>

        {initialBrand ? (
          <div className="space-y-4 text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Business Name</span>
              <p className="text-xs font-bold text-slate-800">{initialBrand.name}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Industry / Type</span>
              <p className="text-xs font-bold text-slate-800">{initialBrand.business_type}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Target Audience</span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{initialBrand.target_audience}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Default Tone</span>
                <p className="text-xs font-bold text-indigo-600">{initialBrand.tone}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Default Voice</span>
                <p className="text-xs font-bold text-indigo-600">{initialBrand.personality}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-2.5">
            <p className="text-xs font-semibold text-slate-400">No brand profile linked.</p>
            <Link 
              href="/profile" 
              className="inline-flex text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:underline"
            >
              Configure Brand Engine →
            </Link>
          </div>
        )}

        <div className="pt-4 border-t border-slate-50 space-y-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Generation Engine</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" /> GPT-4o (High-Res)
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Destination</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Draft Repository
            </span>
          </div>
        </div>
      </div>

      {/* Right panel: Composer Workbench */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Loading / Execution Log view */}
        {loading && (
          <Card className="border border-slate-200/60 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] bg-white rounded-3xl overflow-hidden animate-in fade-in duration-300">
            <CardContent className="p-8 text-center space-y-6 min-h-[380px] flex flex-col items-center justify-center">
              <div className="relative">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />
                <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Composer Running</h3>
                <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                  Compiling post drafts with your active brand guideline context.
                </p>
              </div>

              {/* Compilation terminal interface */}
              <div className="w-full max-w-md mx-auto space-y-3.5 pt-4 text-left bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono shadow-inner">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Generation Log Pipeline</span>
                </div>
                {stages.map((stage, idx) => {
                  const isCompleted = loadingStage > idx;
                  const isActive = loadingStage === idx;
                  return (
                    <div key={idx} className={cn("flex items-start gap-2.5 transition-opacity duration-300", !isCompleted && !isActive ? "opacity-30" : "opacity-100")}>
                      <div className="flex h-4 w-4 items-center justify-center shrink-0 mt-0.5">
                        {isCompleted ? (
                          <span className="text-emerald-500 font-bold text-xs">✓</span>
                        ) : isActive ? (
                          <div className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
                        ) : (
                          <span className="text-slate-700 text-xs">•</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className={cn("text-xs font-bold leading-none", isActive ? "text-indigo-400" : isCompleted ? "text-slate-100" : "text-slate-600")}>
                          {stage.label}
                        </p>
                        {isActive && (
                          <p className="text-[9px] text-slate-500 font-semibold leading-relaxed mt-0.5">{stage.desc}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success screen */}
        {!loading && successCount !== null && (
          <Card className="border border-slate-200/60 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] bg-white rounded-3xl overflow-hidden animate-in zoom-in duration-300">
            <CardContent className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[380px]">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-150 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Compilation Complete!</h2>
                <p className="text-slate-400 text-xs font-semibold">Generated {successCount} content drafts and saved to your repository.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 w-full max-w-sm">
                <Link 
                  href="/drafts" 
                  className={cn(buttonVariants({ size: 'default' }), "bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex-1 h-11 shadow-md")}
                >
                  Review Draft Board <ArrowRight className="ml-1.5 w-4 h-4" />
                </Link>
                <Button 
                  variant="outline" 
                  size="default" 
                  onClick={() => setSuccessCount(null)} 
                  className="h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-50 text-xs flex-1 border-slate-200"
                >
                  Compose Another Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workbench Control Panel Form */}
        {!loading && successCount === null && (
          <Card className="border border-slate-200/60 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.02)] bg-white rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 shadow-sm border border-slate-150">
                  <SlidersHorizontal className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-sm font-black text-slate-855 tracking-tight uppercase tracking-wider">Composer Settings</CardTitle>
                  <CardDescription className="text-[10px] font-semibold text-slate-400 mt-0.5">Parameters for the AI content generation pipeline.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* 1. Topic Parameter */}
              <div className="space-y-2.5 text-left">
                <Label className="text-xs font-black text-slate-800 uppercase tracking-wider">1. Core Content Track (Topic)</Label>
                <Select value={selectedTopic} onValueChange={(val: string | null) => val && setSelectedTopic(val)}>
                  <SelectTrigger className="h-11 text-xs rounded-xl border-slate-250/70 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select topic category..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                    {TOPIC_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold py-2.5">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Topic Input */}
              {selectedTopic === 'custom' && (
                <div className="space-y-2 text-left animate-in slide-in-from-top-2 duration-200">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specify Custom Subject</Label>
                  <Input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. 3 crucial tips for writing a legal contract..."
                    className="h-11 text-xs rounded-xl border-slate-200 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* 2. Advanced Style Overrides */}
              <div className="space-y-4 pt-4 border-t border-slate-50 text-left">
                <Label className="text-xs font-black text-slate-800 uppercase tracking-wider">2. Tone presets override (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Language Tone</span>
                    <Select value={formData.tone} onValueChange={(val: string | null) => val && setFormData({ ...formData, tone: val })}>
                      <SelectTrigger className="h-10 text-xs rounded-xl">
                        <SelectValue placeholder="Tone..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {TONE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Personality Preset</span>
                    <Select value={formData.personality} onValueChange={(val: string | null) => val && setFormData({ ...formData, personality: val })}>
                      <SelectTrigger className="h-10 text-xs rounded-xl">
                        <SelectValue placeholder="Personality..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {PERSONALITY_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 3. Output Volume */}
              <div className="space-y-2.5 pt-4 border-t border-slate-50 text-left">
                <Label className="text-xs font-black text-slate-800 uppercase tracking-wider">3. Output Count</Label>
                <Select value={formData.postCount.toString()} onValueChange={(val: string | null) => val && setFormData({ ...formData, postCount: parseInt(val) as 5 | 10 })}>
                  <SelectTrigger className="h-11 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="5" className="text-xs font-bold py-2.5">Generate 5 Social Posts</SelectItem>
                    <SelectItem value="10" className="text-xs font-bold py-2.5">Generate 10 Social Posts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>

            <CardFooter className="p-6 border-t border-slate-50 bg-slate-50/20 flex gap-4">
              <Button 
                onClick={handleSubmit}
                className={cn(
                  "w-full h-12 rounded-2xl font-black text-xs transition-all active:scale-[0.98]",
                  "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                )}
                disabled={!selectedTopic || !hasOpenAIKey}
              >
                <Sparkles className="mr-1.5 w-4 h-4" />
                Launch AI Composer
              </Button>
            </CardFooter>
          </Card>
        )}

        {!hasOpenAIKey && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 rounded-2xl border border-rose-100/50">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold leading-relaxed text-left">
              API key missing. Connect your OpenAI credentials in the <Link href="/settings" className="underline hover:text-indigo-650">Publishing Channels</Link> setting panel to enable AI generation.
            </p>
          </div>
        )}
      </div>

    </div>
  )

}
