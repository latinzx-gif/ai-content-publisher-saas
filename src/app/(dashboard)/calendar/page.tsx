'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Check,
  Link as LinkIcon,
  CheckCircle2,
  Info,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/components/providers/language-provider';

// Custom inline SVG icons matching feather paths for platforms
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

// High-fidelity photography placeholders matching the mockup design
const MOCK_IMAGES = {
  assetPreview: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
  queue1: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=150&q=80',
  queue2: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80',
  queue3: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=150&q=80'
};

export default function CalendarPage() {
  const { t, currentLanguage } = useLanguage();
  const [outputMode, setOutputMode] = useState('Main post + comment');

  const getLocalizedDay = (name: string) => {
    const map: Record<string, { th: string, en: string }> = {
      'MON': { th: 'จ.', en: 'MON' },
      'TUE': { th: 'อ.', en: 'TUE' },
      'WED': { th: 'พ.', en: 'WED' },
      'THU': { th: 'พฤ.', en: 'THU' },
      'FRI': { th: 'ศ.', en: 'FRI' },
      'SAT': { th: 'ส.', en: 'SAT' },
      'SUN': { th: 'อา.', en: 'SUN' }
    };
    return currentLanguage === 'th' ? map[name]?.th : map[name]?.en;
  };

  const getLocalizedSlot = (slot: string) => {
    if (slot === 'ALL-DAY') return currentLanguage === 'th' ? 'ทั้งวัน' : 'ALL-DAY';
    return slot;
  };

  const getEventTitle = (title: string) => {
    const map: Record<string, { th: string, en: string }> = {
      'Q2 Tax Advisory Series': { th: 'ซีรีส์การวางแผนภาษี Q2', en: 'Q2 Tax Advisory Series' },
      'Labor Law Updates': { th: 'อัปเดตกฎหมายแรงงาน 2025', en: 'Labor Law Updates' },
      'Corporate Compliance Hub': { th: 'ศูนย์ข้อกำหนดกฎหมายองค์กร', en: 'Corporate Compliance Hub' },
      'PDPA Compliance Checklist': { th: 'เช็คลิสต์ความถูกต้อง PDPA', en: 'PDPA Compliance Checklist' },
      'Export Myth-Buster': { th: 'ล้างความเชื่อผิดๆ เรื่องส่งออก', en: 'Export Myth-Buster' }
    };
    return currentLanguage === 'th' ? (map[title]?.th || title) : (map[title]?.en || title);
  };

  const getQueueTitle = (title: string) => {
    const map: Record<string, { th: string, en: string }> = {
      'Service Business Q&A': { th: 'ถามตอบธุรกิจบริการ', en: 'Service Business Q&A' },
      'Client Interview: Legal Strategy': { th: 'สัมภาษณ์ลูกค้า: กลยุทธ์กฎหมาย', en: 'Client Interview: Legal Strategy' },
      'Tax Insight: Q2 Planning': { th: 'เจาะลึกภาษี: แผนงาน Q2', en: 'Tax Insight: Q2 Planning' }
    };
    return currentLanguage === 'th' ? (map[title]?.th || title) : (map[title]?.en || title);
  };

  const getQueueLabel = (label: string) => {
    if (label === '1:1 format') return currentLanguage === 'th' ? 'ขนาด 1:1' : '1:1 format';
    if (label === '4-tile format') return currentLanguage === 'th' ? 'สไตล์ 4 ช่อง' : '4-tile format';
    return label;
  };

  const getQueueTime = (time: string) => {
    if (time.includes('May 26')) return currentLanguage === 'th' ? '26 พ.ค. 2025 • 10:00' : time;
    if (time.includes('May 27')) return currentLanguage === 'th' ? '27 พ.ค. 2025 • 14:00' : time;
    if (time.includes('May 28')) return currentLanguage === 'th' ? '28 พ.ค. 2025 • 10:00' : time;
    return time;
  };

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

  // Static event positions for weekly grid representation matching mockup layout
  const events = [
    { 
      dayIdx: 0, 
      slotIdx: 2, 
      title: 'Q2 Tax Advisory Series', 
      platform: 'Instagram', 
      lang: 'TH/EN', 
      time: '10:00 AM', 
      format: '1:1',
      color: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60 text-rose-800 dark:text-rose-200'
    },
    { 
      dayIdx: 1, 
      slotIdx: 4, 
      title: 'Labor Law Updates', 
      platform: 'LinkedIn', 
      lang: 'TH/EN', 
      time: '2:00 PM', 
      format: '4-tile',
      color: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60 text-blue-800 dark:text-blue-200'
    },
    { 
      dayIdx: 2, 
      slotIdx: 2, 
      title: 'Corporate Compliance Hub', 
      platform: 'LinkedIn', 
      lang: 'TH/EN', 
      time: '10:00 AM', 
      format: '1:1',
      color: 'bg-[#FAF8F5]/80 dark:bg-slate-900/80 border-[#E6DFD5]/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200'
    },
    { 
      dayIdx: 4, 
      slotIdx: 2, 
      title: 'PDPA Compliance Checklist', 
      platform: 'Instagram', 
      lang: 'TH/EN', 
      time: '10:00 AM', 
      format: '1:1',
      color: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60 text-rose-800 dark:text-rose-200'
    },
    { 
      dayIdx: 6, 
      slotIdx: 6, 
      title: 'Export Myth-Buster', 
      platform: 'YouTube', 
      lang: 'TH/EN', 
      time: '6:00 PM', 
      format: '16:9',
      color: 'bg-red-50/80 dark:bg-red-950/40 border-red-200/80 dark:border-red-900/60 text-red-800 dark:text-red-200'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF9F6] dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6 sm:p-8 flex flex-col space-y-6 select-none font-sans min-h-screen">
      

      {/* Title Section */}
      <div className="space-y-1 text-left">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
            {t('calendar.title')}
          </h1>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            {currentLanguage === 'th' ? 'ตัวอย่าง / ยังไม่เชื่อมต่อจริง' : 'Preview / Mock'}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {t('calendar.subtitle')}
        </p>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl text-xs shadow-[0_2px_12px_rgba(15,23,42,0.01)] text-left items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t('calendar.filters.date')}</span>
          <div className="h-9.5 border border-slate-200 dark:border-slate-700 rounded-xl px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
            <span>{currentLanguage === 'th' ? '19 พ.ค. - 25 พ.ค. 2025' : 'May 19 - May 25, 2025'}</span>
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t('calendar.filters.time')}</span>
          <div className="h-9.5 border border-slate-200 dark:border-slate-700 rounded-xl px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
            <span>10:00 AM</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t('calendar.filters.timezone')}</span>
          <div className="h-9.5 border border-slate-200 dark:border-slate-700 rounded-xl px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
            <span>{currentLanguage === 'th' ? '(GMT+07:00) กรุงเทพฯ' : '(GMT+07:00) Bangkok'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t('calendar.filters.platform')}</span>
          <div className="h-9.5 border border-slate-200 dark:border-slate-700 rounded-xl px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span>Instagram</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t('calendar.filters.mode')}</span>
          <div className="h-9.5 border border-slate-200 dark:border-slate-700 rounded-xl px-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
            <span>{currentLanguage === 'th' ? 'ตั้งกำหนดการแล้ว' : 'Scheduled'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center justify-end h-9.5">
          <Button variant="outline" className="h-9.5 text-[10px] font-black uppercase border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            {t('calendar.filters.custom')}
          </Button>
        </div>
      </div>

      {/* Main Content Layout (2/3 Calendar + 1/3 Queue & Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Calendar Grid Container */}
          <div className="border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_2px_12px_rgba(15,23,42,0.01)] overflow-hidden text-left">
            
            {/* Calendar Controls */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-r border-slate-150 dark:border-slate-700 text-slate-600 dark:text-slate-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button className="px-4 py-1.5 font-bold text-[10px] uppercase bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">{t('calendar.view.today')}</button>
                  <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-l border-slate-150 dark:border-slate-700 text-slate-600 dark:text-slate-400"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-205 font-sans text-sm">
                  {currentLanguage === 'th' ? '19 – 25 พ.ค. 2025' : 'May 19 – 25, 2025'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden font-bold text-[10px] uppercase tracking-wider bg-white dark:bg-slate-900">
                  <button className="px-4 py-2 bg-[#FAF8F5] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-r border-slate-150 dark:border-slate-700">{t('calendar.view.week')}</button>
                  <button className="px-4 py-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">{t('calendar.view.month')}</button>
                </div>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900"><Settings className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Weekly Days Header */}
            <div className="grid grid-cols-[70px_1fr] border-b border-slate-100 dark:border-slate-800/80">
              <div className="bg-[#FAF8F5]/80 dark:bg-slate-900/60 border-r border-slate-150 dark:border-slate-700 p-2.5 font-bold text-[9px] uppercase text-slate-450 dark:text-slate-500 text-center flex items-center justify-center">
                {t('calendar.view.time')}
              </div>
              <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-850">
                {days.map((d, i) => (
                  <div key={i} className="p-2.5 text-center text-[10px] space-y-0.5">
                    <span className="block font-bold text-slate-400 dark:text-slate-500">{getLocalizedDay(d.name)}</span>
                    <span className="block font-sans font-black text-slate-800 dark:text-slate-200 text-sm">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Time Slots Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {timeSlots.map((time, slotIdx) => (
                <div key={slotIdx} className="grid grid-cols-[70px_1fr]">
                  <div className="p-2 font-bold text-[9px] text-slate-400 dark:text-slate-500 border-r border-slate-150 dark:border-slate-700 text-center flex items-center justify-center bg-[#FAF8F5]/40 dark:bg-slate-900/20 font-mono">
                    {getLocalizedSlot(time)}
                  </div>
                  <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-850 min-h-[58px] relative bg-white dark:bg-slate-900">
                    {days.map((_, dayIdx) => {
                      const event = events.find(e => e.dayIdx === dayIdx && e.slotIdx === slotIdx);
                      return (
                        <div key={dayIdx} className="p-1 flex items-stretch justify-stretch min-h-[58px] relative">
                          {event && (
                            <div className={cn("w-full p-2 border rounded-xl text-[9px] font-semibold flex flex-col justify-between leading-snug cursor-pointer hover:shadow-md transition-all shadow-sm", event.color)}>
                              <div>
                                <p className="font-black line-clamp-2 leading-tight">{getEventTitle(event.title)}</p>
                                <div className="flex gap-1.5 items-center mt-1.5 opacity-90">
                                  {event.platform === 'Instagram' && <InstagramIcon className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                                  {event.platform === 'LinkedIn' && <LinkedinIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                                  {event.platform === 'YouTube' && <YoutubeIcon className="w-3 h-3 text-red-650 dark:text-red-400" />}
                                  <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500">TH EN</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-[8.5px] opacity-75 mt-1 font-bold">
                                <span>{event.time}</span>
                                <span className="bg-white/70 dark:bg-slate-900/70 px-1 border border-slate-150 dark:border-slate-800 rounded text-[7.5px]">{event.format}</span>
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

          {/* Bottom Settings Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Output Mode Radio Select */}
            <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] text-left space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">{t('calendar.filters.mode')}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="space-y-3 text-xs font-semibold">
                {[
                  { value: 'Main post only', labelTh: 'โพสต์หลักเท่านั้น', labelEn: 'Main post only' },
                  { value: 'Main post + comment', labelTh: 'โพสต์หลัก + คอมเมนต์', labelEn: 'Main post + comment' },
                  { value: 'Bilingual caption', labelTh: 'คำบรรยายสองภาษา', labelEn: 'Bilingual caption' },
                  { value: 'Separate versions', labelTh: 'แยกโพสต์สองเวอร์ชัน', labelEn: 'Separate versions' }
                ].map((mode) => (
                  <label key={mode.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="output_mode" 
                      checked={outputMode === mode.value}
                      onChange={() => setOutputMode(mode.value)}
                      className="w-4 h-4 border-slate-350 dark:border-slate-750 text-slate-800 dark:text-slate-200 focus:ring-0 cursor-pointer"
                    />
                    <span className={cn(outputMode === mode.value ? "text-slate-900 dark:text-slate-100 font-bold" : "text-slate-450 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-350")}>
                      {currentLanguage === 'th' ? mode.labelTh : mode.labelEn}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Caption & Comment Preview */}
            <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] text-left space-y-4 md:col-span-2 relative">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">{t('calendar.preview.captionTitle')}</span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </div>
                {/* Link icon in mockup center */}
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-500 absolute top-5.5 right-6" />
              </div>
              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span>{t('calendar.preview.primary')}</span>
                    <span>48 / 2200</span>
                  </div>
                  <p className="p-3 border border-slate-150 dark:border-slate-800 bg-[#FAF8F5] dark:bg-slate-950 rounded-xl text-slate-850 dark:text-slate-250 font-semibold leading-relaxed">
                    {currentLanguage === 'th' ? 'กฎหมายแรงงานใหม่มีอะไรที่ควรรู้ในปี 2025' : 'What to know about the new labor law in 2025'}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span>{t('calendar.preview.secondary')}</span>
                    <span>72 / 2200</span>
                  </div>
                  <p className="p-3 border border-slate-150 dark:border-slate-800 bg-[#FAF8F5] dark:bg-slate-950 rounded-xl text-slate-850 dark:text-slate-250 font-semibold leading-relaxed">
                    {currentLanguage === 'th' ? 'ข้อเปลี่ยนแปลงสำคัญในกฎหมายแรงงานใหม่ของไทยปี 2025 💡' : 'Key changes in Thailand\'s new labor law to know in 2025. 💡'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Assets variation panel */}
          <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.01)] text-left space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">{t('calendar.preview.assets')}</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div 
                className="w-24 h-24 bg-cover bg-center border border-slate-200 dark:border-slate-800 rounded-xl shrink-0 p-2 shadow-sm"
                style={{ backgroundImage: `url(${MOCK_IMAGES.assetPreview})` }}
              />
              <div className="space-y-3.5 flex-1 min-w-0">
                <div>
                  <p className="font-black text-xs text-slate-900 dark:text-slate-100">Instagram Feed (1:1)</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">1080 x 1080 px • 153 KB</p>
                </div>
                <div className="flex gap-2.5">
                  <Button variant="outline" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 px-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350">
                    {t('calendar.preview.changeAsset')}
                  </Button>
                  <Button variant="outline" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 px-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-350">
                    {t('calendar.preview.addVar')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns (1/3) */}
        <div className="space-y-6 text-left">
          
          {/* Publish Queue */}
          <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">{t('calendar.sidebar.queue')}</span>
              <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer">{t('calendar.sidebar.viewAll')}</span>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { title: 'Service Business Q&A', time: 'May 26, 2025 • 10:00 AM', label: '1:1 format', img: MOCK_IMAGES.queue1, icon: InstagramIcon, iconColor: 'text-rose-600 dark:text-rose-400' },
                { title: 'Client Interview: Legal Strategy', time: 'May 27, 2025 • 2:00 PM', label: '4-tile format', img: MOCK_IMAGES.queue2, icon: LinkedinIcon, iconColor: 'text-blue-600 dark:text-blue-400' },
                { title: 'Tax Insight: Q2 Planning', time: 'May 28, 2025 • 10:00 AM', label: '1:1 format', img: MOCK_IMAGES.queue3, icon: InstagramIcon, iconColor: 'text-rose-600 dark:text-rose-400' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3.5 items-start border-b border-slate-50 dark:border-slate-800 pb-3.5 last:border-0 last:pb-0 group">
                  <div 
                    className="w-10 h-10 rounded bg-cover bg-center border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs"
                    style={{ backgroundImage: `url(${item.img})` }}
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-slate-150 truncate leading-none pt-0.5">{getQueueTitle(item.title)}</p>
                      <MoreHorizontal className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-500 shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-slate-450 dark:text-slate-500 font-semibold leading-none">
                      <item.icon className={cn("w-3 h-3 shrink-0", item.iconColor)} />
                      <span>{getQueueTime(item.time)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[8px] bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 px-1 rounded font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">TH</span>
                      <span className="text-[8px] bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 px-1 rounded font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">EN</span>
                      <span className="text-[8px] bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 px-1 rounded font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">
                        {getQueueLabel(item.label)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 hover:underline cursor-pointer">
                {currentLanguage === 'th' ? 'ดูคิวทั้งหมด →' : 'View full queue →'}
              </span>
            </div>
          </div>

          {/* Channel Readiness */}
          <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">{t('calendar.sidebar.readiness')}</span>
              <span className="text-[10px] font-bold text-[#967F5C] hover:underline cursor-pointer">{t('calendar.sidebar.viewAll')}</span>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { name: 'Instagram', pct: 92 },
                { name: 'LinkedIn', pct: 88 },
                { name: 'YouTube', pct: 76 }
              ].map((chan, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="font-semibold">{chan.name}</span>
                    <span>{chan.pct}%</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-800 dark:bg-slate-200 h-full" style={{ width: `${chan.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-50 dark:border-slate-800/60">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>{t('calendar.sidebar.healthy')}</span>
            </div>
          </div>

          {/* Final Checklist */}
          <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block pb-2 border-b border-slate-100 dark:border-slate-800">{t('calendar.sidebar.checklist')}</span>
            
            <div className="space-y-3 pt-1 text-xs">
              {[
                { label: currentLanguage === 'th' ? 'ยืนยันวันเผยแพร่แล้ว' : 'Date confirmed', sub: currentLanguage === 'th' ? '23 พ.ค. 2025' : 'May 23, 2025' },
                { label: currentLanguage === 'th' ? 'เลือกบัญชีผู้ใช้แล้ว' : 'Account selected', sub: 'Instagram' },
                { label: currentLanguage === 'th' ? 'ตรวจสอบแฮชแท็กแล้ว' : 'Hashtags checked', sub: currentLanguage === 'th' ? 'ยืนยันแล้ว 12 ตัว' : '12 verified' },
                { label: currentLanguage === 'th' ? 'แนบไฟล์สื่อแล้ว' : 'Asset attached', sub: currentLanguage === 'th' ? 'ภาพ 1 รูป' : '1 image' },
                { label: currentLanguage === 'th' ? 'อนุมัติเรียบร้อยแล้ว' : 'Approval complete', sub: currentLanguage === 'th' ? 'ฝ่ายกฎหมาย' : 'Legal Team' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{item.sub}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button 
                onClick={() => toast.success(currentLanguage === 'th' ? 'ตั้งเวลากำหนดการสำเร็จแล้ว' : 'Scheduled successfully')}
                className="w-full bg-slate-900 hover:bg-slate-850 dark:bg-[#EBE7E0] dark:hover:bg-white text-white dark:text-slate-900 border border-slate-250 dark:border-slate-700 font-bold text-xs h-10 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t('calendar.sidebar.ready')}</span>
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Status Indicator at bottom left */}
      <div className="fixed bottom-6 left-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-4 py-2 rounded-xl shadow-md z-30 flex items-center gap-2 text-[10px] font-bold text-slate-650 dark:text-slate-350">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="tracking-wide uppercase">Content Pipeline Live</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-slate-400 dark:text-slate-500">{t('calendar.sidebar.healthy')}</span>
      </div>

    </div>
  );
}
