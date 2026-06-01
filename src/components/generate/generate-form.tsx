'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generatePosts } from '@/actions/generate';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  SlidersHorizontal, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  Check, 
  Zap,
  Target,
  Plus,
  Trash2,
  Link as LinkIcon,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  Sparkle
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
  } | null;
  hasOpenAIKey: boolean;
}

const TOPIC_OPTIONS = [
  { value: 'กฎหมายแรงงาน', label: 'กฎหมายแรงงาน (Labor Law)' },
  { value: 'PDPA / คุ้มครองข้อมูลส่วนบุคคล', label: 'PDPA & Data Privacy' },
  { value: 'อสังหาริมทรัพย์ / โอนกรรมสิทธิ์', label: 'Real Estate & Property Law' },
  { value: 'การตลาดธุรกิจบริการ', label: 'Service Business Marketing' },
  { value: 'custom', label: 'กำหนดหัวข้อเอง (Custom Topic)' },
];

const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Simple', label: 'Simple' },
];

const PERSONALITY_OPTIONS = [
  { value: 'น่าเชื่อถือ', label: 'น่าเชื่อถือ (Trustworthy)' },
  { value: 'เป็นกันเอง', label: 'เป็นกันเอง (Approachable)' },
  { value: 'จริงจัง', label: 'จริงจัง (Serious)' },
  { value: 'ทันสมัย', label: 'ทันสมัย (Modern)' },
  { value: 'ผู้เชี่ยวชาญ', label: 'ผู้เชี่ยวชาญ (Authority)' },
  { value: 'เน้นขาย', label: 'เน้นขาย (Sales)' },
];

const OBJECTIVE_OPTIONS = [
  { val: 'Awareness', label: 'Awareness' },
  { val: 'Education', label: 'Education' },
  { val: 'Educational', label: 'เพื่อให้ความรู้ (Educational)' },
  { val: 'Lead Gen / Sales', label: 'เพื่อเพิ่มลูกค้า / เน้นขาย (Lead Gen / Sales)' },
  { val: 'Brand Awareness', label: 'เพื่อสร้างภาพลักษณ์แบรนด์ (Brand Awareness)' },
  { val: 'Engagement Drive', label: 'เพื่อดึงดูดผู้ร่วมโต้ตอบ (Engagement Drive)' },
];

const CONTENT_TEMPLATES = [
  {
    id: 'labour-law',
    title: 'Labor Law Advice',
    desc: 'Educational tip breakdown',
    topic: 'Labour Law Update',
    audience: 'HR Managers',
    tone: 'Expert',
    style: 'Practical',
    objective: 'Education',
    wordCount: '800',
  },
  {
    id: 'pdpa-compliance',
    title: 'PDPA Compliance Checklist',
    desc: 'Step-by-step audit checklist',
    topic: 'PDPA Compliance Tips',
    audience: 'Business Owners',
    tone: 'Professional',
    style: 'Educational',
    objective: 'Awareness',
    wordCount: '500',
  },
  {
    id: 'service-biz-qa',
    title: 'Service Business Q&A',
    desc: 'Client interview mock',
    topic: 'Service Business Marketing',
    audience: 'SME Owners',
    tone: 'Friendly',
    style: 'Interactive',
    objective: 'Engagement',
    wordCount: '600',
  }
];

