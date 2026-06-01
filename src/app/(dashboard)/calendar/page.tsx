'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Plus,
  CheckCircle2,
  Check,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Custom inline SVG icons matching feather paths
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function CalendarPage() {
  const [outputMode, setOutputMode] = useState('Main post + comment');

  const days = [
    { name: 'MON', date: '19' },
    { name: 'TUE', date: '20' },
    { name: 'WED', date: '21' },
    { name: 'THU', date: '22' },
    { name: 'FRI', date: '23' },
    { name: 'SAT', date: '24' },
    { name: 'SUN', date: '25' }
  ];

  const timeSlots = ['ALL-DAY', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'];

  // Static event positions for weekly grid representation
  const events = [
    { 
      dayIdx: 0, 
      slotIdx: 2, 
      title: 'Q2 Tax Advisory Series', 
      platform: 'Instagram', 
      lang: 'TH/EN', 
      time: '10:00 AM', 
      format: '1:1',
      color: 'bg-rose-50 border-rose-200 text-rose-800'
    },
    { 
      dayIdx: 1, 
      slotIdx: 4, 
      title: 'Labor Law Updates', 
      platform: 'LinkedIn', 
      lang: 'TH/EN', 
      time: '2:00 PM', 
      format: '4-tile',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    { 
      dayIdx: 2, 
      slotIdx: 2, 
      title: 'Corporate Compliance Hub', 
      platform: 'LinkedIn', 
      lang: 'TH/EN', 
      time: '10:00 AM', 
      format: '1:1',
      color: 'bg-[#FAF8F5] border-[#E6DFD5] text-[#1E1D1B]'
    },
    { 
      dayIdx: 4, 
      slotIdx: 2, 
      title: 'PDPA Compliance Checklist', 
      platform: 'Instagram', 
      lang: 'TH/EN', 
      time: '10:00 AM', 
      format: '1:1',
      color: 'bg-rose-50 border-rose-200 text-rose-800'
    },
    { 
      dayIdx: 6, 
      slotIdx: 6, 
      title: 'Export Myth-Buster', 
      platform: 'YouTube', 
      lang: 'TH/EN', 
      time: '6:00 PM', 
      format: '16:9',
      color: 'bg-red-50 border-red-205 text-red-850'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      
      {/* Title Header */}
      <div className="space-y-1 text-left pb-3 border-b border-[#E6DFD5] dark:border-slate-800">
        <h2 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
          Calendar & Publishing
        </h2>
        <p className="text-xs text-[#7C756C] dark:text-slate-400">
          Schedule bilingual content, captions, comments, and visual assets across channels.
        </p>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 p-3 rounded-xl text-xs shadow-[0_2px_6px_rgba(30,29,27,0.01)] text-left items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">Posting Date</span>
          <div className="h-8 border border-[#E6DFD5] dark:border-slate-700 rounded px-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-[11px] font-semibold">
            <span>May 19 - May 25, 2025</span>
            <CalendarIcon className="w-3.5 h-3.5 text-[#7C756C]" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">Posting Time</span>
          <div className="h-8 border border-[#E6DFD5] dark:border-slate-700 rounded px-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-[11px] font-semibold">
            <span>10:00 AM</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">Timezone</span>
          <div className="h-8 border border-[#E6DFD5] dark:border-slate-700 rounded px-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-[11px] font-semibold">
            <span>(GMT+07:00) Bangkok</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">Platform</span>
          <div className="h-8 border border-[#E6DFD5] dark:border-slate-700 rounded px-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-[11px] font-semibold">
            <span>Instagram</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">Publish Mode</span>
          <div className="h-8 border border-[#E6DFD5] dark:border-slate-700 rounded px-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 text-[11px] font-semibold">
            <span>Scheduled</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C756C]" />
          </div>
        </div>

        <div className="flex items-center justify-end h-8">
          <Button variant="outline" className="h-8 text-[10px] font-bold border-[#E6DFD5] px-4 w-full md:w-auto">
            Other / custom
          </Button>
        </div>
      </div>

      {/* Main Content Layout (2/3 and 1/3 layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Calendar Grid Container */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-[0_2px_8px_rgba(30,29,27,0.02)] overflow-hidden">
            
            {/* Calendar Controls */}
            <div className="p-4 border-b border-[#E6DFD5] dark:border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E6DFD5] dark:border-slate-700 rounded overflow-hidden">
                  <button className="p-1.5 hover:bg-slate-50 border-r border-[#E6DFD5]"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button className="px-3 py-1 font-bold text-[10px] uppercase bg-slate-50">Today</button>
                  <button className="p-1.5 hover:bg-slate-50 border-l border-[#E6DFD5]"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                <span className="font-serif font-bold text-[#1E1D1B] dark:text-[#EBE7E0]">May 19 – 25, 2025</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex border border-[#E6DFD5] dark:border-slate-700 rounded overflow-hidden font-bold text-[9px] uppercase tracking-wider">
                  <button className="px-3 py-1.5 bg-[#FAF8F5] text-[#1E1D1B] border-r border-[#E6DFD5]">Week</button>
                  <button className="px-3 py-1.5 text-[#7C756C] hover:bg-slate-50">Month</button>
                </div>
                <button className="p-1.5 border border-[#E6DFD5] rounded hover:bg-slate-50"><Settings className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Weekly Calendar Slots Grid */}
            <div className="grid grid-cols-[80px_1fr] border-b border-[#E6DFD5] dark:border-slate-800">
              <div className="bg-[#FAF8F5] dark:bg-slate-900 border-r border-[#E6DFD5] dark:border-slate-800 p-2 font-bold text-[9px] uppercase text-[#7C756C] text-center">
                TIME
              </div>
              <div className="grid grid-cols-7 divide-x divide-[#E6DFD5] dark:divide-slate-800">
                {days.map((d, i) => (
                  <div key={i} className="p-2 text-center text-[10px]">
                    <span className="block font-bold text-[#7C756C]">{d.name}</span>
                    <span className="block font-serif font-medium text-[#1E1D1B] dark:text-[#EBE7E0] text-sm mt-0.5">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Slots Rows */}
            <div className="divide-y divide-[#E6DFD5] dark:divide-slate-800">
              {timeSlots.map((time, slotIdx) => (
                <div key={slotIdx} className="grid grid-cols-[80px_1fr]">
                  <div className="p-2 font-bold text-[9px] text-[#7C756C] border-r border-[#E6DFD5] dark:border-slate-800 text-center flex items-center justify-center bg-[#FAF8F5]/50 dark:bg-slate-900/50">
                    {time}
                  </div>
                  <div className="grid grid-cols-7 divide-x divide-[#E6DFD5] dark:divide-slate-800 min-h-[48px] relative bg-white dark:bg-slate-900">
                    {days.map((_, dayIdx) => {
                      const event = events.find(e => e.dayIdx === dayIdx && e.slotIdx === slotIdx);
                      return (
                        <div key={dayIdx} className="p-1 flex items-stretch justify-stretch min-h-[48px] relative">
                          {event && (
                            <div className={cn("w-full p-2 border rounded-lg text-[9px] font-semibold flex flex-col justify-between leading-snug cursor-pointer hover:shadow-sm transition-all", event.color)}>
                              <p className="font-bold line-clamp-1">{event.title}</p>
                              <div className="flex justify-between items-center text-[8px] opacity-80 mt-1 font-bold">
                                <span>{event.time}</span>
                                <span>{event.format}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Settings Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Output Mode Card */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Output Mode</span>
              <div className="space-y-2.5 text-xs font-semibold">
                {[
                  'Main post only',
                  'Main post + comment',
                  'Bilingual caption',
                  'Separate versions'
                ].map((mode) => (
                  <label key={mode} className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="output_mode" 
                      checked={outputMode === mode}
                      onChange={() => setOutputMode(mode)}
                      className="w-3.5 h-3.5 border-[#E6DFD5] text-[#967F5C]"
                    />
                    <span className={cn(outputMode === mode ? "text-[#1E1D1B] dark:text-[#EBE7E0]" : "text-[#7C756C]")}>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Caption & Comment Preview */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-4 md:col-span-2">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Caption & Comment Preview</span>
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-[#7C756C] uppercase">
                    <span>Primary Caption (TH)</span>
                    <span>48 / 2200</span>
                  </div>
                  <p className="p-2 border border-[#E6DFD5] dark:border-slate-700 bg-[#FAF8F5] dark:bg-slate-900 rounded-lg text-[#1E1D1B] dark:text-[#EBE7E0] font-medium leading-relaxed">
                    กฎหมายแรงงานใหม่มีอะไรที่ควรรู้ในปี 2025
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-[#7C756C] uppercase">
                    <span>Secondary Comment (EN)</span>
                    <span>72 / 2200</span>
                  </div>
                  <p className="p-2 border border-[#E6DFD5] dark:border-slate-700 bg-[#FAF8F5] dark:bg-slate-900 rounded-lg text-[#1E1D1B] dark:text-[#EBE7E0] font-medium leading-relaxed">
                    Key changes in Thailand&apos;s new labor law to know in 2025. 💡
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Assets preview card */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left space-y-4">
            <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Assets</span>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-24 h-24 bg-[#FAF8F5] border border-[#E6DFD5] dark:border-slate-700 rounded-lg flex items-center justify-center shrink-0 p-2 text-center text-[10px] font-bold text-[#7C756C]">
                Image Asset Preview
              </div>
              <div className="space-y-3 flex-1 min-w-0">
                <div>
                  <p className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0]">Instagram Feed (1:1)</p>
                  <p className="text-[10px] text-[#7C756C] mt-0.5">1080 x 1080 px • 153 KB</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-7 text-[9px] font-bold border-[#E6DFD5] px-2.5 rounded">Change Asset</Button>
                  <Button variant="outline" className="h-7 text-[9px] font-bold border-[#E6DFD5] px-2.5 rounded">+ Add Variation</Button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns (1/3) */}
        <div className="space-y-6 text-left">
          
          {/* Publish Queue */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">Publish Queue</span>
              <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer">View all →</span>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { title: 'Service Business Q&A', time: 'May 26, 2025 • 10:00 AM', label: '1:1 format', color: 'bg-rose-50 border-rose-200 text-rose-800' },
                { title: 'Client Interview: Legal Strategy', time: 'May 27, 2025 • 2:00 PM', label: '4-tile format', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                { title: 'Tax Insight: Q2 Planning', time: 'May 28, 2025 • 10:00 AM', label: '1:1 format', color: 'bg-[#FAF8F5] border-[#E6DFD5] text-[#1E1D1B]' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-[#E6DFD5]/40 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded bg-[#FAF8F5] border border-[#E6DFD5] dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center shrink-0 font-bold text-[9px] text-[#7C756C]">
                    IMG
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0] truncate">{item.title}</p>
                    <p className="text-[9px] text-[#7C756C] dark:text-slate-500 font-bold mt-0.5">{item.time}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] bg-slate-50 border border-[#E6DFD5] px-1 rounded font-bold text-[#7C756C] uppercase">TH/EN</span>
                      <span className="text-[8px] bg-slate-50 border border-[#E6DFD5] px-1 rounded font-bold text-[#7C756C] uppercase">{item.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Readiness */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">Channel Readiness</span>
              <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer">View all →</span>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { name: 'Instagram', pct: 92 },
                { name: 'LinkedIn', pct: 88 },
                { name: 'YouTube', pct: 76 }
              ].map((chan, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0]">
                    <span>{chan.name}</span>
                    <span>{chan.pct}%</span>
                  </div>
                  <div className="w-full bg-[#F3EFEA] dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#1E1D1B] dark:bg-[#EBE7E0] h-full" style={{ width: `${chan.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#7C756C] pt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>All channels healthy</span>
            </div>
          </div>

          {/* Final Checklist */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Final Checklist</span>
            
            <div className="space-y-3 pt-1 text-xs">
              {[
                { label: 'Date confirmed', sub: 'May 23, 2025' },
                { label: 'Account selected', sub: 'Instagram' },
                { label: 'Hashtags checked', sub: '12 verified' },
                { label: 'Asset attached', sub: '1 image' },
                { label: 'Approval complete', sub: 'Legal Team' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 py-1 justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[#1E1D1B] dark:text-[#EBE7E0] font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-[#7C756C] font-bold">{item.sub}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
              <Button 
                onClick={() => toast.success('Scheduled successfully')}
                className="w-full bg-[#1E1D1B] hover:bg-[#2D2A26] dark:bg-[#EBE7E0] dark:hover:bg-white text-white dark:text-[#1E1D1B] font-bold text-xs h-10 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Ready to publish
              </Button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
