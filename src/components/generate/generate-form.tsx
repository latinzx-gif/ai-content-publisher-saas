'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generatePosts } from '@/actions/generate';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Sparkle,
  Plus,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  Target,
  Laptop,
  Smartphone,
  X,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

interface GeneratedPost {
  title?: string;
  caption: string;
  hashtags?: string;
  platform?: string;
  angle_type?: string;
}

interface GenerateFormProps {
  initialBrand?: {
    name: string;
    business_type: string;
    target_audience: string;
    tone: string;
    personality: string;
    brand_description?: string | null;
    brand_instructions?: string | null;
    content_rules?: string | null;
    image_rules?: string | null;
  } | null;
  hasOpenAIKey: boolean;
}

type ContentLanguage = 'TH' | 'EN' | 'CN' | 'JP';
type PostCountOption = 1 | 3 | 5 | 10;

const LANGUAGE_OPTIONS: Array<{ value: ContentLanguage; label: string }> = [
  { value: 'TH', label: 'Thai / ภาษาไทย' },
  { value: 'EN', label: 'English / ภาษาอังกฤษ' },
  { value: 'CN', label: 'Chinese / ภาษาจีน' },
  { value: 'JP', label: 'Japanese / ภาษาญี่ปุ่น' },
];

const TOPIC_PRESETS = [
  { value: 'Labour Law Update', label: 'Labour Law Update' },
  { value: 'PDPA Compliance Tips', label: 'PDPA Compliance Tips' },
  { value: 'Service Business Marketing', label: 'Service Business Marketing' },
  { value: 'custom', label: 'กำหนดเอง (Custom)' }
];

const OUTPUT_MODES = [
  { value: 'Main post + secondary in comment', label: 'Main post + secondary in comments' },
  { value: 'Bilingual caption', label: 'Bilingual caption' },
  { value: 'Main post only', label: 'Main post only' },
  { value: 'Separate versions', label: 'Separate versions' },
  { value: 'custom', label: 'กำหนดเอง (Custom)' }
];

const AUDIENCES = [
  { value: 'Legal & Compliance Professionals', label: 'Legal & Compliance Professionals' },
  { value: 'SME Owners', label: 'SME Owners' },
  { value: 'HR Managers', label: 'HR Managers' },
  { value: 'custom', label: 'กำหนดเอง (Custom)' }
];

const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Simple', label: 'Simple' },
  { value: 'custom', label: 'กำหนดเอง (Custom)' }
];

const CONTENT_GOALS = [
  { value: 'Educate', label: 'Educate' },
  { value: 'Promote', label: 'Promote' },
  { value: 'Engagement', label: 'Engagement' },
  { value: 'custom', label: 'กำหนดเอง (Custom)' }
];

const CONTENT_FORMATS = [
  { value: 'Educational Post', label: 'Educational Post' },
  { value: 'Checklist', label: 'Checklist' },
  { value: 'Q&A', label: 'Q&A' },
  { value: 'custom', label: 'กำหนดเอง (Custom)' }
];

const POST_COUNT_OPTIONS: PostCountOption[] = [1, 3, 5, 10];

const CONTENT_TEMPLATES = [
  {
    id: 'labour-law',
    title: 'Labor Law Advice',
    desc: 'Educational tip breakdown',
    topic: 'Labour Law Update',
    audience: 'HR Managers',
    tone: 'Expert',
    objective: 'Educate',
    format: 'Educational Post',
    wordCount: '800',
  },
  {
    id: 'pdpa-compliance',
    title: 'PDPA Compliance Checklist',
    desc: 'Step-by-step audit checklist',
    topic: 'PDPA Compliance Tips',
    audience: 'SME Owners',
    tone: 'Professional',
    objective: 'Educate',
    format: 'Checklist',
    wordCount: '500',
  },
  {
    id: 'service-biz-qa',
    title: 'Service Business Q&A',
    desc: 'Client interview mock',
    topic: 'Service Business Marketing',
    audience: 'SME Owners',
    tone: 'Friendly',
    objective: 'Engagement',
    format: 'Q&A',
    wordCount: '300',
  },
  {
    id: 'expert-myth-buster',
    title: 'Expert Myth-Buster',
    desc: 'Confrontational value correction',
    topic: 'PDPA Compliance Tips',
    audience: 'Legal & Compliance Professionals',
    tone: 'Corporate',
    objective: 'Educate',
    format: 'Educational Post',
    wordCount: '1200',
  }
];

