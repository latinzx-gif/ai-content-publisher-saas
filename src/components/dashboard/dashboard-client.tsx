'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckSquare, 
  Send,
  Fingerprint,
  Link2,
  KeyRound,
  ArrowRight,
  Activity,
  Plus,
  XCircle,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/metric-card';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { DESIGN_SYSTEM } from '@/config/design-system';

interface ActivityLog {
  id: string;
  action: string;
  topic: string | null;
  status: string;
  created_at: string;
}

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
  brandName?: string;
  recentActivity: ActivityLog[];
}

export function DashboardClient({ 
  userEmail, 
  stats, 
  brandName, 
  recentActivity 
}: DashboardClientProps) {
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const skipped = localStorage.getItem('onboarding-skipped') === 'true';
    setOnboardingSkipped(skipped);
    setMounted(true);
  }, []);

  // Onboarding Steps Calculation
  const onboardingSteps = [
    {
      id: 'brand',
      title: 'Create Brand Profile',
      desc: 'Tell AI about your company voice and audience.',
      completed: stats.hasBrand,
      href: '/profile',
      actionLabel: 'Set Up Profile'
    },
    {
      id: 'openai',
      title: 'Connect OpenAI',
      desc: 'Provide an API key to enable post generation.',
      completed: stats.hasOpenAI,
      href: '/settings',
      actionLabel: 'Connect Key'
    },
    {
      id: 'buffer',
      title: 'Connect Buffer',
      completed: stats.hasBuffer,
      href: '/settings',
      actionLabel: 'Connect Buffer'
    },
    {
      id: 'generate',
      title: 'Generate First Content',
      completed: stats.generated > 0,
      href: '/generate',
      actionLabel: 'Create Post'
    },
    {
      id: 'publish',
      title: 'Publish First Post',
      completed: stats.published > 0,
      href: '/drafts',
      actionLabel: 'Approve & Publish'
    }
  ];

  // Determine completed count and percentage
  const completedCount = onboardingSteps.filter(s => s.completed).length;
  const progressPercent = completedCount * 20;
  const onboardingComplete = completedCount === 5;
  const showOnboarding = mounted && !onboardingComplete && !onboardingSkipped;

  // Next action for onboarding progress
  const nextAction = onboardingSteps.find(s => !s.completed);

  const handleSkipOnboarding = () => {
    localStorage.setItem('onboarding-skipped', 'true');
    setOnboardingSkipped(true);
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('onboarding-skipped');
    setOnboardingSkipped(false);
  };

  // Progress circle dimensions
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      
      {/* 1. Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-12 translate-x-12" />
        <div className="space-y-3 relative z-10">
          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Operational Dashboard</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
            Welcome back, Owner
          </h1>
          <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
            Logged in as <span className="text-slate-200 font-bold">{userEmail}</span>. You currently have <span className="text-slate-100 font-bold">{stats.draft} drafts</span> pending editor review, <span className="text-slate-100 font-bold">{stats.approved} posts</span> approved, and <span className="text-slate-100 font-bold">{stats.published} posts</span> published successfully.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link 
            href="/generate" 
            className={cn(
              buttonVariants({ size: 'default' }), 
              DESIGN_SYSTEM.buttons.primary,
              "h-12 rounded-2xl gap-2 font-black shadow-lg shadow-indigo-500/20"
            )}
          >
            <Plus className="w-5 h-5" />
            Generate Content
          </Link>
          <Link 
            href="/drafts" 
            className={cn(
              buttonVariants({ size: 'default', variant: 'outline' }), 
              DESIGN_SYSTEM.buttons.outline,
              "h-12 border-slate-700 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 font-bold rounded-2xl"
            )}
          >
            <FileText className="w-5 h-5 mr-1" />
            Review Drafts
          </Link>
        </div>
      </div>

      {/* 2. Onboarding Progress Ring Section */}
      {showOnboarding && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-5 text-left">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-indigo-600 dark:text-indigo-400 transition-all duration-700"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className="absolute font-heading text-lg font-black text-slate-900 dark:text-slate-50">
                {progressPercent}%
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight font-heading">
                🚀 Get Started with AI Publisher
              </h3>
              <p className="text-slate-400 text-xs font-semibold max-w-md">
                Configure your profiles and link API keys to unlock automatic social posting features.
              </p>
              {nextAction && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Next Action
                  </span>
                  <Link href={nextAction.href} className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-0.5 hover:underline">
                    {nextAction.title}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={handleSkipOnboarding}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-all"
            >
              Skip onboarding & view dashboard →
            </button>
          </div>
        </div>
      )}

      {/* 3. Workflow Pipeline */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex justify-between items-center pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Content Publishing Pipeline
          </h3>
          <div className="flex items-center gap-2">
            {onboardingSkipped && (
              <Button 
                variant="outline" 
                size="xs" 
                onClick={handleRestartOnboarding}
                className="text-[10px] h-6 rounded-lg font-bold"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Reset Onboarding
              </Button>
            )}
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {stats.draft} drafts awaiting approval
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phase 01</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50 leading-none">Drafts Created</h4>
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-slate-50 font-heading bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
              {stats.draft}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phase 02</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50 leading-none">Review Queue</h4>
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-slate-50 font-heading bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
              {stats.draft}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phase 03</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50 leading-none">Approved Queue</h4>
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-slate-50 font-heading bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
              {stats.approved}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phase 04</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50 leading-none">Published Social</h4>
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-slate-50 font-heading bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
              {stats.published}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Draft Posts"
          value={stats.draft}
          description="Awaiting reviewer approval"
          icon={FileText}
        />
        <MetricCard 
          title="Approved Posts"
          value={stats.approved}
          description="Queued in social planner"
          icon={CheckSquare}
        />
        <MetricCard 
          title="Published Posts"
          value={stats.published}
          description="Pushed successfully to Buffer"
          icon={Send}
        />
        <MetricCard 
          title="Failed Logs"
          value={stats.failed}
          description="API network failure logs"
          icon={XCircle}
        />
      </div>

      {/* Main 2-Column Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: System Health & Empty State check */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 5. System Health Status Panel */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              System Connections & Health
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Status */}
              <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Fingerprint className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-1">Brand Guideline</h4>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-none">
                      {brandName || "Brand Profile"}
                    </span>
                  </div>
                </div>
                <StatusBadge status={stats.hasBrand ? "approved" : "draft"} className="scale-90" />
              </div>

              {/* OpenAI Status */}
              <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-455 flex items-center justify-center">
                    <KeyRound className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-1">OpenAI API</h4>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-none">
                      GPT-4o Engine
                    </span>
                  </div>
                </div>
                <StatusBadge status={stats.hasOpenAI ? "approved" : "draft"} className="scale-90" />
              </div>

              {/* Buffer Status */}
              <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Link2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-1">Buffer Integration</h4>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-none">
                      Queue Planner
                    </span>
                  </div>
                </div>
                <StatusBadge status={stats.hasBuffer ? "approved" : "draft"} className="scale-90" />
              </div>
            </div>
          </div>

          {/* 6. Context-Aware Empty State */}
          {stats.generated === 0 && (
            <EmptyState 
              icon={FolderOpen}
              title="Your Content Feed is Quiet"
              description="No automated posts have been generated yet. Configure your brand guideline context parameters and start creating first posts drafts in seconds."
              action={{
                label: "✨ Generate First Content",
                href: "/generate"
              }}
            />
          )}

        </div>

        {/* Right 1 Column: Recent Activity Timeline */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recent Activity Log
          </h3>
          
          <DashboardCard className="p-5">
            {recentActivity && recentActivity.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((log, logIdx) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {logIdx !== recentActivity.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-800" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={cn(
                              "h-8 w-8 rounded-xl flex items-center justify-center ring-4 ring-white dark:ring-slate-900 text-white shadow-sm",
                              log.action.includes('generate') 
                                ? "bg-indigo-500" 
                                : log.action.includes('approve') 
                                  ? "bg-emerald-500" 
                                  : log.action.includes('reject')
                                    ? "bg-rose-500"
                                    : "bg-slate-500"
                            )}>
                              <Activity className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 text-left">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-50 capitalize leading-none mb-0.5">
                              {log.action.replace(/_/g, ' ')}
                            </p>
                            {log.topic && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
                                Topic: {log.topic}
                              </p>
                            )}
                            <p className="text-[9px] font-black text-slate-300 dark:text-slate-650 tracking-wider uppercase mt-1">
                              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 space-y-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No activity logs recorded yet.</p>
              </div>
            )}
          </DashboardCard>
        </div>

      </div>
    </div>
  );
}