export function GenerateForm({ initialBrand, hasOpenAIKey }: GenerateFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  
  const [selectedTopic, setSelectedTopic] = useState('custom');
  const [customTopic, setCustomTopic] = useState('');
  
  // Platform selection state
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn');
  
  // Bilingual switch
  const [generateBoth, setGenerateBoth] = useState(true);
  
  // Custom states
  const [outputMode, setOutputMode] = useState('Main post + secondary in comment');
  const [customOutputMode, setCustomOutputMode] = useState('');
  const [customTone, setCustomTone] = useState('');
  const [customAudienceText, setCustomAudienceText] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [customFormat, setCustomFormat] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['compliance', 'lawupdate', 'legalinsights']);
  
  const [tone, setTone] = useState(initialBrand?.tone || 'Professional');
  const [personality, setPersonality] = useState(initialBrand?.personality || 'น่าเชื่อถือ');
  const [audience, setAudience] = useState(initialBrand?.target_audience || 'Legal & Compliance Professionals');
  const [objective, setObjective] = useState('Educate');
  const [format, setFormat] = useState('Educational Post');
  const [wordCount, setWordCount] = useState('500');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [showCustomOutput, setShowCustomOutput] = useState(true);
  const [showCustomAudience, setShowCustomAudience] = useState(true);
  const [showCustomTone, setShowCustomTone] = useState(true);
  const [showCustomGoal, setShowCustomGoal] = useState(true);
  const [showCustomFormat, setShowCustomFormat] = useState(true);

  const { t, currentLanguage } = useLanguage();

  // Knowledge Sources state variables
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [manualContext, setManualContext] = useState('');

  // Output Workspace state variables
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAddUrl = () => {
    if (!currentUrl.trim()) return;
    try {
      new URL(currentUrl);
    } catch {
      toast.error('กรุณาระบุ URL ที่ถูกต้อง (เช่น https://example.com)');
      return;
    }
    if (urls.length >= 5) {
      toast.error('สามารถเพิ่มได้สูงสุด 5 URLs');
      return;
    }
    if (urls.includes(currentUrl.trim())) {
      toast.error('URL นี้ถูกเพิ่มไปแล้ว');
      return;
    }
    setUrls([...urls, currentUrl.trim()]);
    setCurrentUrl('');
  };

  const handleRemoveUrl = (indexToRemove: number) => {
    setUrls(urls.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUseTemplate = (template: typeof CONTENT_TEMPLATES[number]) => {
    setSelectedTopic('custom');
    setCustomTopic(template.topic);
    setAudience(template.audience);
    setTone(template.tone);
    setPersonality(template.style);
    setObjective(template.objective);
    setWordCount(template.wordCount);
    setActiveTemplateId(template.id);
    setSuccessCount(null);
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

  async function handleSubmit() {
    const finalTopic = selectedTopic === 'custom' ? customTopic : selectedTopic;
    if (!finalTopic) {
      toast.error('กรุณาระบุหัวข้อคอนเทนต์');
      return;
    }

    setLoading(true);
    setLoadingStage(0);
    
    // Simulate step progress increments
    const intervalId = setInterval(() => {
      setLoadingStage(prev => (prev < 4 ? prev + 1 : prev));
    }, 2000);

    try {
      const result = await generatePosts({
        topic: finalTopic,
        tone: tone,
        personality: personality,
        postCount: 5,
        urls: urls,
        manualContext: manualContext || undefined
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setSuccessCount(result.count ?? null);
      if (result.posts && result.posts.length > 0) {
        setGeneratedPosts(result.posts);
      }
      toast.success(`สร้างโพสต์สำเร็จ ${result.count} รายการ!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      toast.error(message);
    } finally {
      clearInterval(intervalId);
      setLoading(false);
    }
  }

  // Active post preview content resolver
  const activePost = generatedPosts[0] || null;
  const previewTitle = activePost?.title || "Your Workspace Brand";
  const previewThai = activePost?.caption || "กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ไม่ใช่แค่ข้อบังคับ แต่คือความไว้วางใจที่ลูกค้ามีให้กับองค์กรของคุณ การปฏิบัติตามอย่างถูกต้อง คือการสร้างมาตรฐานที่ดี และลดความเสี่ยงในระยะยาว";
  const previewEnglish = activePost?.caption ? "" : "PDPA is more than a regulation—it's the trust your customers place in your organization. Proper compliance builds a sustainable standard and reduces long-term risk.";
  const previewHashtags = activePost?.hashtags || hashtags.map(t => `#${t}`).join(' ');

  return (
    <div className="flex flex-col lg:flex-row w-full gap-8 select-none items-start pb-20 text-left">
      
      {/* PANE A: Control Deck (22% width) */}
      <div className="w-full lg:w-[22%] shrink-0 space-y-6">
        
        {/* Brand Context HUD */}
        <div className="bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-none stroke-[#967F5C] stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">Brand Context</h3>
            </div>
            <Link href="/profile" className="text-[10px] font-bold text-[#967F5C] hover:underline">View →</Link>
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] dark:bg-slate-800 flex items-center justify-center font-serif text-[#1E1D1B] dark:text-[#EBE7E0] font-bold text-sm">
                OS
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0] truncate">
                  {initialBrand?.name || "Your Workspace Brand"}
                </p>
                <p className="text-[10px] text-[#7C756C] dark:text-slate-500 font-medium">
                  {initialBrand?.business_type || "Legal. Trusted. Precise."}
                </p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-[#E6DFD5] dark:border-slate-800/80 text-[11px] text-[#7C756C] dark:text-slate-400">
              <p className="font-medium text-[#7C756C] dark:text-slate-300">
                Voice: <span className="text-[#1E1D1B] dark:text-[#EBE7E0] font-bold">Professional • Formal • Clear</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Templates */}
        <div className="bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-none stroke-[#967F5C] stroke-2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">Content Templates</h3>
            </div>
            <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer">View all →</span>
          </div>
          <div className="space-y-3">
            {CONTENT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleUseTemplate(tmpl)}
                className={cn(
                  "w-full text-left py-1 flex items-start gap-2.5 transition-all",
                  activeTemplateId === tmpl.id ? "opacity-100" : "opacity-80 hover:opacity-100"
                )}
              >
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#967F5C] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs leading-normal truncate", 
                    activeTemplateId === tmpl.id ? "text-[#1E1D1B] dark:text-[#EBE7E0] font-bold" : "text-[#1E1D1B] dark:text-[#EBE7E0] font-medium"
                  )}>{tmpl.title}</p>
                  <p className="text-[10.5px] text-[#7C756C] dark:text-slate-500 font-medium leading-none mt-0.5">{tmpl.desc}</p>
                </div>
              </button>
            ))}
            <div className="pt-2 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
              <span className="text-[10.5px] font-bold text-[#7C756C] dark:text-slate-400 hover:text-[#967F5C] cursor-pointer">Browse all templates →</span>
            </div>
          </div>
        </div>

        {/* Active Content Angles */}
        <div className="bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          <div className="flex justify-between items-center pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-none stroke-[#967F5C] stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">Active Content Angles</h3>
            </div>
            <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer">Manage →</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {['Educate & Convert', 'Myth Busting', 'Compliance Alert', 'Interactive Q&A'].map((angle, idx) => (
              <span key={idx} className="text-[9.5px] font-bold text-[#7C756C] dark:text-slate-400 bg-transparent border border-[#E6DFD5] dark:border-slate-700 px-2.5 py-1 rounded-lg">
                {angle}
              </span>
            ))}
          </div>
          
          <div className="pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80 space-y-2">
            <span className="block text-[9.5px] uppercase tracking-wider font-bold text-[#7C756C]">Suggested Angle</span>
            <div className="p-3.5 bg-[#FAF8F5] dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl text-left space-y-1.5">
              <div className="flex items-start gap-2">
                <svg className="w-4.5 h-4.5 fill-[#967F5C] stroke-[#967F5C] shrink-0 mt-0.5" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <div>
                  <p className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0] leading-snug">Q2 Compliance Series</p>
                  <p className="text-[10px] text-[#7C756C] font-semibold mt-0.5">Increase awareness and trust</p>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedTopic('custom');
                      setCustomTopic('Q2 Compliance Series: คัมภีร์ดูแลความปลอดภัยข้อมูลสำหรับธุรกิจบริการ');
                    }}
                    className="text-[10px] font-bold text-[#967F5C] hover:underline mt-2 block cursor-pointer"
                  >
                    Use this angle →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PANE B: Command Composer (48% width) */}
      <div className="w-full lg:w-[48%] flex-1 space-y-6">
        
        {/* COMPOSER FORM CARD */}
        <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          
          <div className="space-y-1 pb-3 border-b border-[#E6DFD5]/70 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-[#967F5C]" />
              <span className="text-xs uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0] font-bold">Command Composer</span>
            </div>
            <p className="text-[10.5px] text-[#7C756C] dark:text-slate-400 font-medium">
              Define what to create. Our AI will handle the structure, tone, and bilingual output.
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. Content Topic */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">1. Content Topic</Label>
              <textarea 
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter your content topic or key message..."
                rows={2}
                className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] outline-none resize-none font-medium leading-relaxed"
              />
            </div>

            {/* 2. Languages */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">2. Languages</Label>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-1 gap-2.5">
                  <div className="flex-1 space-y-1 text-left">
                    <span className="text-[9px] font-bold text-[#7C756C] uppercase tracking-wider">Primary</span>
                    <Select value="Thai">
                      <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Thai">Thai</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1 text-left">
                    <span className="text-[9px] font-bold text-[#7C756C] uppercase tracking-wider">Secondary</span>
                    <Select value="English">
                      <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Thai">Thai</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-3.5 self-end h-9.5">
                  <span className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">Generate both versions</span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => setGenerateBoth(!generateBoth)} 
                      className={cn(
                        "w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer", 
                        generateBoth ? "bg-[#1E1D1B] dark:bg-[#EBE7E0]" : "bg-slate-200 dark:bg-slate-800"
                      )}
                    >
                      <span className={cn(
                        "w-4.5 h-4.5 rounded-full bg-white dark:bg-[#1E1D1B] transition-transform", 
                        generateBoth ? "translate-x-4.5" : "translate-x-0"
                      )} />
                    </button>
                    <svg className="w-3.5 h-3.5 fill-none stroke-[#7C756C] stroke-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Output Mode */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">3. Output Mode</Label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                <div className="md:col-span-5">
                  <Select value={outputMode} onValueChange={(val) => val && setOutputMode(val)}>
                    <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main post + secondary in comment">Main post + secondary in comment</SelectItem>
                      <SelectItem value="Bilingual caption">Bilingual caption</SelectItem>
                      <SelectItem value="Main post only">Main post only</SelectItem>
                      <SelectItem value="Separate versions">Separate versions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomOutput(!showCustomOutput)}
                    className={cn(
                      "w-full h-9.5 flex items-center justify-center font-bold border rounded-lg text-xs transition-all cursor-pointer",
                      showCustomOutput 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] text-[#7C756C] dark:border-slate-800"
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
                    className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* 4. Platform */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">4. Platform</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'LinkedIn', icon: () => (
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  )},
                  { name: 'Facebook', icon: () => (
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  )},
                  { name: 'Website', icon: () => (
                    <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  )},
                  { name: 'Instagram', icon: () => (
                    <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  )},
                  { name: 'Other', icon: () => <Plus className="w-3 h-3" /> }
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelectedPlatform(p.name)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                      selectedPlatform === p.name 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {p.icon()}
                    {p.name === 'Other' ? '+ Other' : p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 5 & 6. Audience & Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">5. Audience</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={audience} onValueChange={(val) => val && setAudience(val)}>
                        <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Legal & Compliance Professionals">Legal & Compliance Professionals</SelectItem>
                          <SelectItem value="SME Owners">SME Owners</SelectItem>
                          <SelectItem value="HR Managers">HR Managers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCustomAudience(!showCustomAudience)}
                      className={cn(
                        "px-3.5 h-9.5 flex items-center justify-center font-bold border rounded-lg text-xs transition-all cursor-pointer",
                        showCustomAudience
                          ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]"
                          : "bg-transparent border-[#E6DFD5] text-[#7C756C] dark:border-slate-800"
                      )}
                    >
                      Other
                    </button>
                  </div>
                  {showCustomAudience && (
                    <Input 
                      value={customAudienceText}
                      onChange={(e) => setCustomAudienceText(e.target.value)}
                      placeholder="Describe custom audience..."
                      className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">6. Tone</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                        <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCustomTone(!showCustomTone)}
                      className={cn(
                        "px-3.5 h-9.5 flex items-center justify-center font-bold border rounded-lg text-xs transition-all cursor-pointer",
                        showCustomTone
                          ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]"
                          : "bg-transparent border-[#E6DFD5] text-[#7C756C] dark:border-slate-800"
                      )}
                    >
                      Other
                    </button>
                  </div>
                  {showCustomTone && (
                    <Input 
                      value={customTone}
                      onChange={(e) => setCustomTone(e.target.value)}
                      placeholder="Describe custom tone..."
                      className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 7 & 8. Content Goal & Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">7. Content Goal</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 min-w-0">
                    <Select value={objective} onValueChange={(val) => val && setObjective(val)}>
                      <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Educate">Educate</SelectItem>
                        <SelectItem value="Promote">Promote</SelectItem>
                        <SelectItem value="Engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomGoal(!showCustomGoal)}
                    className={cn(
                      "px-3 h-9.5 flex items-center justify-center font-bold border rounded-lg text-xs transition-all shrink-0 cursor-pointer",
                      showCustomGoal
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]"
                        : "bg-transparent border-[#E6DFD5] text-[#7C756C] dark:border-slate-800"
                    )}
                  >
                    Other
                  </button>
                  {showCustomGoal && (
                    <Input 
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Describe custom goal..."
                      className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700 flex-1 min-w-[120px]"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">8. Content Format</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 min-w-0">
                    <Select value={format} onValueChange={(val) => val && setFormat(val)}>
                      <SelectTrigger className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Educational Post">Educational Post</SelectItem>
                        <SelectItem value="Checklist">Checklist</SelectItem>
                        <SelectItem value="Q&A">Q&A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomFormat(!showCustomFormat)}
                    className={cn(
                      "px-3 h-9.5 flex items-center justify-center font-bold border rounded-lg text-xs transition-all shrink-0 cursor-pointer",
                      showCustomFormat
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]"
                        : "bg-transparent border-[#E6DFD5] text-[#7C756C] dark:border-slate-800"
                    )}
                  >
                    Other
                  </button>
                  {showCustomFormat && (
                    <Input 
                      value={customFormat}
                      onChange={(e) => setCustomFormat(e.target.value)}
                      placeholder="Describe custom format..."
                      className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700 flex-1 min-w-[120px]"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 9. Hashtags */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">9. Hashtags</Label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-[#E6DFD5] dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg min-h-10 items-center">
                {hashtags.map((tag) => (
                  <span key={tag} className="text-[10.5px] font-bold bg-[#FAF8F5] dark:bg-slate-800 border border-[#E6DFD5] dark:border-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1.5 text-[#1E1D1B] dark:text-[#EBE7E0]">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveHashtag(tag)} className="text-[#7C756C] hover:text-[#1E1D1B] font-bold text-[9px] cursor-pointer">×</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleAddHashtag}
                  placeholder="Add hashtag..."
                  className="flex-1 text-xs outline-none bg-transparent min-w-[120px] text-[#1E1D1B] dark:text-[#EBE7E0]"
                />
              </div>
            </div>

            {/* 10. Knowledge Source */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">10. Knowledge Source</Label>
              <div className="flex gap-2">
                <Input 
                  type="url"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="h-9.5 text-xs rounded-lg border-[#E6DFD5] dark:border-slate-700"
                />
                <Button 
                  type="button" 
                  onClick={handleAddUrl}
                  className="bg-[#FAF8F5] text-[#1E1D1B] border border-[#E6DFD5] dark:bg-slate-800 dark:text-[#EBE7E0] dark:border-slate-700 font-bold text-xs h-9.5 rounded-lg px-4 hover:bg-slate-50 cursor-pointer shrink-0"
                >
                  + ADD URL
                </Button>
              </div>
              
              {urls.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2 bg-[#FAF8F5] dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-700 rounded-lg mt-1.5">
                  {urls.map((url, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px]">
                      <span className="truncate max-w-[280px] font-medium text-[#7C756C] flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-[#7C756C]" /> {url}
                      </span>
                      <button type="button" onClick={() => handleRemoveUrl(idx)} className="text-[#7C756C] hover:text-red-500 font-bold cursor-pointer">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 11. Notes / Constraints */}
            <div className="space-y-2">
              <Label className="text-[10.5px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] uppercase tracking-wider">11. Notes / Constraints (Optional)</Label>
              <textarea 
                value={manualContext}
                onChange={(e) => setManualContext(e.target.value)}
                placeholder="Add any specific notes, constraints, or key points to include..."
                rows={3}
                className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] outline-none resize-none font-medium leading-relaxed"
              />
            </div>

          </div>

          <div className="pt-2">
            <Button 
              onClick={handleSubmit}
              disabled={loading || !hasOpenAIKey}
              className="w-full bg-[#1E1D1B] hover:opacity-90 dark:bg-[#EBE7E0] dark:text-[#1E1D1B] text-white font-bold text-xs h-11 px-8 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkle className="w-4.5 h-4.5 fill-current" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

      {/* PANE C: Expectation Hub (30% width) */}
      <div className="w-full lg:w-[30%] shrink-0 space-y-6">
        
        {/* Content Performance Score */}
        <div className="bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
            <Target className="w-4 h-4 text-[#967F5C]" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">Content Performance Score</h3>
          </div>
          
          <div className="space-y-4 pt-1">
            {[
              { name: 'Hook Strength', score: '8.6/10', pct: 86 },
              { name: 'Readability Meter', score: '9.0/10', pct: 90 },
              { name: 'Engagement Potential', score: '7.4/10', pct: 74 },
              { name: 'CTA Strength', score: '8.2/10', pct: 82 }
            ].map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0]">
                  <span className="font-semibold">{metric.name}</span>
                  <span>{metric.score}</span>
                </div>
                <div className="w-full bg-[#FAF8F5] dark:bg-slate-850 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#1E1D1B] dark:bg-[#EBE7E0] h-full" style={{ width: `${metric.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Preview Feed */}
        <div className="bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-none stroke-[#967F5C] stroke-2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">Platform Preview Feed</h3>
            </div>
            <div className="flex gap-2">
              <svg className="w-4 h-4 fill-none stroke-[#967F5C] stroke-2 cursor-pointer" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <svg className="w-4 h-4 fill-none stroke-slate-400 dark:stroke-slate-600 stroke-2 cursor-pointer" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
          </div>

          {/* LinkedIn Styled Mockup Post */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-4 space-y-3.5 bg-white dark:bg-slate-900/40 shadow-sm text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center font-serif font-bold text-xs text-[#1E1D1B]">
                  OS
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-[#1E1D1B] dark:text-[#EBE7E0] leading-tight">Your Workspace Brand</h5>
                  <div className="flex items-center gap-1.5 text-[9px] text-[#7C756C] font-semibold mt-0.5">
                    <span>2m</span>
                    <span>•</span>
                    <Globe className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#7C756C] cursor-pointer" />
            </div>
            
            <div className="space-y-2.5 text-xs text-[#1E1D1B] dark:text-[#EBE7E0] font-medium leading-relaxed">
              <p className="font-semibold">{previewThai}</p>
              {previewEnglish && <p>{previewEnglish}</p>}
              <p className="text-[#967F5C] font-bold mt-1.5 select-all">{previewHashtags}</p>
            </div>
            
            <div className="aspect-[1.91/1] bg-[#FAF8F5] border border-dashed border-[#E6DFD5] dark:border-slate-800 dark:bg-slate-800 rounded-lg flex items-center justify-center p-4 text-center">
              <span className="text-[9px] text-[#7C756C] font-bold uppercase tracking-wider">
                Preview shows bilingual output with hashtags.<br/>
                Actual formatting may vary by platform.
              </span>
            </div>

            <div className="grid grid-cols-4 p-0.5 border-t border-[#E6DFD5]/50 dark:border-slate-800/80 pt-2 bg-slate-50/50 rounded-lg">
              <button type="button" className="flex items-center justify-center gap-1 text-[#7C756C] text-[10px] font-bold hover:text-[#1E1D1B] py-1 transition-colors cursor-pointer"><ThumbsUp className="w-3 h-3" /> Like</button>
              <button type="button" className="flex items-center justify-center gap-1 text-[#7C756C] text-[10px] font-bold hover:text-[#1E1D1B] py-1 transition-colors cursor-pointer"><MessageSquare className="w-3 h-3" /> Comment</button>
              <button type="button" className="flex items-center justify-center gap-1 text-[#7C756C] text-[10px] font-bold hover:text-[#1E1D1B] py-1 transition-colors cursor-pointer"><Share2 className="w-3 h-3" /> Share</button>
              <button type="button" className="flex items-center justify-center gap-1 text-[#7C756C] text-[10px] font-bold hover:text-[#1E1D1B] py-1 transition-colors cursor-pointer"><Send className="w-3 h-3" /> Send</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
