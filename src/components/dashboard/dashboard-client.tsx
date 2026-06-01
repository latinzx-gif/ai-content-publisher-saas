'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Settings, 
  Check, 
  MoreHorizontal,
  ChevronRight,
  Shield,
  Heart,
  Globe,
  MessageSquare,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { useLanguage } from '@/components/providers/language-provider';

interface DashboardClientProps {
  userEmail: string;
  stats: {
    draft: number;
    approved: number;
    published: number;
    failed: number;
    generated: number;
    hasBrand: boolean;
    hasOpenAI: boolean;
    hasBuffer: boolean;
  };
  brandData?: {
    name: string;
    business_type: string;
    target_audience: string;
    tone: string;
    personality: string;
  } | null;
  posts: Post[];
}

export function DashboardClient({ 
  userEmail, 
  stats, 
  brandData,
  posts
}: DashboardClientProps) {
  const { t, currentLanguage } = useLanguage();
  
  // Smart Input Pattern State
  const [audiencePreset, setAudiencePreset] = useState('General Business');
  const [isPreset, setIsPreset] = useState(true);
  const [customAudience, setCustomAudience] = useState('');

  const snapshotPosts = posts.slice(0, 4);
  const upcomingQueue = posts.filter((post) => post.status === 'approved').slice(0, 3);

  const getStatusView = (status: string) => {
    if (status === 'approved') {
      return {
        label: 'Approved',
        milestone: 'Publish Queue',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    }
    if (status === 'published') {
      return {
        label: 'Published',
        milestone: 'Done',
        badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      };
    }
    if (status === 'failed') {
      return {
        label: 'Failed',
        milestone: 'Needs attention',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      };
    }
    return {
      label: 'Draft',
      milestone: 'Content Draft',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      <div className="w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
              {t('deck.title')}
            </h1>
            <p className="text-xs text-[#7C756C] dark:text-slate-400">
              {t('deck.subtitle')}
            </p>
          </div>
        </div>

        {/* Timeline Milestones Progression */}
        <div className="grid grid-cols-5 border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          {[
            { label: t('deck.milestones.briefs'), count: stats.generated, sub: 'Generated' },
            { label: t('deck.milestones.drafts'), count: stats.draft, sub: t('deck.milestones.inProgress') },
            { label: t('deck.milestones.review'), count: stats.approved, sub: 'Approved' },
            { label: t('deck.milestones.scheduled'), count: 0, sub: t('deck.milestones.upcoming') },
            { label: t('deck.milestones.published'), count: stats.published, sub: t('deck.milestones.thisMonth') }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-5 text-center relative flex flex-col items-center justify-center space-y-1.5",
                idx !== 4 && "border-r border-[#E6DFD5] dark:border-slate-800"
              )}
            >
              <span className="text-[10px] uppercase tracking-wider text-[#7C756C] dark:text-slate-400 font-bold">{item.label}</span>
              <span className="text-2xl font-serif font-medium text-[#1E1D1B] dark:text-[#EBE7E0]">{item.count}</span>
              <span className="text-[10px] text-[#7C756C] dark:text-slate-500 font-medium">{item.sub}</span>
              
              {idx < 4 && (
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 border-t border-r border-[#E6DFD5] dark:border-slate-800 w-5 h-5 rotate-45 hidden md:block" />
              )}
            </div>
          ))}
        </div>

        {/* Dashboard Columns (2/3 and 1/3 layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Console (2/3 Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Campaign Snapshot */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <div className="p-5 border-b border-[#E6DFD5] dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0] font-bold">
                  {t('deck.snapshot.title')}
                </h3>
                <Link href="/drafts" className="text-[10px] font-bold text-[#967F5C] hover:underline flex items-center gap-1">
                  {t('deck.snapshot.viewAll')} <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6DFD5] dark:border-slate-800 bg-[#FAF8F5]/50 dark:bg-slate-900 text-[#7C756C] font-bold">
                      <th className="p-4 font-semibold uppercase tracking-wider">{t('deck.snapshot.th')}</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-center">{t('deck.snapshot.thLang')}</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">{t('deck.snapshot.thStatus')}</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">{t('deck.snapshot.thMilestone')}</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-center">{t('deck.snapshot.thOwner')}</th>
                      <th className="p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DFD5]/50 dark:divide-slate-800">
                    {snapshotPosts.length > 0 ? snapshotPosts.map((post) => {
                      const meta = post.metadata || {};
                      const statusView = getStatusView(post.status);
                      return (
                      <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-medium text-[#1E1D1B] dark:text-[#EBE7E0]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg border border-[#E6DFD5] dark:border-slate-800 shrink-0 bg-[#FAF8F5] dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-[#7C756C]">
                              OS
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold line-clamp-1 text-xs">{meta.title || post.content.split('\n')[0] || 'Untitled Draft'}</p>
                              <p className="text-[10px] text-[#7C756C] mt-0.5 line-clamp-1">{meta.topic || post.status}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1 text-[9px] font-bold">
                            <span className="px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-slate-800 border border-[#E6DFD5] dark:border-slate-700 rounded text-[#7C756C]">TH</span>
                            <span className="px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-slate-800 border border-[#E6DFD5] dark:border-slate-700 rounded text-[#7C756C]">EN</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1.5", statusView.badgeColor)}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusView.label}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#7C756C]">{statusView.milestone}</td>
                        <td className="p-4 text-center">
                          <div className="w-6 h-6 rounded-full bg-[#EBE6DF] dark:bg-slate-800 text-[#1E1D1B] dark:text-[#EBE7E0] flex items-center justify-center font-bold text-[10px] mx-auto">
                            OS
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <MoreHorizontal className="w-4 h-4 text-[#7C756C] cursor-pointer hover:text-[#1E1D1B]" />
                        </td>
                      </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-xs font-semibold text-[#7C756C] dark:text-slate-400">
                          No content posts yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Smart Input Pattern Section */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 space-y-5 shadow-[0_2px_8px_rgba(30,29,27,0.02)] text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-[#FAF8F5] dark:bg-slate-800 border border-[#E6DFD5] dark:border-slate-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#967F5C]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0] font-bold">
                    {t('deck.smartInput.title')}
                  </h4>
                  <p className="text-[10px] text-[#7C756C] dark:text-slate-400 mt-0.5">
                    {t('deck.smartInput.desc')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#7C756C] font-bold">{t('deck.smartInput.example')}</span>
                  <select 
                    value={audiencePreset}
                    onChange={(e) => setAudiencePreset(e.target.value)}
                    disabled={!isPreset}
                    className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] h-10 outline-none"
                  >
                    <option value="General Business">{currentLanguage === 'th' ? 'ธุรกิจทั่วไป' : 'General Business'}</option>
                    <option value="Legal Professionals">{currentLanguage === 'th' ? 'นักกฎหมาย / ผู้ตรวจสอบ' : 'Legal Professionals'}</option>
                    <option value="SME Owners">{currentLanguage === 'th' ? 'ผู้ประกอบการ SME' : 'SME Owners'}</option>
                  </select>
                </div>

                <div className="space-y-2 h-10 flex items-center gap-2 border border-[#E6DFD5] dark:border-slate-700 rounded-lg px-3 bg-[#FAF8F5] dark:bg-slate-900">
                  <input 
                    type="checkbox" 
                    id="customToggle" 
                    checked={!isPreset} 
                    onChange={(e) => setIsPreset(!e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E6DFD5]"
                  />
                  <label htmlFor="customToggle" className="text-xs font-bold text-[#7C756C] uppercase tracking-wider cursor-pointer">
                    {t('deck.smartInput.otherToggle')}
                  </label>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#7C756C] font-bold">{t('deck.smartInput.customPlaceholder')}</span>
                  <input 
                    type="text" 
                    placeholder={t('deck.smartInput.customPlaceholder')}
                    value={customAudience}
                    onChange={(e) => setCustomAudience(e.target.value)}
                    disabled={isPreset}
                    className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] h-10 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
                <Button 
                  onClick={() => {}}
                  className="bg-[#1E1D1B] hover:bg-[#2D2A26] dark:bg-[#EBE7E0] dark:hover:bg-white text-white dark:text-[#1E1D1B] font-bold text-xs px-5 py-2.5 h-10 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  {t('deck.smartInput.apply')} <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

          </div>

          {/* Right Intelligence Rail (1/3 Column) */}
          <div className="space-y-8 text-left">
            
            {/* Brand Context */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">{t('deck.sidebar.brandContext')}</span>
              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-10 h-10 rounded-full bg-[#F3EFEA] dark:bg-slate-800 flex items-center justify-center font-serif text-[#1E1D1B] dark:text-[#EBE7E0] font-bold">
                  OS
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0] truncate">
                    {brandData?.name || (currentLanguage === 'th' ? 'แบรนด์ในพื้นที่ทำงานของคุณ' : 'Your Workspace Brand')}
                  </h4>
                  <p className="text-[10px] text-[#7C756C] mt-0.5 truncate uppercase tracking-wider">
                    {brandData?.personality || "Legal. Trusted. Precise."}
                  </p>
                </div>
              </div>
            </div>

            {/* System Rules */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">{t('deck.sidebar.systemRules')}</span>
              </div>
              
              <div className="space-y-3 pt-1 text-xs">
                {[
                  { label: currentLanguage === 'th' ? 'เปิดใช้งานผลลัพธ์สองภาษา' : 'Bilingual output enabled', sub: 'TH / EN' },
                  { label: currentLanguage === 'th' ? 'เปิดใช้งานการรองรับแฮชแท็ก' : 'Hashtag support enabled', sub: 'On' },
                  { label: currentLanguage === 'th' ? 'บังคับใช้แหล่งข้อมูลที่อนุมัติแล้วเท่านั้น' : 'Approved sources only', sub: 'Enforced' }
                ].map((rule, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-[#1E1D1B] dark:text-[#EBE7E0] font-medium">{rule.label}</span>
                    <span className="text-[#7C756C] font-bold text-[10px] uppercase tracking-wider">{rule.sub}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
                <Link href="/profile" className="text-[10px] font-bold text-[#967F5C] hover:underline">
                  {t('deck.sidebar.manageRules')}
                </Link>
              </div>
            </div>

            {/* Channel Health */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">{t('deck.sidebar.channelHealth')}</span>
                <span className="text-[10px] font-bold text-[#967F5C] hover:underline">{t('deck.snapshot.viewAll')}</span>
              </div>
              
              <div className="space-y-4 pt-1">
                {[
                  { name: 'Draft', value: stats.draft },
                  { name: 'Approved', value: stats.approved },
                  { name: 'Published', value: stats.published }
                ].map((chan, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0]">
                      <span>{chan.name}</span>
                      <span>{chan.value}</span>
                    </div>
                    <div className="w-full bg-[#F3EFEA] dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#1E1D1B] dark:bg-[#EBE7E0] h-full" style={{ width: `${stats.generated ? (chan.value / stats.generated) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-[10px] text-[#7C756C] italic pt-1">
                Live status mix from Supabase content rows.
              </p>
            </div>

            {/* Upcoming Queue */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">{t('deck.sidebar.upcomingQueue')}</span>
                <Link href="/calendar" className="text-[10px] font-bold text-[#967F5C] hover:underline">{t('deck.snapshot.viewAll')}</Link>
              </div>

              <div className="space-y-3 pt-1">
                {upcomingQueue.length > 0 ? upcomingQueue.map((post) => (
                  <div key={post.id} className="flex gap-4 items-center">
                    <div className="text-[10px] font-bold text-[#7C756C] w-12 tracking-wide shrink-0">
                      {new Date(post.updated_at || post.created_at).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0] truncate">
                      {post.metadata?.title || post.content.split('\n')[0] || 'Approved post'}
                    </div>
                  </div>
                )) : (
                  <p className="text-xs font-semibold text-[#7C756C]">
                    No approved posts queued.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
                <Link href="/calendar" className="text-[10px] font-bold text-[#967F5C] hover:underline">
                  {t('deck.sidebar.seeFull')}
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
