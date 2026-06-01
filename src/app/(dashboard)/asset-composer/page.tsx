'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Info,
  Sparkles,
  Trash2
} from 'lucide-react';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
    </svg>
  );
}
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Unsplash premium neutral warm-toned photography URLs matching the mockup
const MOCK_IMAGES = {
  cover: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  support1: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80',
  support2: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
  support3: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80',
  support4: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80'
};

const LAYOUT_PRESETS = [
  {
    id: 'vertical_1_2',
    name: 'Vertical 1+2',
    fullName: 'Vertical 1+2 • One Large + Two Small',
    desc: '3 images • cover 2:3 • support images 1:1 • max 3 images',
    summaryLayout: 'Vertical 1+2 (One Large + Two Small)',
    summaryCount: '3 images (1 cover + 2 support)',
    summaryRatios: 'Cover 2:3 • Support 1:1'
  },
  {
    id: 'vertical_1_3',
    name: 'Vertical 1+3',
    fullName: 'Vertical 1+3 • One Large + Three Small',
    desc: '4 images • cover 2:3 • support images 1:1 • max 4 images',
    summaryLayout: 'Vertical 1+3 (One Large + Three Small)',
    summaryCount: '4 images (1 cover + 3 support)',
    summaryRatios: 'Cover 2:3 • Support 1:1'
  },
  {
    id: 'vertical_2_3',
    name: 'Vertical 2+3',
    fullName: 'Vertical 2+3 • Two Large + Three Small',
    desc: '5 images • cover 1:1 • support images 1:1 • max 5 images',
    summaryLayout: 'Vertical 2+3 (Two Large + Three Small)',
    summaryCount: '5 images (2 cover + 3 support)',
    summaryRatios: 'Cover 1:1 • Support 1:1'
  },
  {
    id: 'horizontal_1_2',
    name: 'Horizontal 1+2',
    fullName: 'Horizontal 1+2 • One Large + Two Small',
    desc: '3 images • cover 3:2 • support images 1:1 • max 3 images',
    summaryLayout: 'Horizontal 1+2 (One Large + Two Small)',
    summaryCount: '3 images (1 cover + 2 support)',
    summaryRatios: 'Cover 3:2 • Support 1:1'
  },
  {
    id: 'horizontal_1_3',
    name: 'Horizontal 1+3',
    fullName: 'Horizontal 1+3 • One Large + Three Small',
    desc: '4 images • cover 3:2 • support images 1:1 • max 4 images',
    summaryLayout: 'Horizontal 1+3 (One Large + Three Small)',
    summaryCount: '4 images (1 cover + 3 support)',
    summaryRatios: 'Cover 3:2 • Support 1:1'
  },
  {
    id: 'horizontal_2_3',
    name: 'Horizontal 2+3',
    fullName: 'Horizontal 2+3 • Two Large + Three Small',
    desc: '5 images • cover 1:1 • support images 1:1 • max 5 images',
    summaryLayout: 'Horizontal 2+3 (Two Large + Three Small)',
    summaryCount: '5 images (2 cover + 3 support)',
    summaryRatios: 'Cover 1:1 • Support 1:1'
  },
  {
    id: 'square_4',
    name: 'Square 4',
    fullName: 'Square 4 • Four Equal Tiles',
    desc: '4 images • tiles 1:1 • max 4 images',
    summaryLayout: 'Square 4 (Four Equal Tiles)',
    summaryCount: '4 images (4 tiles)',
    summaryRatios: 'Tiles 1:1'
  }
];