export function GenerateForm({ initialBrand, hasOpenAIKey }: GenerateFormProps) {
  const { currentLanguage } = useLanguage();

  // Workspace Level States
  const [activeTab, setActiveTab] = useState<'manual' | 'quick'>('manual');
  const [manualSettings, setManualSettings] = useState(true);
  const [showManual, setShowManual] = useState(true);

  // Form Field States
  const [topicPreset, setTopicPreset] = useState<string>('PDPA Compliance Tips');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);

  const [primaryLang, setPrimaryLang] = useState<ContentLanguage>('TH');
  const [secondaryLang, setSecondaryLang] = useState<ContentLanguage>('EN');
  const [bothLanguages, setBothLanguages] = useState(true);

  const [outputMode, setOutputMode] = useState<string>('Main post + secondary in comment');
  const [customOutputMode, setCustomOutputMode] = useState<string>('');
  const [showCustomOutput, setShowCustomOutput] = useState(false);

  const [selectedPlatform, setSelectedPlatform] = useState<string>('LinkedIn');

  const [audience, setAudience] = useState<string>('Legal & Compliance Professionals');
  const [customAudienceText, setCustomAudienceText] = useState<string>('');
  const [showCustomAudience, setShowCustomAudience] = useState(false);

  const [tone, setTone] = useState<string>('Professional');
  const [customTone, setCustomTone] = useState<string>('');
  const [showCustomTone, setShowCustomTone] = useState(false);

  const [objective, setObjective] = useState<string>('Educate');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);

  const [format, setFormat] = useState<string>('Educational Post');
  const [customFormat, setCustomFormat] = useState<string>('');
  const [showCustomFormat, setShowCustomFormat] = useState(false);

  const [hashtags, setHashtags] = useState<string[]>(['compliance', 'lawupdate', 'legalinsights']);
  const [hashtagInput, setHashtagInput] = useState<string>('');

  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const [wordCount, setWordCount] = useState<string>('500');
  const [postCount, setPostCount] = useState<PostCountOption>(5);
  const [manualContext, setManualContext] = useState<string>('');

  // Processing & Output states
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [generationSummary, setGenerationSummary] = useState<{ count: number; topic: string } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const handleUseTemplate = (template: typeof CONTENT_TEMPLATES[number]) => {
    setTopicPreset(template.topic);
    setCustomTopic(template.topic);
    setAudience(template.audience);
    setTone(template.tone);
    setObjective(template.objective);
    setFormat(template.format);
    setWordCount(template.wordCount);
    setActiveTemplateId(template.id);
  };

  const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const clean = hashtagInput.trim().replace('#', '');
      if (clean && !hashtags.includes(clean)) {
        setHashtags([...hashtags, clean]);
        setHashtagInput('');
      }
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleAddUrl = () => {
    if (!currentUrl.trim()) return;
    try {
      new URL(currentUrl);
    } catch {
      toast.error(currentLanguage === 'th' ? 'กรุณาระบุ URL ที่ถูกต้อง' : 'Please enter a valid URL');
      return;
    }
    if (urls.length >= 5) {
      toast.error(currentLanguage === 'th' ? 'เพิ่มได้สูงสุด 5 ลิงก์' : 'You can add up to 5 URLs');
      return;
    }
    if (urls.includes(currentUrl.trim())) {
      toast.error(currentLanguage === 'th' ? 'ลิงก์นี้ถูกเพิ่มไปแล้ว' : 'This URL has already been added');
      return;
    }
    setUrls([...urls, currentUrl.trim()]);
    setCurrentUrl('');
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, idx) => idx !== index));
  };

  async function handleSubmit() {
    const finalTopic = topicPreset === 'custom' ? customTopic : topicPreset;
    if (!finalTopic.trim()) {
      toast.error(currentLanguage === 'th' ? 'กรุณาระบุหัวข้อคอนเทนต์' : 'Please enter a content topic');
      return;
    }

    setLoading(true);
    setLoadingStage(0);
    setGenerationSummary(null);

    const intervalId = setInterval(() => {
      setLoadingStage(prev => (prev < 4 ? prev + 1 : prev));
    }, 2000);

    let finalManualContext = manualContext;
    if (bothLanguages && secondaryLang !== primaryLang) {
      const primaryLabel = LANGUAGE_OPTIONS.find(l => l.value === primaryLang)?.label || primaryLang;
      const secondaryLabel = LANGUAGE_OPTIONS.find(l => l.value === secondaryLang)?.label || secondaryLang;
      finalManualContext = `${manualContext || ''}\n\n[System Rule]: Please output the content bilingually: primary language in ${primaryLabel}, secondary language in ${secondaryLabel}. Provide both versions back-to-back inside the generated text.`.trim();
    }

    try {
      const result = await generatePosts({
        topic: finalTopic,
        tone: tone === 'custom' ? customTone : tone,
        personality: initialBrand?.personality || 'น่าเชื่อถือ',
        postCount,
        urls: urls,
        manualContext: finalManualContext || undefined,
        language: primaryLang,
        hashtagCount: (hashtags.length === 0 ? 0 : hashtags.length <= 5 ? 5 : hashtags.length <= 10 ? 10 : 15) as 0 | 5 | 10 | 15,
        manualHashtags: hashtags.length > 0 ? hashtags : undefined
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (result.posts && result.posts.length > 0) {
        setGeneratedPosts(result.posts);
      }
      const generatedCount = result.count ?? postCount;
      setGenerationSummary({ count: generatedCount, topic: finalTopic });
      toast.success(currentLanguage === 'th' ? `สร้างโพสต์สำเร็จ ${generatedCount} รายการ!` : `Successfully generated ${generatedCount} posts!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error generating content';
      toast.error(message);
    } finally {
      clearInterval(intervalId);
      setLoading(false);
    }
  }

  // Pre-filled dynamic preview texts matching mockup
  const activePost = generatedPosts[0] || null;
  const previewTextPrimary = activePost?.caption || "กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ไม่ใช่ข้อบังคับ แต่คือความไว้วางใจที่ลูกค้ามีให้กับองค์กรของคุณ การปฏิบัติตามอย่างถูกต้อง คือการสร้างมาตรฐานที่ดีและลดความเสี่ยงในระยะยาว";
  const previewTextSecondary = bothLanguages && !activePost?.caption 
    ? "PDPA is more than a regulation—it's the trust your customers place in your organization. Proper compliance builds a sustainable standard and reduces long-term risk." 
    : "";

  const previewHashtags = activePost?.hashtags || (hashtags.map(t => `#${t}`).join(' '));

  return (
    <div className="flex flex-col space-y-6 select-none text-left w-full max-w-[1440px] mx-auto">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col space-y-4">
        {/* Breadcrumb & Action Row */}
        <div className="flex justify-between items-center border-b border-[#E6DFD5] pb-4">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 tracking-tight uppercase">
            <span>Workspace</span>
            <span>/</span>
            <span>Content Operations</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">Editor Canvas</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex gap-2">
              <span className="cursor-pointer hover:text-slate-800">TH</span>
              <span className="text-slate-800 underline">EN</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
              OS
            </div>
            <span className="cursor-pointer hover:text-slate-850">SIGN OUT</span>
          </div>
        </div>

        {/* Dynamic Title controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 uppercase">
              Editor Canvas
            </h1>
          </div>

          {/* Centered Mode switcher & Right Controls */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Mode tabs */}
            <div className="flex bg-[#FAF8F5] border border-[#E6DFD5] rounded-xl p-1">
              <button
                onClick={() => setActiveTab('manual')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === 'manual' ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Manual
              </button>
              <button
                onClick={() => setActiveTab('quick')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === 'quick' ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Quick Mode
              </button>
            </div>

            {/* Toggle Manual Settings Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-550">Manual settings:</span>
              <button
                onClick={() => setManualSettings(!manualSettings)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  manualSettings ? "bg-emerald-600" : "bg-slate-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    manualSettings ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
              <span className="text-xs font-black uppercase text-slate-400">{manualSettings ? 'On' : 'Off'}</span>
            </div>

            {/* Close/Open manual details */}
            <button
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E6DFD5] px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-[#FAF8F5]/80 transition-all shrink-0"
            >
              {showManual ? (
                <>
                  <span>Close Manual</span>
                  <X className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Open Manual</span>
                  <Plus className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {showManual && (
          <p className="text-xs font-medium text-slate-450 pt-1">
            Manual precision for complete control over your content output.
          </p>
        )}
      </div>

      {/* 2. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-12 gap-6 items-start w-full">
        
        {/* PANE A: Left Column (22% / col-span-3) - Manual Panel toggled */}
        {showManual && (
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Brand Context HUD */}
            <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#967F5C]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Brand Context</span>
                </div>
                <Link href="/profile" className="text-[10px] font-bold text-[#967F5C] hover:underline">View →</Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center font-serif text-slate-900 font-bold text-sm">
                    OS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-950 truncate">
                      {initialBrand?.name || "Your Workspace Brand"}
                    </p>
                    <p className="text-[10px] text-slate-450 font-medium">
                      {initialBrand?.business_type || "Legal. Trusted. Precise."}
                    </p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-50 text-[11px] text-slate-500 font-medium">
                  Voice: <span className="text-slate-850 font-bold">Professional • Formal • Clear</span>
                </div>
              </div>
            </div>

            {/* Content Templates */}
            <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#967F5C]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Content Templates</span>
                </div>
                <span className="text-[10px] font-bold text-[#967F5C] cursor-pointer hover:underline">View all →</span>
              </div>

              <div className="space-y-3.5">
                {CONTENT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleUseTemplate(tmpl)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 group transition-all",
                      activeTemplateId === tmpl.id ? "opacity-100" : "opacity-75 hover:opacity-100"
                    )}
                  >
                    <div className="w-3.5 h-3.5 rounded bg-slate-50 flex items-center justify-center shrink-0 mt-0.5 border border-slate-150">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#967F5C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs leading-none",
                        activeTemplateId === tmpl.id ? "text-slate-950 font-bold" : "text-slate-850 font-semibold"
                      )}>
                        {tmpl.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium leading-none mt-1 group-hover:text-slate-550 transition-colors">
                        {tmpl.desc}
                      </p>
                    </div>
                  </button>
                ))}
                
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 hover:text-[#967F5C] cursor-pointer">
                    Browse all templates →
                  </span>
                </div>
              </div>
            </div>

            {/* Active Content Angles */}
            <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#967F5C]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Active Content Angles</span>
                </div>
                <span className="text-[10px] font-bold text-[#967F5C] cursor-pointer hover:underline">Manage →</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['Educate & Convert', 'Myth Busting', 'Compliance Alert', 'Interactive Q&A'].map((angle, idx) => (
                  <span key={idx} className="text-[9.5px] font-bold text-slate-550 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                    {angle}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-50 space-y-2">
                <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-400">Suggested Angle</span>
                <div className="p-3 bg-[#FAF8F5] border border-slate-200/60 rounded-xl text-left space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">Q2 Compliance Series</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-tight">Increase awareness and trust</p>
                  <button
                    onClick={() => {
                      setTopicPreset('PDPA Compliance Tips');
                      setCustomTopic('Q2 Compliance Series: Data Privacy Auditing');
                    }}
                    className="text-[10px] font-bold text-[#967F5C] hover:underline mt-1.5 block"
                  >
                    Use this angle →
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PANE B: Middle Column (48% / col-span-6) */}
        <div className={cn(
          "space-y-6",
          showManual ? "col-span-12 lg:col-span-6" : "col-span-12 lg:col-span-8"
        )}>
          
          {/* Rules Summaries Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* SAVED CONTENT RULES */}
            <div className="bg-white border border-[#E6DFD5] rounded-2xl p-4 flex justify-between items-center shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
              <div className="space-y-1.5">
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Saved Content Rules</span>
                <p className="text-xs font-bold text-slate-800">Labor Law • Legal & Compliance Pros</p>
                <span className="block text-[9px] text-slate-400 font-semibold">Updated 2 days ago</span>
              </div>
              <span className="text-[10px] font-bold text-[#967F5C] cursor-pointer hover:underline">View →</span>
            </div>

            {/* SAVED IMAGE RULES */}
            <div className="bg-white border border-[#E6DFD5] rounded-2xl p-4 flex justify-between items-center shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
              <div className="space-y-1.5">
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Saved Image Rules</span>
                <p className="text-xs font-bold text-slate-800">Professional • Minimal • Ivory Palette</p>
                <span className="block text-[9px] text-slate-400 font-semibold">Updated 2 days ago</span>
              </div>
              <span className="text-[10px] font-bold text-[#967F5C] cursor-pointer hover:underline">View →</span>
            </div>

          </div>

          {/* Form Composer Container */}
          <div className="bg-white border border-[#E6DFD5] rounded-3xl p-6 space-y-6 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
            
            {/* 1. CONTENT TOPIC */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">1. Content Topic</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Select 
                    value={topicPreset} 
                    onValueChange={(val) => {
                      if (!val) return;
                      setTopicPreset(val);
                      if (val === 'custom') {
                        setShowCustomTopicInput(true);
                      } else {
                        setShowCustomTopicInput(false);
                        const match = TOPIC_PRESETS.find(p => p.value === val);
                        if (match) setCustomTopic(match.label);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue placeholder="Select topic preset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPIC_PRESETS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowCustomTopicInput(!showCustomTopicInput)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-xl text-xs transition-all",
                      showCustomTopicInput 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    Other
                  </button>
                </div>
                <div className="md:col-span-5">
                  <Input 
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Describe custom topic..."
                    disabled={!showCustomTopicInput}
                    className="h-9.5 text-xs rounded-xl border-slate-200/80 disabled:bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 2. LANGUAGES */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">2. Languages</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <Select value={primaryLang} onValueChange={(val) => setPrimaryLang(val as ContentLanguage)}>
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>Primary: {opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4">
                  <Select value={secondaryLang} onValueChange={(val) => setSecondaryLang(val as ContentLanguage)}>
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>Secondary: {opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4 flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-xl px-3 py-1.5 h-9.5">
                  <span className="text-[10px] font-bold text-slate-500">Both versions</span>
                  <button
                    onClick={() => setBothLanguages(!bothLanguages)}
                    className={cn(
                      "relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      bothLanguages ? "bg-indigo-600" : "bg-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        bothLanguages ? "translate-x-3" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. OUTPUT MODE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">3. Output Mode</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Select 
                    value={outputMode} 
                    onValueChange={(val) => {
                      if (!val) return;
                      setOutputMode(val);
                      if (val === 'custom') {
                        setShowCustomOutput(true);
                      } else {
                        setShowCustomOutput(false);
                        const match = OUTPUT_MODES.find(o => o.value === val);
                        if (match) setCustomOutputMode(match.label);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue placeholder="Select output mode..." />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTPUT_MODES.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowCustomOutput(!showCustomOutput)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-xl text-xs transition-all",
                      showCustomOutput 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    Other
                  </button>
                </div>
                <div className="md:col-span-5">
                  <Input 
                    value={customOutputMode}
                    onChange={(e) => setCustomOutputMode(e.target.value)}
                    placeholder="Describe custom output mode..."
                    disabled={!showCustomOutput}
                    className="h-9.5 text-xs rounded-xl border-slate-200/80 disabled:bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 4. PLATFORM */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">4. Platform</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'LinkedIn', icon: () => (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  )},
                  { name: 'Facebook', icon: () => (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  )},
                  { name: 'Website', icon: () => (
                    <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  )},
                  { name: 'Instagram', icon: () => (
                    <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  )},
                  { name: 'Other', icon: () => <Plus className="w-3.5 h-3.5" /> }
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelectedPlatform(p.name)}
                    className={cn(
                      "px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                      selectedPlatform === p.name 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:border-slate-350"
                    )}
                  >
                    {p.icon()}
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. AUDIENCE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">5. Audience</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Select 
                    value={audience} 
                    onValueChange={(val) => {
                      if (!val) return;
                      setAudience(val);
                      if (val === 'custom') {
                        setShowCustomAudience(true);
                      } else {
                        setShowCustomAudience(false);
                        const match = AUDIENCES.find(a => a.value === val);
                        if (match) setCustomAudienceText(match.label);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue placeholder="Select target audience..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((a) => (
                        <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowCustomAudience(!showCustomAudience)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-xl text-xs transition-all",
                      showCustomAudience 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    Other
                  </button>
                </div>
                <div className="md:col-span-5">
                  <Input 
                    value={customAudienceText}
                    onChange={(e) => setCustomAudienceText(e.target.value)}
                    placeholder="Describe custom audience..."
                    disabled={!showCustomAudience}
                    className="h-9.5 text-xs rounded-xl border-slate-200/80 disabled:bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 6. TONE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">6. Tone</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Select 
                    value={tone} 
                    onValueChange={(val) => {
                      if (!val) return;
                      setTone(val);
                      if (val === 'custom') {
                        setShowCustomTone(true);
                      } else {
                        setShowCustomTone(false);
                        const match = TONE_OPTIONS.find(t => t.value === val);
                        if (match) setCustomTone(match.label);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue placeholder="Select tone..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowCustomTone(!showCustomTone)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-xl text-xs transition-all",
                      showCustomTone 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    Other
                  </button>
                </div>
                <div className="md:col-span-5">
                  <Input 
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    placeholder="Describe custom tone..."
                    disabled={!showCustomTone}
                    className="h-9.5 text-xs rounded-xl border-slate-200/80 disabled:bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 7. CONTENT GOAL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">7. Content Goal</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Select 
                    value={objective} 
                    onValueChange={(val) => {
                      if (!val) return;
                      setObjective(val);
                      if (val === 'custom') {
                        setShowCustomGoal(true);
                      } else {
                        setShowCustomGoal(false);
                        const match = CONTENT_GOALS.find(g => g.value === val);
                        if (match) setCustomGoal(match.label);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue placeholder="Select content goal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_GOALS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowCustomGoal(!showCustomGoal)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-xl text-xs transition-all",
                      showCustomGoal 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    Other
                  </button>
                </div>
                <div className="md:col-span-5">
                  <Input 
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Describe custom goal..."
                    disabled={!showCustomGoal}
                    className="h-9.5 text-xs rounded-xl border-slate-200/80 disabled:bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 8. CONTENT FORMAT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">8. Content Format</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <Select 
                    value={format} 
                    onValueChange={(val) => {
                      if (!val) return;
                      setFormat(val);
                      if (val === 'custom') {
                        setShowCustomFormat(true);
                      } else {
                        setShowCustomFormat(false);
                        const match = CONTENT_FORMATS.find(f => f.value === val);
                        if (match) setCustomFormat(match.label);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9.5 text-xs rounded-xl border-slate-200/80 bg-white">
                      <SelectValue placeholder="Select content format..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => setShowCustomFormat(!showCustomFormat)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-xl text-xs transition-all",
                      showCustomFormat 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-transparent border-slate-200/80 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    Other
                  </button>
                </div>
                <div className="md:col-span-5">
                  <Input 
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    placeholder="Describe custom format..."
                    disabled={!showCustomFormat}
                    className="h-9.5 text-xs rounded-xl border-slate-200/80 disabled:bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 9. HASHTAGS */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">9. Hashtags</label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200/80 rounded-xl bg-white min-h-10 items-center">
                {hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold bg-[#FAF8F5] border border-slate-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1.5 text-slate-800">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveHashtag(tag)} className="text-slate-400 hover:text-slate-900 font-bold text-[9px]">×</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleAddHashtag}
                  placeholder="Add hashtag..."
                  className="flex-1 text-xs outline-none bg-transparent min-w-[120px] text-slate-800"
                />
              </div>
            </div>

            {/* 10. KNOWLEDGE SOURCE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">10. Knowledge Source</label>
              <div className="flex gap-2">
                <Input 
                  type="url"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="h-9.5 text-xs rounded-xl border-slate-200/80"
                />
                <Button 
                  type="button" 
                  onClick={handleAddUrl}
                  className="bg-[#FAF8F5] text-slate-800 border border-slate-200/80 font-bold text-xs h-9.5 rounded-xl px-4 hover:bg-slate-50 shrink-0"
                >
                  + ADD URL
                </Button>
              </div>
              
              {urls.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2 bg-[#FAF8F5] border border-slate-100 rounded-xl mt-1.5">
                  {urls.map((url, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px]">
                      <span className="truncate max-w-[280px] font-medium text-slate-500">
                        {url}
                      </span>
                      <button type="button" onClick={() => handleRemoveUrl(idx)} className="text-rose-500 hover:text-rose-700 font-bold">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 11. WORD COUNT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">11. Word Count</label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-1 shrink-0">
                  {['150', '300', '500', '800', '1200'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWordCount(val)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        wordCount === val ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {val} words
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                  <span className="text-[10px] font-bold text-slate-450 shrink-0">Custom word count</span>
                  <Input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="Enter number..."
                    className="h-9.5 text-xs rounded-xl border-slate-200/80"
                  />
                </div>
              </div>
            </div>

            {/* 12. NOTES / CONSTRAINTS (OPTIONAL) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">12. Number of Posts</label>
              <div className="grid grid-cols-4 gap-2">
                {POST_COUNT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPostCount(count)}
                    className={cn(
                      "h-9 rounded-xl border text-xs font-black transition-all",
                      postCount === count
                        ? "border-[#1E1D1B] bg-[#1E1D1B] text-white"
                        : "border-slate-200/80 bg-white text-slate-500 hover:border-slate-350"
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-slate-400">
                Generated posts are saved automatically to the Review Board as drafts.
              </p>
            </div>

            {/* 13. NOTES / CONSTRAINTS (OPTIONAL) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">13. Notes / Constraints (Optional)</label>
              <textarea 
                value={manualContext}
                onChange={(e) => setManualContext(e.target.value)}
                placeholder="Add any specific notes, constraints, or key points to include..."
                rows={3}
                className="w-full text-xs rounded-xl border border-slate-200/80 p-3 bg-white text-slate-800 outline-none resize-none font-medium leading-relaxed font-sans"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={loading || !hasOpenAIKey}
                className="w-full bg-[#0B1E33] hover:bg-[#071322] text-white font-black text-xs h-11 px-8 rounded-xl flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
              >
                {loading ? (
                  <>
                    <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Generating stage {loadingStage + 1}/5...</span>
                  </>
                ) : (
                  <>
                    <Sparkle className="w-4 h-4 fill-current" />
                    <span>GENERATE CONTENT</span>
                  </>
                )}
              </Button>
              {generationSummary && (
                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div>
                        <p className="text-xs font-black text-emerald-900">
                          {currentLanguage === 'th'
                            ? `สร้างโพสต์สำเร็จ ${generationSummary.count} รายการ`
                            : `Generated ${generationSummary.count} post${generationSummary.count === 1 ? '' : 's'} successfully`}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold text-emerald-700">
                          {currentLanguage === 'th'
                            ? `บันทึกหัวข้อ "${generationSummary.topic}" เป็นแบบร่างในบอร์ดตรวจสอบแล้ว`
                            : `Saved "${generationSummary.topic}" to Review Board drafts.`}
                        </p>
                      </div>
                      <Link
                        href="/drafts"
                        className="inline-flex h-8 items-center rounded-lg bg-emerald-700 px-3 text-[10px] font-black uppercase tracking-wider text-white hover:bg-emerald-800"
                      >
                        {currentLanguage === 'th' ? 'ไปที่บอร์ดตรวจสอบ' : 'Review Drafts'}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* PANE C: Expectation Hub (30% / col-span-3) */}
        <div className={cn(
          "space-y-6",
          showManual ? "col-span-12 lg:col-span-3" : "col-span-12 lg:col-span-4"
        )}>
          
          {/* Content Performance Score */}
          <div className="bg-white border border-[#E6DFD5] rounded-3xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)] text-left">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Target className="w-4 h-4 text-[#967F5C]" />
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                Content Performance Score
              </span>
            </div>
            
            <div className="space-y-4 pt-1">
              {[
                { name: 'Hook Strength', score: '8.6/10', pct: 86 },
                { name: 'Readability Meter', score: '9.0/10', pct: 90 },
                { name: 'Engagement Potential', score: '7.4/10', pct: 74 },
                { name: 'CTA Strength', score: '8.2/10', pct: 82 }
              ].map((metric, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="font-semibold">{metric.name}</span>
                    <span>{metric.score}</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-800 h-full" style={{ width: `${metric.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Preview Feed */}
          <div className="bg-white border border-[#E6DFD5] rounded-3xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)] text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                Platform Preview Feed
              </span>
              <div className="flex gap-2 bg-[#FAF8F5] border border-slate-150 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={cn(
                    "p-1 rounded transition-colors",
                    previewDevice === 'desktop' ? "bg-white shadow-xs text-slate-800" : "text-slate-400"
                  )}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={cn(
                    "p-1 rounded transition-colors",
                    previewDevice === 'mobile' ? "bg-white shadow-xs text-slate-800" : "text-slate-400"
                  )}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Social Post Mockup Card */}
            <div className={cn(
              "border border-slate-200/80 rounded-2xl p-4 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.01)] text-left space-y-3.5 transition-all",
              previewDevice === 'mobile' ? "max-w-[290px] mx-auto" : "w-full"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-slate-200 flex items-center justify-center font-serif font-bold text-xs text-slate-800">
                    OS
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900 leading-tight">
                      {initialBrand?.name || "Your Workspace Brand"}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold mt-0.5">
                      <span>2m</span>
                      <span>•</span>
                      <Globe className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
              
              <div className="space-y-2 text-xs text-slate-700 font-medium leading-relaxed">
                <p className="font-semibold text-slate-850">{previewTextPrimary}</p>
                {previewTextSecondary && <p className="text-slate-600">{previewTextSecondary}</p>}
                <p className="text-[#967F5C] font-bold mt-1.5">{previewHashtags}</p>
              </div>

              {/* Feed Actions */}
              <div className="grid grid-cols-4 p-0.5 border-t border-slate-100 pt-2 text-center">
                <button type="button" className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold hover:text-slate-800 py-1 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" /> Like
                </button>
                <button type="button" className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold hover:text-slate-800 py-1 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Comment
                </button>
                <button type="button" className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold hover:text-slate-800 py-1 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button type="button" className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold hover:text-slate-800 py-1 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>

            <div className="text-[9.5px] text-slate-400 leading-normal font-semibold text-center pt-2">
              Preview shows bilingual output with hashtags.<br/>
              Actual formatting may vary by platform.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
