'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generatePosts } from '@/actions/generate'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  SlidersHorizontal, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  Check, 
  TrendingUp, 
  Globe, 
  MoreHorizontal,
  Zap,
  Target
} from 'lucide-react'

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
  
  // C2.2 Output Settings state variables
  const [presetCount, setPresetCount] = useState('5')
  const [customCount, setCustomCount] = useState('')
  
  // Tone and Personality preset state variables
  const [tone, setTone] = useState(initialBrand?.tone || 'Professional')
  const [personality, setPersonality] = useState(initialBrand?.personality || 'น่าเชื่อถือ')

  // C2.1 Content Objective local state
  const [objective, setObjective] = useState('Educational')

  const stages = [
    { label: 'Understanding Brand Context', desc: 'Analyzing brand profile parameters and topic guidelines' },
    { label: 'Preparing Content Structure', desc: 'Drafting multi-format social posts structure' },
    { label: 'Generating Content', desc: 'Running context synthesis and hook optimization' },
    { label: 'Optimizing Hooks', desc: 'Adding hooks, captions, and platform-specific hashtags' },
    { label: 'Preparing Drafts', desc: 'Committing post entities into database records' }
  ]

  async function handleSubmit() {
    const finalTopic = selectedTopic === 'custom' ? customTopic : selectedTopic
    if (!finalTopic) {
      toast.error('กรุณาระบุหัวข้อคอนเทนต์')
      return
    }

    // C2.2 Resolve Output Count from preset/custom modes
    let resolvedCount = 5
    if (customCount.trim()) {
      const parsed = parseInt(customCount)
      if (isNaN(parsed) || parsed < 1 || parsed > 100) {
        toast.error('Custom count must be a number between 1 and 100.')
        return
      }
      resolvedCount = parsed
    } else {
      resolvedCount = parseInt(presetCount)
    }

    // Map to closest valid API count (5 or 10) to respect backend Zod schema
    const apiCount = resolvedCount > 5 ? 10 : 5

    setLoading(true)
    setLoadingStage(0)
    
    // Simulate step progress increments every 2 seconds
    const intervalId = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < 4) return prev + 1
        return prev
      })
    }, 2000)

    try {
      const result = await generatePosts({
        topic: finalTopic,
        tone: tone,
        personality: personality,
        postCount: apiCount
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
    <div className="flex flex-col xl:flex-row w-full gap-6 select-none items-start pb-20">
      
      {/* LEFT PANEL (22%) - Control Deck */}
      <div className="w-full xl:w-[22%] shrink-0 space-y-5">
        
        {/* Brand Context HUD (Insight Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Brand Context HUD</h3>
          </div>
          {initialBrand ? (
            <div className="space-y-3.5 text-xs text-left">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Brand Identity</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{initialBrand.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{initialBrand.business_type}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Target Audience</span>
                <p className="font-semibold text-slate-700 dark:text-slate-400 leading-normal line-clamp-2">{initialBrand.target_audience}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Default Tone</span>
                  <p className="font-bold text-indigo-650 dark:text-indigo-400">{initialBrand.tone}</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Voice Persona</span>
                  <p className="font-bold text-indigo-650 dark:text-indigo-400">{initialBrand.personality}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs font-semibold text-slate-400">No brand profile linked.</p>
              <Link href="/profile" className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline mt-2 block">Configure Voice →</Link>
            </div>
          )}
        </div>

        {/* Content Templates (Secondary Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm text-left">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Content Templates</h3>
          </div>
          <div className="space-y-1.5">
            {[
              { title: 'Labor Law Advice', desc: 'Educational tip breakdown format' },
              { title: 'PDPA Compliance Checklist', desc: 'Step-by-step audit checklist' },
              { title: 'Service Business Q&A', desc: 'Conversational client interview mock' },
              { title: 'Expert Myth-Buster', desc: 'Confrontational value correction post' }
            ].map((t, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  if (t.title.includes('Labor')) setSelectedTopic('กฎหมายแรงงาน');
                  else if (t.title.includes('PDPA')) setSelectedTopic('PDPA / คุ้มครองข้อมูลส่วนบุคคล');
                  else if (t.title.includes('Service')) setSelectedTopic('การตลาดธุรกิจบริการ');
                  else setSelectedTopic('custom');
                }}
                className="w-full p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80 group"
              >
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-250 group-hover:text-indigo-600 transition-colors">{t.title}</span>
                <span className="block text-[9px] text-slate-400 font-semibold">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Angles & Recent Topics (Secondary Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-sm text-left">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Active Content Angles</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {['Educate & Convert', 'Myth Busting', 'Compliance Alert', 'Interactive Q&A'].map((angle, idx) => (
                <span key={idx} className="text-[9px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-150/60 dark:border-slate-700/80 px-2 py-0.5 rounded-md">
                  {angle}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-50 dark:border-slate-800/80">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Recent Success Topics</span>
            <div className="space-y-1.5">
              {[
                { title: 'Severance calculation details', date: '3 days ago' },
                { title: 'Cookie consent rules 2026', date: '5 days ago' }
              ].map((topic, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-700 dark:text-slate-350 truncate max-w-[120px]">{topic.title}</span>
                  <span className="text-slate-400 text-[9px] font-semibold">{topic.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status (Action Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-sm text-left">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">OS Engine Status</span>
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-650" /> OpenAI GPT-4o
            </span>
            <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase", hasOpenAIKey ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
              {hasOpenAIKey ? 'Vault Active' : 'Missing Key'}
            </span>
          </div>
        </div>

      </div>

      {/* CENTER PANEL (48%) - Content Composer */}
      <div className="w-full xl:w-[48%] shrink-0 space-y-5">
        
        {/* Success screen card */}
        {!loading && successCount !== null && (
          <div className="border border-slate-200/60 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl p-6 text-center space-y-5 min-h-[300px] flex flex-col items-center justify-center">
            <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-150 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-black text-slate-800 dark:text-slate-200 tracking-tight">AI Synthesis Complete!</h2>
              <p className="text-slate-400 text-xs font-semibold">Generated {successCount} content drafts and saved to your Pipeline Board.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-3 w-full max-w-sm">
              <Link 
                href="/drafts" 
                className={cn(buttonVariants({ size: 'default' }), "bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex-1 h-10 shadow-md")}
              >
                Open Pipeline Board
              </Link>
              <Button 
                variant="outline" 
                size="default" 
                onClick={() => setSuccessCount(null)} 
                className="h-10 rounded-xl font-bold text-slate-500 hover:bg-slate-50 text-xs flex-1 border-slate-200"
              >
                Compose Again
              </Button>
            </div>
          </div>
        )}

        {/* Composer Workbench Form */}
        {(!loading && successCount === null) && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-sm border border-slate-150 dark:border-slate-700">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase">Command Composer</h4>
                <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Synthesize raw parameters into formatted social updates.</p>
              </div>
            </div>

            <div className="p-5 space-y-5 text-left">
              {/* 1. Topic Builder */}
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">1. Core Content Track (Topic)</Label>
                <Select value={selectedTopic} onValueChange={(val: string | null) => val && setSelectedTopic(val)}>
                  <SelectTrigger className="h-10 text-xs rounded-xl border-slate-250/70 focus:ring-indigo-500 bg-white dark:bg-slate-900">
                    <SelectValue placeholder="Select topic category..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                    {TOPIC_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold py-2">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Topic Input */}
              {selectedTopic === 'custom' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specify Custom Subject</Label>
                  <Input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. 3 crucial tips for writing a legal contract..."
                    className="h-10 text-xs rounded-xl border-slate-200 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* 2. Parameters Grid (Audience, Tone, Style) */}
              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800/80">
                <Label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">2. Context Grids Configuration</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Audience HUD View */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Target Audience Segment</span>
                    <div className="h-9 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-150/60 dark:border-slate-850 flex items-center text-[11px] text-slate-700 dark:text-slate-350 font-bold truncate">
                      {initialBrand?.target_audience || 'General Segment'}
                    </div>
                  </div>

                  {/* Language Tone */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Language Tone Register</span>
                    <Select value={tone} onValueChange={(val: string | null) => val && setTone(val)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue placeholder="Tone..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {TONE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Personality Style Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Personality Style Preset</span>
                    <Select value={personality} onValueChange={(val: string | null) => val && setPersonality(val)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue placeholder="Personality..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {PERSONALITY_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content Objective */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Content Objective</span>
                    <Select value={objective} onValueChange={(val: string | null) => val && setObjective(val)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue placeholder="Objective..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {['Educational', 'Lead Gen / Sales', 'Brand Awareness', 'Engagement Drive'].map((obj, i) => (
                          <SelectItem key={i} value={obj} className="text-xs">{obj}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* OUTPUT SETTINGS */}
              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800/80">
                <Label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">OUTPUT SETTINGS</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Preset Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Preset Count</span>
                    <Select value={presetCount} onValueChange={(val: string | null) => val && setPresetCount(val)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {['1', '3', '5', '10', '20', '30', '50', '100'].map(p => (
                          <SelectItem key={p} value={p} className="text-xs font-semibold">
                            {p} {parseInt(p) === 1 ? 'Post' : 'Posts'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Input */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Custom Count</span>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={customCount}
                      onChange={(e) => setCustomCount(e.target.value)}
                      placeholder="Enter custom amount"
                      className="h-9 text-xs rounded-xl border-slate-250/70 focus:ring-indigo-500 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold italic">
                  Leave custom count empty to use preset value.
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/20 flex gap-4">
              <Button 
                onClick={handleSubmit}
                className="w-full h-11 rounded-xl font-black text-xs transition-all active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                disabled={!selectedTopic || !hasOpenAIKey}
              >
                <Sparkles className="mr-1.5 w-4 h-4" />
                Generate Content
              </Button>
            </div>
          </div>
        )}

        {/* In progress compilation dashboard overlay */}
        {loading && (
          <div className="border border-slate-200/60 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6 text-center min-h-[350px] flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-300">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />
              <Sparkles className="w-5.5 h-5.5 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">OS AI Synthesis Active</h3>
              <p className="text-slate-400 text-xs font-medium max-w-sm leading-relaxed">
                Reorganizing brand guidelines parameters and custom topics inputs...
              </p>
            </div>
          </div>
        )}

        {!hasOpenAIKey && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-455 rounded-2xl border border-rose-100/50">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold leading-relaxed text-left">
              API key missing. Connect your OpenAI credentials in the <Link href="/settings" className="underline hover:text-indigo-650">Publishing Channels</Link> setting panel to enable AI generation.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT PANEL (30%) - Expectation Hub */}
      <div className="w-full xl:w-[30%] shrink-0 space-y-5">
        
        {/* Visual Content Score HUD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <TrendingUp className="w-4 h-4 text-indigo-650" />
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Content Performance Score</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'Hook Strength', score: 8.5 },
              { label: 'Readability Meter', score: 9.0 },
              { label: 'Engagement Potential', score: 7.2 },
              { label: 'CTA Strength', score: 8.0 }
            ].map((metric, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  <span>{metric.label}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{metric.score}/10</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${metric.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Expectation preview card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Platform Preview Feed</h3>
          </div>

          <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150/60 dark:border-slate-850 p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-black">OS</div>
                <div>
                  <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Your Workspace Brand</div>
                  <div className="flex items-center gap-1 text-[8px] text-slate-450 font-semibold uppercase tracking-wider mt-0.5">
                    <span>Sponsored</span>
                    <span>•</span>
                    <Globe className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
            </div>
            
            <div className="space-y-1.5 text-[11px] text-slate-655 dark:text-slate-400 leading-relaxed font-medium">
              <p className="font-bold text-slate-900 dark:text-slate-200 text-xs">Preview Hook Headline Mockup</p>
              <p>Generated captions content will render dynamically here mapped to your specific platform guidelines...</p>
              <span className="text-indigo-600 dark:text-indigo-400 block font-bold">#mockup #workspace #branding</span>
            </div>

            <div className="aspect-[1.91/1] w-full bg-white dark:bg-slate-900 border border-slate-150/50 dark:border-slate-800/80 rounded-lg flex items-center justify-center text-[9px] text-slate-350 font-bold uppercase tracking-widest italic shadow-sm">
              Mock Media Canvas
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800/80 rounded-xl p-3.5 text-[10px] text-slate-500 font-medium space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Output Expectations</span>
            <p>• Estimated volume: {customCount.trim() ? customCount : presetCount} drafts</p>
            <p>• Formats: Multi-format caption blocks + hashtags</p>
            <p>• Synchronization destination: Pipeline Board</p>
          </div>
        </div>

        {/* Business focused AI Operational Status HUD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-sm text-left">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">AI Operational Status</h3>
          </div>
          
          <div className="space-y-2.5">
            {stages.map((stage, idx) => {
              const isCompleted = loadingStage > idx || (successCount !== null);
              const isActive = loading && loadingStage === idx;
              return (
                <div key={idx} className={cn("flex items-start gap-2.5 transition-opacity", !isCompleted && !isActive ? "opacity-40" : "opacity-100")}>
                  <div className="flex h-3.5 w-3.5 items-center justify-center shrink-0 mt-0.5 rounded-full border border-slate-200 bg-white dark:bg-slate-800 text-[10px]">
                    {isCompleted ? (
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    ) : isActive ? (
                      <div className="h-1.5 w-1.5 animate-ping rounded-full bg-indigo-500" />
                    ) : (
                      <span className="text-slate-350 text-[8px]">•</span>
                    )}
                  </div>
                  <div>
                    <span className={cn("text-[11px] font-bold block", isActive ? "text-indigo-600" : isCompleted ? "text-slate-700 dark:text-slate-300" : "text-slate-400")}>
                      {stage.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  )
}