export default function AssetComposerPage() {
  const [manualSettings, setManualSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'manual'>('quick');
  const [topic, setTopic] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(LAYOUT_PRESETS[1]); // Default to Vertical 1+3

  // Interactive Rules lists
  const [imageRules, setImageRules] = useState<string[]>([
    'Quiet luxury editorial',
    'Bilingual text in image allowed',
    'Low text density',
    'Approved template set',
    'Facebook layout rules on'
  ]);
  
  const [contentRules, setContentRules] = useState<string[]>([
    'TH primary, EN secondary',
    'Hashtags enabled',
    'Brand voice preset: Professional',
    'Approved sources only',
    'Compliance & legal review on'
  ]);

  const [newImageRule, setNewImageRule] = useState('');
  const [newContentRule, setNewContentRule] = useState('');

  const addImageRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageRule.trim()) {
      setImageRules([...imageRules, newImageRule.trim()]);
      setNewImageRule('');
      toast.success('Added new image guideline rule.');
    }
  };

  const addContentRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContentRule.trim()) {
      setContentRules([...contentRules, newContentRule.trim()]);
      setNewContentRule('');
      toast.success('Added new content guideline rule.');
    }
  };

  const removeImageRule = (index: number) => {
    setImageRules(imageRules.filter((_, i) => i !== index));
  };

  const removeContentRule = (index: number) => {
    setContentRules(contentRules.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    toast.success('AI Asset Composer launched! Compiling image parameters & layouts.');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF9F6] text-slate-800 p-6 sm:p-8 flex flex-col space-y-6 select-none font-sans min-h-screen">
      
      {/* Top Workspace Header Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold tracking-tight">
          <span>Workspace</span>
          <span>/</span>
          <span>Content Operations</span>
          <span>/</span>
          <span className="text-slate-800 font-bold">Asset Composer</span>
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

      {/* Main Container */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start max-w-7xl mx-auto w-full">
        
        {/* Left 2 Columns: Composer controls */}
        <div className="xl:col-span-2 space-y-6 text-left">
          
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 uppercase">
                Asset Composer
              </h1>
              <p className="text-xs text-slate-450 font-medium">
                One-click visual generation using your saved brand rules and Facebook layout presets.
              </p>
            </div>
            
            {/* Manual settings switch */}
            <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-xl border border-slate-200/50 shrink-0 self-start sm:self-center">
              <span className="text-[10px] font-bold text-slate-550">Manual settings</span>
              <button 
                onClick={() => setManualSettings(!manualSettings)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  manualSettings ? "bg-indigo-600" : "bg-slate-200"
                )}
              >
                <span className="sr-only">Toggle manual settings</span>
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    manualSettings ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
              <span className="text-[10px] font-black uppercase text-slate-400">{manualSettings ? 'On' : 'Off'}</span>
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
          </div>

          {/* Quick Mode / Manual Tabs */}
          <div className="flex gap-6 border-b border-slate-200/70 text-xs">
            <button 
              onClick={() => setActiveTab('quick')}
              className={cn(
                "pb-3 font-black tracking-wider uppercase transition-all duration-200 border-b-2 px-1",
                activeTab === 'quick' ? "border-amber-600 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              Quick Mode
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={cn(
                "pb-3 font-black tracking-wider uppercase transition-all duration-200 border-b-2 px-1",
                activeTab === 'manual' ? "border-amber-600 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              Manual
            </button>
          </div>

          {/* Input campaign card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-black uppercase tracking-wider text-slate-450">Campaign / Visual Topic</Label>
              <span className="text-[9px] text-slate-400 font-bold">{topic.length}/150</span>
            </div>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 150))}
              placeholder="Enter campaign name, product, message or visual topic..."
              className="w-full h-24 text-xs font-semibold text-slate-800 placeholder-slate-400 border-none outline-none resize-none p-0 focus:ring-0 bg-transparent"
            />
          </div>

          {/* Saved Rules side-by-side grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SAVED IMAGE RULES */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Saved Image Rules</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Active</span>
              </div>
              
              <div className="space-y-2">
                {imageRules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between text-xs font-semibold text-slate-650 group/item">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-slate-700" />
                      </div>
                      <span>{rule}</span>
                    </div>
                    <button 
                      onClick={() => removeImageRule(index)}
                      className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-0.5 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Image Rule Form */}
              <form onSubmit={addImageRule} className="flex gap-2 pt-2 border-t border-slate-50">
                <input 
                  type="text" 
                  value={newImageRule}
                  onChange={(e) => setNewImageRule(e.target.value)}
                  placeholder="Add custom image rule..."
                  className="flex-1 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-1.5 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 rounded-xl shrink-0 bg-slate-150/40 hover:bg-slate-150">
                  <Plus className="w-4 h-4 text-slate-600" />
                </Button>
              </form>
            </div>

            {/* SAVED CONTENT RULES */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Saved Content Rules</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Active</span>
              </div>
              
              <div className="space-y-2">
                {contentRules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between text-xs font-semibold text-slate-655 group/item">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-slate-700" />
                      </div>
                      <span>{rule}</span>
                    </div>
                    <button 
                      onClick={() => removeContentRule(index)}
                      className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-0.5 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Content Rule Form */}
              <form onSubmit={addContentRule} className="flex gap-2 pt-2 border-t border-slate-50">
                <input 
                  type="text" 
                  value={newContentRule}
                  onChange={(e) => setNewContentRule(e.target.value)}
                  placeholder="Add custom content rule..."
                  className="flex-1 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 py-1.5 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 rounded-xl shrink-0 bg-slate-150/40 hover:bg-slate-150">
                  <Plus className="w-4 h-4 text-slate-600" />
                </Button>
              </form>
            </div>

          </div>

          {/* Facebook Layout Presets Header */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-450">Facebook Layout Presets</h3>
            
            {/* The schematic preset cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {LAYOUT_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={cn(
                      "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-3 h-28 relative group/btn",
                      isSelected 
                        ? "bg-white border-amber-600 shadow-md" 
                        : "bg-white border-slate-200/70 hover:border-slate-350"
                    )}
                  >
                    {/* Checkmark overlay for active layout */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-amber-600 text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}

                    {/* Miniature layout schematic grids */}
                    <div className="w-full flex-1 flex items-center justify-center px-2">
                      <div className="w-12 h-10 border border-slate-200 rounded p-0.5 bg-slate-50 flex gap-0.5 overflow-hidden">
                        
                        {preset.id === 'vertical_1_2' && (
                          <>
                            <div className="w-7 h-full bg-slate-300 rounded-sm" />
                            <div className="flex-1 flex flex-col gap-0.5">
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                            </div>
                          </>
                        )}

                        {preset.id === 'vertical_1_3' && (
                          <>
                            <div className="w-7 h-full bg-slate-300 rounded-sm" />
                            <div className="flex-1 flex flex-col gap-0.5">
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                            </div>
                          </>
                        )}

                        {preset.id === 'vertical_2_3' && (
                          <>
                            <div className="w-5 h-full flex flex-col gap-0.5">
                              <div className="flex-1 bg-slate-300 rounded-sm" />
                              <div className="flex-1 bg-slate-300 rounded-sm" />
                            </div>
                            <div className="flex-1 flex flex-col gap-0.5">
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                            </div>
                          </>
                        )}

                        {preset.id === 'horizontal_1_2' && (
                          <div className="w-full h-full flex flex-col gap-0.5">
                            <div className="h-5 bg-slate-300 rounded-sm w-full" />
                            <div className="flex-1 flex gap-0.5 w-full">
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                            </div>
                          </div>
                        )}

                        {preset.id === 'horizontal_1_3' && (
                          <div className="w-full h-full flex flex-col gap-0.5">
                            <div className="h-5 bg-slate-300 rounded-sm w-full" />
                            <div className="flex-1 flex gap-0.5 w-full">
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                            </div>
                          </div>
                        )}

                        {preset.id === 'horizontal_2_3' && (
                          <div className="w-full h-full flex flex-col gap-0.5">
                            <div className="h-4.5 flex gap-0.5 w-full">
                              <div className="flex-1 bg-slate-300 rounded-sm" />
                              <div className="flex-1 bg-slate-300 rounded-sm" />
                            </div>
                            <div className="flex-1 flex gap-0.5 w-full">
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                              <div className="flex-1 bg-slate-250 rounded-sm" />
                            </div>
                          </div>
                        )}

                        {preset.id === 'square_4' && (
                          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
                            <div className="bg-slate-300 rounded-sm" />
                            <div className="bg-slate-250 rounded-sm" />
                            <div className="bg-slate-250 rounded-sm" />
                            <div className="bg-slate-250 rounded-sm" />
                          </div>
                        )}

                      </div>
                    </div>
                    
                    <span className="text-[9px] font-bold text-slate-655 tracking-tight group-hover/btn:text-slate-900 transition-colors">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Layout details display panel */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">{selectedPreset.fullName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{selectedPreset.desc}</p>
              </div>
              <FacebookIcon className="w-4 h-4 text-blue-600 shrink-0" />
            </div>

          </div>

          {/* Action trigger footer */}
          <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button 
              onClick={handleGenerate}
              className="bg-[#0B1E33] hover:bg-[#071322] text-white font-black text-xs h-11 px-8 rounded-xl flex items-center gap-2 w-full sm:w-auto shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              GENERATE VISUAL
            </Button>
            <span className="text-xs font-bold text-slate-400 hover:text-indigo-650 cursor-pointer hover:underline">
              Open Manual
            </span>
          </div>

        </div>

        {/* Right 1 Column: Preview & summary panels */}
        <div className="space-y-6 text-left">
          
          {/* Layout Preview Pane */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] flex flex-col space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Layout Preview</span>
                <Info className="w-3.5 h-3.5 text-slate-350 cursor-pointer hover:text-slate-500" />
              </div>
            </div>

            {/* Dynamic visual preview representing the layout grids */}
            <div className="w-full aspect-[4/5] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden relative p-1.5">
              
              {/* Vertical 1+2 Layout */}
              {selectedPreset.id === 'vertical_1_2' && (
                <div className="grid grid-cols-2 gap-1.5 h-full w-full">
                  <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                    <div className="absolute inset-0 bg-black/30" />
                    {/* Left overlay typography */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
                      <h3 className="font-heading font-black text-sm tracking-tight leading-tight">Compliance by Design.</h3>
                      <p className="text-[9px] font-medium leading-relaxed opacity-90">มาตรฐานที่คุณวางใจ เพื่อการเติบโตที่ยั่งยืน</p>
                    </div>
                  </div>
                  <div className="grid grid-rows-2 gap-1.5">
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                  </div>
                </div>
              )}

              {/* Vertical 1+3 Layout (mockup target) */}
              {selectedPreset.id === 'vertical_1_3' && (
                <div className="grid grid-cols-2 gap-1.5 h-full w-full">
                  <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-4 left-4 text-white z-10 space-y-1">
                      <h3 className="font-heading font-black text-sm tracking-tight leading-tight">Compliance by Design.</h3>
                      <p className="text-[9px] font-medium leading-relaxed opacity-90">มาตรฐานที่คุณวางใจ เพื่อการเติบโตที่ยั่งยืน</p>
                    </div>
                  </div>
                  <div className="grid grid-rows-3 gap-1.5">
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support3})` }} />
                  </div>
                </div>
              )}

              {/* Vertical 2+3 Layout */}
              {selectedPreset.id === 'vertical_2_3' && (
                <div className="grid grid-cols-2 gap-1.5 h-full w-full">
                  <div className="grid grid-rows-2 gap-1.5">
                    <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="absolute bottom-2.5 left-2.5 text-white z-10">
                        <h3 className="font-heading font-bold text-[10px] tracking-tight leading-tight">Compliance by Design.</h3>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                  </div>
                  <div className="grid grid-rows-3 gap-1.5">
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support3})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support4})` }} />
                  </div>
                </div>
              )}

              {/* Horizontal 1+2 Layout */}
              {selectedPreset.id === 'horizontal_1_2' && (
                <div className="grid grid-rows-2 gap-1.5 h-full w-full">
                  <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-4 left-4 text-white z-10 space-y-1">
                      <h3 className="font-heading font-black text-sm tracking-tight leading-tight">Compliance by Design.</h3>
                      <p className="text-[9px] font-medium leading-relaxed opacity-90">มาตรฐานที่คุณวางใจ เพื่อการเติบโตที่ยั่งยืน</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                  </div>
                </div>
              )}

              {/* Horizontal 1+3 Layout */}
              {selectedPreset.id === 'horizontal_1_3' && (
                <div className="grid grid-rows-2 gap-1.5 h-full w-full">
                  <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-4 left-4 text-white z-10 space-y-1">
                      <h3 className="font-heading font-black text-sm tracking-tight leading-tight">Compliance by Design.</h3>
                      <p className="text-[9px] font-medium leading-relaxed opacity-90">มาตรฐานที่คุณวางใจ เพื่อการเติบโตที่ยั่งยืน</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support3})` }} />
                  </div>
                </div>
              )}

              {/* Horizontal 2+3 Layout */}
              {selectedPreset.id === 'horizontal_2_3' && (
                <div className="grid grid-rows-2 gap-1.5 h-full w-full">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="absolute bottom-2.5 left-2.5 text-white z-10">
                        <h3 className="font-heading font-bold text-[10px] tracking-tight leading-tight">Compliance by Design.</h3>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support3})` }} />
                    <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support4})` }} />
                  </div>
                </div>
              )}

              {/* Square 4 Layout */}
              {selectedPreset.id === 'square_4' && (
                <div className="grid grid-cols-2 grid-rows-2 gap-1.5 h-full w-full">
                  <div className="relative rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.cover})` }}>
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="absolute bottom-3 left-3 text-white z-10">
                      <h3 className="font-heading font-bold text-xs tracking-tight leading-tight">Compliance.</h3>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support1})` }} />
                  <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support2})` }} />
                  <div className="rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${MOCK_IMAGES.support3})` }} />
                </div>
              )}

            </div>
          </div>

          {/* Output Summary metadata card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] space-y-4">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
              Output Summary
            </span>
            
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400">Layout</span>
                <span className="font-bold text-slate-800">{selectedPreset.summaryLayout}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400">Image Count</span>
                <span className="font-bold text-slate-800">{selectedPreset.summaryCount}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400">Text Language</span>
                <span className="font-bold text-slate-800">TH primary, EN secondary</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400">Aspect Ratios</span>
                <span className="font-bold text-slate-800">{selectedPreset.summaryRatios}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400">Platform</span>
                <span className="font-bold text-slate-800">Facebook (New Pages Experience)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed text-center">
              Visuals will be generated according to your saved rules and layout preset.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Label Component placeholder since it was used from original page structure imports.
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-xs font-medium text-slate-700", className)}>
      {children}
    </label>
  );
}
