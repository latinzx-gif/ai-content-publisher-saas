'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

function getInitials(name?: string | null) {
  const cleaned = (name || '').trim();
  if (!cleaned) return 'AI';

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const firstTwo = parts.length > 1 ? [parts[0], parts[1]] : [cleaned.slice(0, 2)];
  return firstTwo
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardClient({ 
  stats, 
  brandData,
  posts
}: DashboardClientProps) {
  const { t, currentLanguage } = useLanguage();
  const brandInitials = getInitials(brandData?.name);

  const snapshotPosts = posts.slice(0, 4);
  const upcomingQueue = posts.filter((post) => post.status === 'text_approved' || post.status === 'creative_approved').slice(0, 3);

  const getStatusView = (status: string) => {
    if (status === 'text_approved') {
      return {
        label: 'Text Approved',
        milestone: 'Creative Review',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    }
    if (status === 'creative_approved') {
      return {
        label: 'Creative Approved',
        milestone: 'Publish Queue',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    }
    if (status === 'images_pending' || status === 'images_ready') {
      return {
        label: status === 'images_pending' ? 'Images Pending' : 'Images Ready',
        milestone: 'Creative Review',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
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
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-4 md:p-6 lg:p-8 flex flex-col space-y-6">
      <div className="w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-heading font-semibold tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
              {t('deck.title')}
            </h1>
            <p className="text-xs text-[#7C756C] dark:text-slate-400">
              {t('deck.subtitle')}
            </p>
          </div>
        </div>

        {/* Timeline Milestones Progression */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
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
                "p-4 lg:p-5 text-center relative flex flex-col items-center justify-center space-y-1.5 min-w-0",
                idx !== 4 && "border-r border-[#E6DFD5] dark:border-slate-800"
              )}
            >
              <span className="text-[10px] uppercase tracking-wider text-[#7C756C] dark:text-slate-400 font-bold">{item.label}</span>
              <span className="text-2xl font-heading font-medium text-[#1E1D1B] dark:text-[#EBE7E0]">{item.count}</span>
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
                      const topic = meta.topic || meta.angle_type || '';
                      const draftsHref = topic ? `/drafts?topic=${encodeURIComponent(topic)}` : '/drafts';
                      const title = meta.title || post.content.split('\n')[0] || 'Untitled Draft';
                      return (
                      <tr key={post.id} className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-medium text-[#1E1D1B] dark:text-[#EBE7E0]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg border border-[#E6DFD5] dark:border-slate-800 shrink-0 bg-[#FAF8F5] dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-[#7C756C]">
                              {brandInitials}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={draftsHref}
                                aria-label={topic ? `Open Review Board filtered by ${topic}` : `Open Review Board for ${title}`}
                                className="line-clamp-1 text-xs font-bold underline-offset-2 transition-colors group-hover:text-[#967F5C] group-hover:underline"
                              >
                                {title}
                              </Link>
                              <Link
                                href={draftsHref}
                                aria-label={topic ? `Filter drafts by ${topic}` : `Open Review Board for ${title}`}
                                className="mt-0.5 line-clamp-1 text-[10px] text-[#7C756C] underline-offset-2 transition-colors group-hover:text-[#967F5C] group-hover:underline"
                              >
                                {topic || post.status}
                              </Link>
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
                            {brandInitials}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            href={draftsHref}
                            aria-label={topic ? `Open Review Board filtered by ${topic}` : `Open Review Board for ${title}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#7C756C] transition-colors hover:bg-[#FAF8F5] hover:text-[#1E1D1B]"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="mx-auto max-w-sm space-y-3">
                            <p className="text-sm font-black text-[#1E1D1B] dark:text-[#EBE7E0]">
                              {currentLanguage === 'th' ? 'ยังไม่มีโพสต์ในระบบ' : 'No content posts yet'}
                            </p>
                            <p className="text-xs font-semibold leading-relaxed text-[#7C756C] dark:text-slate-400">
                              {currentLanguage === 'th'
                                ? 'เริ่มจากการตั้งค่า Brand Profile หรือสร้างโพสต์แรกด้วย Content Generator'
                                : 'Start by completing Brand Profile or generate your first draft.'}
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                              <Link href="/profile" className="inline-flex h-8 items-center rounded-lg border border-[#E6DFD5] px-3 text-[10px] font-black uppercase tracking-wider text-[#1E1D1B] hover:bg-[#FAF8F5]">
                                {currentLanguage === 'th' ? 'ตั้งค่าแบรนด์' : 'Brand Profile'}
                              </Link>
                              <Link href="/generate" className="inline-flex h-8 items-center rounded-lg bg-[#1E1D1B] px-3 text-[10px] font-black uppercase tracking-wider text-white hover:bg-[#2D2A26]">
                                {currentLanguage === 'th' ? 'สร้างโพสต์' : 'Generate'}
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                  {brandInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0] truncate">
                    {brandData?.name || (currentLanguage === 'th' ? 'ยังไม่ได้ตั้งค่า Brand Profile' : 'Brand Profile not configured')}
                  </h4>
                  <p className="text-[10px] text-[#7C756C] mt-0.5 truncate uppercase tracking-wider">
                    {brandData?.personality || (currentLanguage === 'th' ? 'ตั้งค่า tone และ personality ก่อนใช้งานจริง' : 'Set tone and personality before generating')}
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
                Current content pipeline status from your workspace.
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
                  <div className="rounded-lg border border-dashed border-[#D6CEC1] bg-[#FAF8F5] p-3">
                    <p className="text-xs font-black text-[#1E1D1B] dark:text-[#EBE7E0]">
                      {currentLanguage === 'th' ? 'ยังไม่มีโพสต์พร้อมเผยแพร่' : 'No approved posts queued'}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold leading-relaxed text-[#7C756C]">
                      {currentLanguage === 'th'
                        ? 'อนุมัติโพสต์ใน Review Board เพื่อแสดงรายการเผยแพร่ถัดไป'
                        : 'Approve drafts in the Review Board to build the publishing queue.'}
                    </p>
                    <Link href="/drafts" className="mt-3 inline-flex h-7 items-center rounded-md bg-[#1E1D1B] px-3 text-[9px] font-black uppercase tracking-wider text-white hover:bg-[#2D2A26]">
                      {currentLanguage === 'th' ? 'ไปที่บอร์ด' : 'Review Board'}
                    </Link>
                  </div>
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
