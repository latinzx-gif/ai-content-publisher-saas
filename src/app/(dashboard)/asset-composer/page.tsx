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

export default function AssetComposerPage() {
  const [assetGoal, setAssetGoal] = useState('Promote a service or solution');
  const [imageMode, setImageMode] = useState('Collage');
  const [imageCount, setImageCount] = useState(4);
  const [presetLayout, setPresetLayout] = useState('One Large + Three Small');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [language, setLanguage] = useState('Bilingual');
  const [density, setDensity] = useState('Medium');
  const [visualPreset, setVisualPreset] = useState('Quiet Luxury - Editorial');

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="space-y-1 text-left pb-3 border-b border-[#E6DFD5] dark:border-slate-800">
        <h2 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
          Asset Composer
        </h2>
        <p className="text-xs text-[#7C756C] dark:text-slate-400">
          Configure visual output, image count, collage layout, and bilingual text placement.
        </p>
      </div>

      {/* Main Container (Two-column layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Parameter Selector Form */}
        <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left">
          
          {/* Goal Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">1. Asset Goal</label>
              <div className="h-9.5 border border-[#E6DFD5] dark:border-slate-700 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-xs font-semibold">
                <span>{assetGoal}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">Other / Custom Goal</label>
              <input 
                type="text" 
                placeholder="Enter custom goal..."
                className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] h-9.5 outline-none font-medium"
              />
            </div>
          </div>

          {/* Image Mode */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">2. Image Mode</label>
            <div className="flex flex-wrap gap-2">
              {['Single Image', 'Carousel', 'Collage', 'Template Reuse', '+ Other'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setImageMode(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer",
                    imageMode === mode 
                      ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                      : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Image Count */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">3. Image Count</label>
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
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">4. Layout Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { name: 'Single Poster', icon: ImageIcon },
                { name: 'Split Two-Up', icon: Columns },
                { name: 'Four-Tile Grid', icon: Grid },
                { name: 'One Large + Three Small', icon: Layout },
                { name: 'Magazine Mosaic', icon: Layout }
              ].map((lay) => (
                <button
                  key={lay.name}
                  type="button"
                  onClick={() => setPresetLayout(lay.name)}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-2",
                    presetLayout === lay.name 
                      ? "bg-[#FAF8F5] border-[#967F5C] text-[#1E1D1B] font-bold" 
                      : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]/50"
                  )}
                >
                  <lay.icon className="w-4 h-4 text-[#967F5C]" />
                  <span className="text-[9px] font-bold leading-tight">{lay.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Text Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">5. Aspect Ratio</label>
              <div className="flex gap-2">
                {['1:1', '4:5', '16:9', '+ Other'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center",
                      aspectRatio === ratio 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">6. Text Language in Image</label>
              <div className="flex gap-2">
                {['Thai', 'English', 'Bilingual', '+ Other'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center",
                      language === lang 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Text Density & Visual Style Preset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">7. Text Density</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((dens) => (
                  <button
                    key={dens}
                    type="button"
                    onClick={() => setDensity(dens)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex-1 text-center",
                      density === dens 
                        ? "bg-[#1E1D1B] border-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B]" 
                        : "bg-transparent border-[#E6DFD5] dark:border-slate-800 text-[#7C756C] hover:border-[#967F5C]"
                    )}
                  >
                    {dens}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">8. Visual Style Preset</label>
              <div className="h-9.5 border border-[#E6DFD5] dark:border-slate-700 rounded-lg px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-xs font-semibold">
                <span>{visualPreset}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
              </div>
            </div>
          </div>

          {/* Reference Assets */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#7C756C] uppercase tracking-wider">9. Reference Assets (optional)</label>
            <div className="border border-dashed border-[#E6DFD5] dark:border-slate-800 bg-[#FAF8F5]/30 dark:bg-slate-900 rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-center text-xs">
              <ImageIcon className="w-7 h-7 text-[#7C756C]" />
              <p className="font-semibold text-[#7C756C]">Drag & drop files here or click to upload</p>
              <Button variant="outline" className="h-7 text-[10px] font-bold border-[#E6DFD5] rounded mt-1">+ Add Asset</Button>
            </div>
          </div>

          {/* CTA Generate Button */}
          <div className="pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80 flex justify-end">
            <Button 
              onClick={() => toast.success('Visuals generated successfully!')}
              className="bg-[#1E1D1B] hover:bg-[#2D2A26] dark:bg-[#EBE7E0] dark:hover:bg-white text-white dark:text-[#1E1D1B] font-bold text-xs h-11 px-8 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
            >
              Generate Visuals <Plus className="w-4 h-4" />
            </Button>
          </div>

        </div>

        {/* Right Column: Preview Pane & Output Summaries */}
        <div className="space-y-6 flex flex-col h-full justify-between">
          
          {/* Collage Preview Card */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left flex-1 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E6DFD5] dark:border-slate-850">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E1D1B] dark:text-[#EBE7E0]">Preview — {presetLayout} Layout ({imageCount} Images)</span>
              <span className="text-[#7C756C] text-[10px] font-bold">4:5</span>
            </div>

            {/* Collage Layout Grid */}
            <div className="grid grid-cols-2 gap-2 aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F3EFEA] dark:bg-slate-800">
              
              {/* Left Column (Large Image) */}
              <div className="relative bg-gradient-to-tr from-[#2C2A29] to-[#4A4745] flex flex-col justify-end p-5 text-white">
                {/* Boardroom table representation overlay */}
                <div className="absolute inset-0 bg-[#2C2A29]/60 mix-blend-multiply" />
                <div className="relative z-10 space-y-3">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#C8B69B] block border-b border-[#C8B69B]/40 pb-1">Legal Advisory</span>
                  <h3 className="font-serif text-xl tracking-wide leading-tight">Clarity today. Confidence tomorrow.</h3>
                  <p className="text-[9px] text-[#E6DFD5]/90 font-medium">คำปรึกษาที่ชัดเจนในวันนี้ ความมั่นใจในวันข้างหน้า.</p>
                  <p className="text-[8px] text-[#C8B69B] font-semibold tracking-wider pt-2">Your trusted legal partner for every milestone.</p>
                </div>
              </div>

              {/* Right Column (Three Small Images) */}
              <div className="grid grid-rows-3 gap-2">
                
                {/* Small Image 1 */}
                <div className="relative bg-gradient-to-br from-[#5C5650] to-[#756E67] flex flex-col justify-end p-3 text-white">
                  <div className="absolute inset-0 bg-black/40" />
                  <p className="relative z-10 font-serif text-[10px] leading-tight">Strategic guidance for every stage.</p>
                </div>

                {/* Small Image 2 */}
                <div className="relative bg-gradient-to-tr from-[#383634] to-[#595653] flex flex-col justify-end p-3 text-white">
                  <div className="absolute inset-0 bg-black/45" />
                  <p className="relative z-10 font-serif text-[10px] leading-tight">Rooted in integrity. Focused on outcomes.</p>
                </div>

                {/* Small Image 3 */}
                <div className="relative bg-gradient-to-br from-[#4E4B49] to-[#696562] flex flex-col justify-end p-3 text-white">
                  <div className="absolute inset-0 bg-black/40" />
                  <p className="relative z-10 font-serif text-[10px] leading-tight">Solutions tailored to your business.</p>
                </div>

              </div>

            </div>
          </div>

          {/* Bottom summaries metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Output Summary */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-3.5">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Output Summary</span>
              
              <div className="space-y-2 text-[10.5px] font-semibold text-[#1E1D1B] dark:text-[#EBE7E0]">
                {[
                  { label: 'Image Mode', val: imageMode },
                  { label: 'Image Count', val: imageCount },
                  { label: 'Layout', val: presetLayout },
                  { label: 'Aspect Ratio', val: aspectRatio },
                  { label: 'Text Language', val: language },
                  { label: 'Text Density', val: density },
                  { label: 'Visual Style', val: visualPreset }
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
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Media Rules</span>
                <div className="space-y-2 text-xs">
                  {[
                    'Bilingual text allowed',
                    'Hashtag support in caption',
                    'Approved templates only'
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-0.5">
                      <div className="w-3.5 h-3.5 rounded bg-[#EBE6DF] text-[#1E1D1B] flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5" /></div>
                      <span className="font-bold text-[10.5px] text-[#1E1D1B] dark:text-[#EBE7E0]">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Tips</span>
                <p className="text-[10px] text-[#7C756C] leading-normal font-medium">
                  Use a clear visual hierarchy and minimal text for stronger performance.
                </p>
                <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer block pt-1">Learn more →</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
