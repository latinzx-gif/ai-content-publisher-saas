'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Check, 
  Plus, 
  HelpCircle,
  Image as ImageIcon,
  Columns,
  Grid,
  Layout,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/language-provider';

export default function AssetComposerPage() {
  const { t, currentLanguage } = useLanguage();
  const [assetGoal, setAssetGoal] = useState('Promote a service or solution');
  const [imageMode, setImageMode] = useState('Collage');
  const [imageCount, setImageCount] = useState(4);
  const [presetLayout, setPresetLayout] = useState('One Large + Three Small');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [language, setLanguage] = useState('Bilingual');
  const [density, setDensity] = useState('Medium');
  const [visualPreset, setVisualPreset] = useState('Quiet Luxury - Editorial');

  // Helper to resolve translation inline for option values
  const getLabel = (enVal: string, thVal: string) => {
    return currentLanguage === 'th' ? thVal : enVal;
  };

  // Option lists with TH/EN values
  const imageModes = [
    { en: 'Single Image', th: 'ภาพเดี่ยว' },
    { en: 'Carousel', th: 'ภาพสไลด์ (Carousel)' },
    { en: 'Collage', th: 'ภาพคอลลาจ' },
    { en: 'Template Reuse', th: 'ใช้เทมเพลตซ้ำ' },
    { en: '+ Other', th: '+ อื่นๆ' }
  ];

  const presetLayouts = [
    { en: 'Single Poster', th: 'โปสเตอร์เดี่ยว', icon: ImageIcon },
    { en: 'Split Two-Up', th: 'แบ่งสองฝั่ง', icon: Columns },
    { en: 'Four-Tile Grid', th: 'ตารางสี่ช่อง', icon: Grid },
    { en: 'One Large + Three Small', th: 'หนึ่งใหญ่ สามเล็ก', icon: Layout },
    { en: 'Magazine Mosaic', th: 'โมเสกนิตยสาร', icon: Layout }
  ];

  const aspectRatios = [
    { en: '1:1', th: '1:1' },
    { en: '4:5', th: '4:5' },
    { en: '16:9', th: '16:9' },
    { en: '+ Other', th: '+ อื่นๆ' }
  ];

  const languages = [
    { en: 'Thai', th: 'ภาษาไทย' },
    { en: 'English', th: 'ภาษาอังกฤษ' },
    { en: 'Bilingual', th: 'สองภาษา' },
    { en: '+ Other', th: '+ อื่นๆ' }
  ];

  const densities = [
    { en: 'Low', th: 'น้อย' },
    { en: 'Medium', th: 'ปานกลาง' },
    { en: 'High', th: 'มาก' }
  ];

  const goals = [
    { en: 'Promote a service or solution', th: 'โปรโมทบริการหรือโซลูชันธุรกิจ' },
    { en: 'Educate on legal compliance', th: 'ให้ความรู้เรื่องการปฏิบัติตามกฎหมาย' },
    { en: 'Share industry news & insights', th: 'แบ่งปันข่าวสารและข้อมูลเชิงลึก' }
  ];

  // Resolve current active state text
  const currentGoalLabel = goals.find(g => g.en === assetGoal)?.th && currentLanguage === 'th'
    ? goals.find(g => g.en === assetGoal)?.th
    : assetGoal;

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="space-y-1 text-left pb-3 border-b border-[#E6DFD5] dark:border-slate-800">
        <h2 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
          {t('composer.title')}
        </h2>
        <p className="text-xs text-[#7C756C] dark:text-slate-400">
          {t('composer.subtitle')}
        </p>
      </div>

      {/* Main Container (Two-column layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Parameter Selector Form */}
        <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left">
          
          {/* Goal Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.goal.label')}</label>
              <div className="h-9.5 border border-[#E6DFD5] dark:border-slate-700 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-xs font-semibold">
                <span>{currentGoalLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.goal.custom')}</label>
              <input 
                type="text" 
                placeholder={t('composer.goal.placeholder')}
                className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] h-9.5 outline-none font-medium"
              />
            </div>
          </div>

          {/* Image Mode */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.mode.label')}</label>
            <div className="flex flex-wrap gap-2">
              {imageModes.map((mode) => (
                <button
                  key={mode.en}
                  type="button"
                  onClick={() => setImageMode(mode.en)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer",
                    imageMode === mode.en 
                      ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                      : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                  )}
                >
                  {getLabel(mode.en, mode.th)}
                </button>
              ))}
            </div>
          </div>

          {/* Image Count */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.count.label')}</label>
            <div className="flex gap-2">
              {[1, 2, 4, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setImageCount(count)}
                  className={cn(
                    "w-10 h-8 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center",
                    imageCount === count 
                      ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                      : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Presets */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.layout.label')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {presetLayouts.map((lay) => (
                <button
                  key={lay.en}
                  type="button"
                  onClick={() => setPresetLayout(lay.en)}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-2 h-full justify-between",
                    presetLayout === lay.en 
                      ? "bg-[#FAF8F5] border-[#967F5C] text-[#1E1D1B] font-bold dark:bg-slate-800/50" 
                      : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]/50"
                  )}
                >
                  <lay.icon className="w-4 h-4 text-[#967F5C] shrink-0" />
                  <span className="text-[9px] font-bold leading-tight mt-1">{getLabel(lay.en, lay.th)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Text Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.ratio.label')}</label>
              <div className="flex gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.en}
                    type="button"
                    onClick={() => setAspectRatio(ratio.en)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center",
                      aspectRatio === ratio.en 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {getLabel(ratio.en, ratio.th)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.lang.label')}</label>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.en}
                    type="button"
                    onClick={() => setLanguage(lang.en)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center",
                      language === lang.en 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {getLabel(lang.en, lang.th)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Text Density & Visual Style Preset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.density.label')}</label>
              <div className="flex gap-2">
                {densities.map((dens) => (
                  <button
                    key={dens.en}
                    type="button"
                    onClick={() => setDensity(dens.en)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center",
                      density === dens.en 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {getLabel(dens.en, dens.th)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.preset.label')}</label>
              <div className="h-9.5 border border-[#E6DFD5] dark:border-slate-700 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-xs font-semibold">
                <span>{getLabel(visualPreset, 'Quiet Luxury - สไตล์นิตยสาร')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
              </div>
            </div>
          </div>

          {/* Reference Assets */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">{t('composer.ref.label')}</label>
            <div className="border border-dashed border-[#E6DFD5] dark:border-slate-800 bg-[#FAF8F5]/30 dark:bg-slate-900 rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-center text-xs">
              <ImageIcon className="w-7 h-7 text-[#7C756C]" />
              <p className="font-semibold text-[#7C756C]">{t('composer.ref.placeholder')}</p>
              <Button variant="outline" className="h-7 text-[10px] font-bold border-[#E6DFD5] rounded mt-1">
                {t('composer.ref.btn')}
              </Button>
            </div>
          </div>

          {/* CTA Generate Button */}
          <div className="pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80 flex justify-end">
            <Button 
              onClick={() => toast.success(t('composer.success'))}
              className="bg-[#1E1D1B] hover:bg-[#2D2A26] dark:bg-[#EBE7E0] dark:hover:bg-white text-white dark:text-[#1E1D1B] font-bold text-xs h-11 px-8 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {t('composer.action.generate')} <Plus className="w-4 h-4" />
            </Button>
          </div>

        </div>

        {/* Right Column: Preview Pane & Output Summaries */}
        <div className="space-y-6 flex flex-col h-full justify-between">
          
          {/* Collage Preview Card */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left flex-1 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">
                {t('composer.preview.title', { preset: getLabel(presetLayout, presetLayouts.find(l => l.en === presetLayout)?.th || presetLayout), count: imageCount })}
              </span>
              <span className="text-[#7C756C] text-[10px] font-bold">{aspectRatio}</span>
            </div>

            {/* Collage Layout Grid */}
            <div className="w-full rounded-xl overflow-hidden bg-[#F3EFEA] dark:bg-slate-800 aspect-[4/5] relative">
              
              {presetLayout === 'Single Poster' && (
                <div className="w-full h-full relative bg-gradient-to-tr from-[#2C2A29] to-[#4A4745] flex flex-col justify-end p-6 text-white transition-all duration-300">
                  <div className="absolute inset-0 bg-[#2C2A29]/65 mix-blend-multiply" />
                  <div className="relative z-10 space-y-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#C8B69B] block border-b border-[#C8B69B]/40 pb-1.5">
                      {currentLanguage === 'th' ? 'การพิจารณาคดีและกฎหมาย' : 'Legal Advisory'}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl tracking-wide leading-tight">
                      {currentLanguage === 'th' ? 'ความชัดเจนในวันนี้ ความมั่นใจในวันข้างหน้า' : 'Clarity today. Confidence tomorrow.'}
                    </h3>
                    <p className="text-xs text-[#E6DFD5]/90 font-medium leading-relaxed">
                      {currentLanguage === 'th'
                        ? 'คำปรึกษาที่ตรงประเด็นและมีความแม่นยำจากทีมผู้เชี่ยวชาญเพื่อปกป้องทรัพย์สินและผลประโยชน์ของแบรนด์'
                        : 'Precision-driven counsel and guidance from elite legal experts to safeguard your brand assets.'}
                    </p>
                    <p className="text-[9px] text-[#C8B69B] font-semibold tracking-wider pt-2">
                      {currentLanguage === 'th' ? 'พันธมิตรทางกฎหมายที่แบรนด์ชั้นนำไว้วางใจ' : 'Your trusted legal partner for every milestone.'}
                    </p>
                  </div>
                </div>
              )}

              {presetLayout === 'Split Two-Up' && (
                <div className="grid grid-cols-2 gap-2 h-full w-full p-1 bg-white dark:bg-slate-900 transition-all duration-300">
                  {/* Left Panel */}
                  <div className="relative bg-gradient-to-tr from-[#2C2A29] to-[#4A4745] flex flex-col justify-end p-4 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[#2C2A29]/60 mix-blend-multiply" />
                    <div className="relative z-10 space-y-2.5">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-[#C8B69B] block border-b border-[#C8B69B]/20 pb-0.5">
                        {currentLanguage === 'th' ? 'คำแนะนำ' : 'Guidance'}
                      </span>
                      <h4 className="font-serif text-sm md:text-base tracking-wide leading-snug">
                        {currentLanguage === 'th' ? 'แนวทางที่แม่นยำ' : 'Strategic Guidance'}
                      </h4>
                      <p className="text-[9px] text-[#E6DFD5]/90">
                        {currentLanguage === 'th' ? 'การนำทางในกรอบกฎหมายที่ซับซ้อน' : 'Navigating complex frameworks with absolute precision.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="relative bg-gradient-to-br from-[#5C5650] to-[#756E67] flex flex-col justify-end p-4 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 space-y-2.5">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-[#C8B69B] block border-b border-[#C8B69B]/20 pb-0.5">
                        {currentLanguage === 'th' ? 'ทางออกธุรกิจ' : 'Outcomes'}
                      </span>
                      <h4 className="font-serif text-sm md:text-base tracking-wide leading-snug">
                        {currentLanguage === 'th' ? 'คำปรึกษาที่ตอบโจทย์' : 'Tailored Solutions'}
                      </h4>
                      <p className="text-[9px] text-[#E6DFD5]/90">
                        {currentLanguage === 'th' ? 'โซลูชันที่ออกแบบมาเพื่อธุรกิจของคุณ' : 'Outcome-focused strategies tailored to your enterprise.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {presetLayout === 'Four-Tile Grid' && (
                <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full p-1 bg-white dark:bg-slate-900 transition-all duration-300">
                  {[
                    {
                      title: currentLanguage === 'th' ? 'กฎหมายนิติบุคคล' : 'Corporate Law',
                      desc: currentLanguage === 'th' ? 'การจัดตั้งและดูแลโครงสร้างธุรกิจ' : 'Business establishment & framework',
                      grad: 'from-[#2C2A29] to-[#3C3A39]'
                    },
                    {
                      title: currentLanguage === 'th' ? 'วางแผนโครงสร้างภาษี' : 'Tax Advisory',
                      desc: currentLanguage === 'th' ? 'การบริหารจัดการภาษีนิติบุคคลอย่างเป็นระบบ' : 'Corporate tax optimization strategy',
                      grad: 'from-[#4E4B49] to-[#5E5B59]'
                    },
                    {
                      title: currentLanguage === 'th' ? 'ทรัพย์สินทางปัญญา' : 'IP Protection',
                      desc: currentLanguage === 'th' ? 'ความคุ้มครองลิขสิทธิ์และเครื่องหมายการค้า' : 'Copyright & trademark protection',
                      grad: 'from-[#5C5650] to-[#6C6660]'
                    },
                    {
                      title: currentLanguage === 'th' ? 'ความสอดคล้อง PDPA' : 'PDPA Compliance',
                      desc: currentLanguage === 'th' ? 'ระบบการจัดเก็บข้อมูลลูกค้าที่ถูกต้อง' : 'Customer data privacy frameworks',
                      grad: 'from-[#383634] to-[#484644]'
                    }
                  ].map((tile, i) => (
                    <div key={i} className={cn("relative bg-gradient-to-tr flex flex-col justify-end p-3.5 text-white rounded-lg overflow-hidden", tile.grad)}>
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="relative z-10 space-y-1.5 flex-1 flex flex-col justify-end">
                        <h4 className="font-serif text-[11px] font-bold tracking-wide leading-tight border-b border-white/10 pb-1">{tile.title}</h4>
                        <p className="text-[8px] text-[#E6DFD5]/90 leading-normal">{tile.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {presetLayout === 'One Large + Three Small' && (
                <div className="grid grid-cols-2 gap-2 h-full w-full p-1 bg-white dark:bg-slate-900 transition-all duration-300">
                  {/* Left Column (Large Image) */}
                  <div className="relative bg-gradient-to-tr from-[#2C2A29] to-[#4A4745] flex flex-col justify-end p-5 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[#2C2A29]/60 mix-blend-multiply" />
                    <div className="relative z-10 space-y-3">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-[#C8B69B] block border-b border-[#C8B69B]/40 pb-1">
                        {currentLanguage === 'th' ? 'ที่ปรึกษากฎหมาย' : 'Legal Advisory'}
                      </span>
                      <h3 className="font-serif text-lg tracking-wide leading-tight">
                        {currentLanguage === 'th' ? 'ความชัดเจนในวันนี้ ความมั่นใจในวันข้างหน้า' : 'Clarity today. Confidence tomorrow.'}
                      </h3>
                      <p className="text-[8px] text-[#E6DFD5]/95">
                        {currentLanguage === 'th' ? 'คำปรึกษาที่ชัดเจนในวันนี้ เพื่อความมั่นใจที่ยั่งยืน' : 'Clear counsel today for sustained assurance.'}
                      </p>
                      <p className="text-[8px] text-[#C8B69B] font-semibold tracking-wider pt-2">
                        {currentLanguage === 'th' ? 'พันธมิตรที่ไว้ใจได้ในทุกเป้าหมายธุรกิจ' : 'Your trusted legal partner.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column (Three Small Images) */}
                  <div className="grid grid-rows-3 gap-2">
                    {[
                      {
                        title: currentLanguage === 'th' ? 'คำแนะนำเชิงกลยุทธ์' : 'Strategic guidance for every stage.',
                        grad: 'from-[#5C5650] to-[#756E67]'
                      },
                      {
                        title: currentLanguage === 'th' ? 'ยึดมั่นความถูกต้อง มุ่งผลสัมฤทธิ์' : 'Rooted in integrity. Focused on outcomes.',
                        grad: 'from-[#383634] to-[#595653]'
                      },
                      {
                        title: currentLanguage === 'th' ? 'ทางออกทางกฎหมายสำหรับธุรกิจคุณ' : 'Solutions tailored to your business.',
                        grad: 'from-[#4E4B49] to-[#696562]'
                      }
                    ].map((small, idx) => (
                      <div key={idx} className={cn("relative bg-gradient-to-br flex flex-col justify-end p-3 text-white rounded-lg overflow-hidden", small.grad)}>
                        <div className="absolute inset-0 bg-black/40" />
                        <p className="relative z-10 font-serif text-[9px] leading-tight">{small.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {presetLayout === 'Magazine Mosaic' && (
                <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-1 bg-white dark:bg-slate-900 transition-all duration-300">
                  {/* Left Column (Covers 2cols x 3rows) */}
                  <div className="col-span-2 row-span-3 relative bg-gradient-to-tr from-[#2C2A29] to-[#5C5650] flex flex-col justify-end p-5 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="relative z-10 space-y-3">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-[#C8B69B] block border-b border-[#C8B69B]/40 pb-1">
                        {currentLanguage === 'th' ? 'สรุปรายงานเด่น' : 'Featured Report'}
                      </span>
                      <h3 className="font-serif text-xl tracking-wide leading-tight">
                        {currentLanguage === 'th' ? 'เจาะลึกทิศทาง และการคุ้มครองตราสินค้า' : 'Modern Brand Protection Insights'}
                      </h3>
                      <p className="text-[8px] text-[#E6DFD5]/90 leading-normal">
                        {currentLanguage === 'th' ? 'สำรวจกลยุทธ์ระดับโลกสำหรับธุรกิจและเครื่องหมายการค้า' : 'Exploring global asset structures and intellectual property laws.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Top Card */}
                  <div className="row-span-1 relative bg-gradient-to-tr from-[#383634] to-[#4E4B49] flex flex-col justify-end p-2.5 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" />
                    <h4 className="relative z-10 font-serif text-[8px] font-semibold leading-tight">
                      {currentLanguage === 'th' ? 'การจัดการความเสี่ยง' : 'Risk Audit'}
                    </h4>
                  </div>

                  {/* Right Middle Card */}
                  <div className="row-span-1 relative bg-gradient-to-br from-[#595653] to-[#756E67] flex flex-col justify-end p-2.5 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/45" />
                    <h4 className="relative z-10 font-serif text-[8px] font-semibold leading-tight">
                      {currentLanguage === 'th' ? 'เช็คลิสต์สัญญา' : 'Contracts'}
                    </h4>
                  </div>

                  {/* Right Bottom Card */}
                  <div className="row-span-1 relative bg-gradient-to-tr from-[#2C2A29] to-[#383634] flex flex-col justify-end p-2.5 text-white rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" />
                    <h4 className="relative z-10 font-serif text-[8px] font-semibold leading-tight">
                      {currentLanguage === 'th' ? 'คดีความองค์กร' : 'Litigation'}
                    </h4>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom summaries metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Output Summary */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-3.5">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">
                {t('composer.summary.title')}
              </span>
              
              <div className="space-y-2 text-[10.5px] font-semibold text-[#1E1D1B] dark:text-[#EBE7E0]">
                {[
                  { label: t('composer.mode.label'), val: getLabel(imageMode, imageModes.find(m => m.en === imageMode)?.th || imageMode) },
                  { label: t('composer.count.label'), val: imageCount },
                  { label: t('composer.layout.label'), val: getLabel(presetLayout, presetLayouts.find(l => l.en === presetLayout)?.th || presetLayout) },
                  { label: t('composer.ratio.label'), val: getLabel(aspectRatio, aspectRatios.find(r => r.en === aspectRatio)?.th || aspectRatio) },
                  { label: t('composer.lang.label'), val: getLabel(language, languages.find(l => l.en === language)?.th || language) },
                  { label: t('composer.density.label'), val: getLabel(density, densities.find(d => d.en === density)?.th || density) },
                  { label: t('composer.preset.label'), val: getLabel(visualPreset, 'Quiet Luxury - สไตล์นิตยสาร') }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5">
                    <span className="text-[#7C756C]">{item.label}</span>
                    <span className="font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Rules & Tips */}
            <div className="space-y-4">
              
              {/* Media Rules */}
              <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-2.5">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">
                  {t('composer.rules.title')}
                </span>
                <div className="space-y-2 text-xs">
                  {[
                    currentLanguage === 'th' ? 'อนุญาตให้ใช้ข้อความสองภาษา (ไทย/อังกฤษ)' : 'Bilingual text allowed',
                    currentLanguage === 'th' ? 'รองรับแฮชแท็กในคำบรรยายภาพ' : 'Hashtag support in caption',
                    currentLanguage === 'th' ? 'ใช้เฉพาะเทมเพลตที่ได้รับการอนุมัติ' : 'Approved templates only'
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-0.5">
                      <div className="w-3.5 h-3.5 rounded bg-[#EBE6DF] text-[#1E1D1B] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-bold text-[10.5px] text-[#1E1D1B] dark:text-[#EBE7E0]">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">
                  {t('composer.tips.title')}
                </span>
                <p className="text-[10px] text-[#7C756C] leading-normal font-medium">
                  {t('composer.tips.desc')}
                </p>
                <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer block pt-1">
                  {t('composer.tips.link')}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
