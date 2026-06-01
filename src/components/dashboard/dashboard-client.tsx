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
  const { currentLanguage } = useLanguage();
  
  // Smart Input Pattern State
  const [audiencePreset, setAudiencePreset] = useState('General Business');
  const [isPreset, setIsPreset] = useState(true);
  const [customAudience, setCustomAudience] = useState('');

  // Sample static upcoming agenda dates (from Calendar)
  const upcomingQueue = [
    { date: 'MAY 20', title: 'Tax Insight: Q2 Planning' },
    { date: 'MAY 22', title: 'Labor Law Update' },
    { date: 'MAY 23', title: 'Compliance Checklist' }
  ];

  // Rich mock campaigns data with preview images for SaaS presentation
  const mockCampaigns = [
    {
      id: 'mock-1',
      title: 'Q2 Tax Advisory Series',
      topic: 'ชุดความรู้ภาษีสำหรับธุรกิจ Q2',
      languages: ['TH', 'EN'],
      statusLabel: 'In Review',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      milestone: 'Legal Review',
      owner: 'NK',
      image: '/media_1.jpg'
    },
    {
      id: 'mock-2',
      title: 'Labor Law Updates',
      topic: 'อัปเดตใหม่กฎหมายแรงงาน 2025',
      languages: ['TH', 'EN'],
      statusLabel: 'Drafting',
      badgeColor: 'bg-blue-100 text-blue-850 dark:bg-blue-900/30 dark:text-blue-300',
      milestone: 'Content Draft',
      owner: 'PP',
      image: '/media_2.jpg'
    },
    {
      id: 'mock-3',
      title: 'PDPA Compliance Hub',
      topic: 'แนวปฏิบัติการคุ้มครองข้อมูลส่วนบุคคล',
      languages: ['TH', 'EN'],
      statusLabel: 'Scheduled',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      milestone: 'Publish Queue',
      owner: 'OS',
      image: '/media_3.jpg'
    },
    {
      id: 'mock-4',
      title: 'Corporate Restructuring FAQ',
      topic: 'คู่มือการควบรวมและปรับโครงสร้างธุรกิจ',
      languages: ['TH', 'EN'],
      statusLabel: 'Published',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      milestone: 'Done',
      owner: 'JS',
      image: '/media_4.jpg'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      <div className="w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
              Content Operations
            </h1>
            <p className="text-xs text-[#7C756C] dark:text-slate-400">
              Oversee bilingual content, review flow, and publishing from one workspace.
            </p>
          </div>
        </div>

        {/* Timeline Milestones Progression */}
        <div className="grid grid-cols-5 border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
          {[
            { label: 'Briefs', count: 7, sub: 'Open' },
            { label: 'Drafts', count: 12, sub: 'In progress' },
            { label: 'Review', count: stats.draft || 5, sub: 'In review' },
            { label: 'Scheduled', count: stats.approved || 8, sub: 'Upcoming' },
            { label: 'Published', count: stats.published || 46, sub: 'This month' }
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
                  Campaign Snapshot
                </h3>
                <Link href="/drafts" className="text-[10px] font-bold text-[#967F5C] hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6DFD5] dark:border-slate-800 bg-[#FAF8F5]/50 dark:bg-slate-900 text-[#7C756C] font-bold">
                      <th className="p-4 font-semibold uppercase tracking-wider">Campaign</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-center">Language</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Status</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Next Milestone</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-center">Owner</th>
                      <th className="p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DFD5]/50 dark:divide-slate-800">
                    {mockCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-medium text-[#1E1D1B] dark:text-[#EBE7E0]">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-10 rounded-lg bg-cover bg-center border border-[#E6DFD5] dark:border-slate-800 shrink-0" 
                              style={{ backgroundImage: `url(${campaign.image})` }}
                            />
                            <div className="min-w-0">
                              <p className="font-bold line-clamp-1 text-xs">{campaign.title}</p>
                              <p className="text-[10px] text-[#7C756C] mt-0.5 line-clamp-1">{campaign.topic}</p>
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
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1.5", campaign.badgeColor)}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {campaign.statusLabel}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#7C756C]">{campaign.milestone}</td>
                        <td className="p-4 text-center">
                          <div className="w-6 h-6 rounded-full bg-[#EBE6DF] dark:bg-slate-800 text-[#1E1D1B] dark:text-[#EBE7E0] flex items-center justify-center font-bold text-[10px] mx-auto">
                            {campaign.owner}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <MoreHorizontal className="w-4 h-4 text-[#7C756C] cursor-pointer hover:text-[#1E1D1B]" />
                        </td>
                      </tr>
                    ))}
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
                    Smart Input Pattern
                  </h4>
                  <p className="text-[10px] text-[#7C756C] dark:text-slate-400 mt-0.5">
                    Every selectable field follows the system rule: Preset, Other, Custom.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#7C756C] font-bold">Example: Audience</span>
                  <select 
                    value={audiencePreset}
                    onChange={(e) => setAudiencePreset(e.target.value)}
                    disabled={!isPreset}
                    className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] h-10 outline-none"
                  >
                    <option>General Business</option>
                    <option>Legal Professionals</option>
                    <option>SME Owners</option>
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
                    Other / Custom
                  </label>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#7C756C] font-bold">Enter Custom Audience...</span>
                  <input 
                    type="text" 
                    placeholder="Describe custom target..."
                    value={customAudience}
                    onChange={(e) => setCustomAudience(e.target.value)}
                    disabled={isPreset}
                    className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] h-10 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
                <Button 
                  onClick={() => {}}
                  className="bg-[#1E1D1B] hover:bg-[#2D2A26] dark:bg-[#EBE7E0] dark:hover:bg-white text-white dark:text-[#1E1D1B] font-bold text-xs px-5 py-2.5 h-10 rounded-lg shadow-sm"
                >
                  Apply Pattern <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>

          </div>

          {/* Right Intelligence Rail (1/3 Column) */}
          <div className="space-y-8 text-left">
            
            {/* Brand Context */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Brand Context</span>
              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-10 h-10 rounded-full bg-[#F3EFEA] dark:bg-slate-800 flex items-center justify-center font-serif text-[#1E1D1B] dark:text-[#EBE7E0] font-bold">
                  OS
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#1E1D1B] dark:text-[#EBE7E0] truncate">
                    {brandData?.name || "Your Workspace Brand"}
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
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">System Rules</span>
              </div>
              
              <div className="space-y-3 pt-1 text-xs">
                {[
                  { label: 'Bilingual output enabled', sub: 'TH / EN' },
                  { label: 'Hashtag support enabled', sub: 'On' },
                  { label: 'Approved sources only', sub: 'Enforced' }
                ].map((rule, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-[#1E1D1B] dark:text-[#EBE7E0] font-medium">{rule.label}</span>
                    <span className="text-[#7C756C] font-bold text-[10px] uppercase tracking-wider">{rule.sub}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
                <Link href="/profile" className="text-[10px] font-bold text-[#967F5C] hover:underline">
                  Manage rules →
                </Link>
              </div>
            </div>

            {/* Channel Health */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">Channel Health</span>
                <span className="text-[10px] font-bold text-[#967F5C] hover:underline">View</span>
              </div>
              
              <div className="space-y-4 pt-1">
                {[
                  { name: 'Website', percentage: 88 },
                  { name: 'LinkedIn', percentage: 76 },
                  { name: 'YouTube', percentage: 62 }
                ].map((chan, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0]">
                      <span>{chan.name}</span>
                      <span>{chan.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#F3EFEA] dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#1E1D1B] dark:bg-[#EBE7E0] h-full" style={{ width: `${chan.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-[10px] text-[#7C756C] italic pt-1">
                Health score is updated daily.
              </p>
            </div>

            {/* Upcoming Queue */}
            <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold">Upcoming Queue</span>
                <Link href="/calendar" className="text-[10px] font-bold text-[#967F5C] hover:underline">View</Link>
              </div>

              <div className="space-y-3 pt-1">
                {upcomingQueue.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="text-[10px] font-bold text-[#7C756C] w-12 tracking-wide shrink-0">
                      {item.date}
                    </div>
                    <div className="text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0] truncate">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
                <Link href="/calendar" className="text-[10px] font-bold text-[#967F5C] hover:underline">
                  See full calendar →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
