'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Send,
  Fingerprint,
  Link2,
  KeyRound,
  ArrowRight,
  Activity,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';

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
      desc: 'Unlock social scheduling capabilities.',
      completed: stats.hasBuffer,
      href: '/settings',
      actionLabel: 'Connect Buffer'
    },
    {
      id: 'generate',
      title: 'Generate First Content',
      desc: 'Create your first automated batch of social drafts.',
      completed: stats.generated > 0,
      href: '/generate',
      actionLabel: 'Create Post'
    },
    {
      id: 'publish',
      title: 'Publish First Post',
      desc: 'Send your first approved draft to social networks.',
      completed: stats.published > 0,
      href: '/drafts',
      actionLabel: 'Approve & Publish'
    }
  ];

  // Determine completed count and percentage
  const completedCount = onboardingSteps.filter(s => s.completed).length;
  const progressPercent = completedCount * 20;
  const onboardingComplete = completedCount === 5;

  // Progression & locking logic
  let previousCompleted = true;
  const processedOnboardingSteps = onboardingSteps.map((step) => {
    const isLocked = !previousCompleted;
    // Set for next iteration
    previousCompleted = step.completed;
    return {
      ...step,
      isLocked
    };
  });

  const showOnboarding = mounted && !onboardingComplete && !onboardingSkipped;

  const handleSkipOnboarding = () => {
    localStorage.setItem('onboarding-skipped', 'true');
    setOnboardingSkipped(true);
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('onboarding-skipped');
    setOnboardingSkipped(false);
  };

  // Workflow steps pipeline
  const workflowSteps = [
    { label: 'Configure', active: stats.hasBrand && stats.hasOpenAI && stats.hasBuffer, done: stats.hasBrand && stats.hasOpenAI && stats.hasBuffer },
    { label: 'Generate', active: stats.generated > 0, done: stats.generated > 0 },
    { label: 'Review', active: stats.draft > 0, done: stats.draft === 0 && stats.generated > 0 },
    { label: 'Approve', active: stats.approved > 0, done: stats.approved === 0 && stats.published > 0 },
    { label: 'Schedule', active: stats.approved > 0, done: stats.published > 0 },
    { label: 'Publish', active: stats.published > 0, done: stats.published > 0 }
  ];

  // Determine active workflow step index
  const activeWorkflowIndex = workflowSteps.findIndex(step => !step.done);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Top Welcome / Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Logged in as <span className="font-semibold text-gray-700">{userEmail}</span>. Your automated publishing hub is online.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats.hasBrand ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Brand Active: {brandName || 'Profile Connected'}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Action Needed: Complete Profile
            </div>
          )}
          {onboardingSkipped && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRestartOnboarding}
              className="text-xs py-1 h-7 rounded-lg"
            >
              Show Onboarding
            </Button>
          )}
        </div>
      </div>

      {/* Conditional Onboarding FTUE Checklist */}
      {showOnboarding && (
        <Card className="border-indigo-100 bg-indigo-50/40 shadow-sm overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100/60 pb-5">
              <div>
                <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                  🚀 Get Started with AI Publisher
                </h3>
                <p className="text-indigo-700 text-sm mt-1">
                  Complete these 5 setup steps to publish your first post.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Progress</p>
                  <p className="text-lg font-black text-indigo-950">{progressPercent}% Complete</p>
                </div>
                <div className="w-24 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {processedOnboardingSteps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex flex-col justify-between p-4 rounded-xl border bg-white shadow-sm transition-all relative",
                    step.completed ? "border-emerald-100 bg-emerald-50/10" : "border-gray-100",
                    step.isLocked && "opacity-50 pointer-events-none"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                        Step {idx + 1}
                      </span>
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                      ) : step.isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <h4 className={cn(
                      "text-sm font-bold text-gray-900",
                      step.completed && "line-through text-gray-500"
                    )}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      {step.desc}
                    </p>
                  </div>

                  {!step.completed && !step.isLocked && (
                    <div className="mt-4 pt-2">
                      <Link 
                        href={step.href}
                        className={cn(
                          buttonVariants({ size: 'sm' }),
                          "w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 shadow-sm flex items-center justify-center gap-1"
                        )}
                      >
                        {step.actionLabel}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSkipOnboarding}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all"
              >
                Skip onboarding & view dashboard →
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visual Workflow Pipeline Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            Automated Publishing Pipeline
          </h3>
          <span className="text-xs font-semibold text-indigo-600">
            {stats.draft} drafts waiting for review
          </span>
        </div>
        
        {/* Pipeline Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 relative">
          {workflowSteps.map((step, idx) => {
            const isCurrent = idx === activeWorkflowIndex;
            const isDone = step.done;
            
            return (
              <div 
                key={step.label}
                className={cn(
                  "p-3.5 rounded-xl border flex flex-col justify-between transition-all text-left",
                  isDone 
                    ? "border-emerald-100 bg-emerald-50/20 text-emerald-950" 
                    : isCurrent 
                      ? "border-indigo-200 bg-indigo-50/30 ring-2 ring-indigo-600 ring-offset-2 text-indigo-950" 
                      : "border-gray-100 bg-gray-50/50 text-gray-400"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
                    Phase 0{idx + 1}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                  ) : (
                    <Circle className="w-3 h-3 text-gray-300" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{step.label}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Metrics Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Generated Posts</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.generated}</p>
          <p className="text-[11px] text-gray-500 mt-1">Cumulative lifetime content batches</p>
          <Link href="/generate" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.draft}</p>
          <p className="text-[11px] text-gray-500 mt-1">Drafts awaiting editor approval</p>
          <Link href="/drafts" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scheduled Posts</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.approved}</p>
          <p className="text-[11px] text-gray-500 mt-1">Approved & queued for social syndication</p>
          <Link href="/drafts" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Published Posts</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{stats.published}</p>
          <p className="text-[11px] text-gray-500 mt-1">Successfully synced with Buffer queue</p>
          <Link href="/drafts" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left pane: System health and actions (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Connection cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              System Health & Integrity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand Profile Status */}
              <div className={cn(
                "p-4 rounded-xl border flex items-center justify-between transition-all",
                stats.hasBrand ? "border-emerald-100 bg-white" : "border-amber-100 bg-amber-50/5"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    stats.hasBrand ? "bg-emerald-50 text-emerald-600" : "bg-amber-50/50 text-amber-600"
                  )}>
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Brand Profile</h4>
                    <p className="text-sm font-bold text-gray-900">
                      {stats.hasBrand ? (brandName || "Configured") : "Incomplete Profile"}
                    </p>
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {stats.hasBrand ? "Edit" : "Set Up →"}
                </Link>
              </div>

              {/* OpenAI Status */}
              <div className={cn(
                "p-4 rounded-xl border flex items-center justify-between transition-all",
                stats.hasOpenAI ? "border-emerald-100 bg-white" : "border-rose-100 bg-rose-50/5"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    stats.hasOpenAI ? "bg-emerald-50 text-emerald-600" : "bg-rose-50/50 text-rose-600"
                  )}>
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">OpenAI API</h4>
                    <p className="text-sm font-bold text-gray-900">
                      {stats.hasOpenAI ? "Connected" : "API Offline"}
                    </p>
                  </div>
                </div>
                <Link 
                  href="/settings" 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {stats.hasOpenAI ? "Edit" : "Connect →"}
                </Link>
              </div>

              {/* Buffer Status */}
              <div className={cn(
                "p-4 rounded-xl border flex items-center justify-between transition-all",
                stats.hasBuffer ? "border-emerald-100 bg-white" : "border-gray-200 bg-gray-50/10"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    stats.hasBuffer ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                  )}>
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Buffer Publishing</h4>
                    <p className="text-sm font-bold text-gray-900">
                      {stats.hasBuffer ? "Connected" : "Not Connected"}
                    </p>
                  </div>
                </div>
                <Link 
                  href="/settings" 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {stats.hasBuffer ? "Edit" : "Connect →"}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                href="/generate" 
                className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-36"
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Create Content</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Kick off a new post batch wizard</p>
                </div>
              </Link>

              <Link 
                href="/drafts" 
                className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-36"
              >
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Review Drafts</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Approve or reject generated posts</p>
                </div>
              </Link>

              <Link 
                href="/drafts" 
                className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-36"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Publish Queue</h4>
                  <p className="text-xs text-gray-500 mt-0.5">View scheduled and sent queue status</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Context-aware Empty States Block */}
          {stats.generated === 0 && (
            <div className="bg-white p-6 border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center py-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Your Content Feed is Quiet</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md">
                You have connected your brand profile and AI keys. Let&apos;s create your first batch of automated social media drafts.
              </p>
              <Link 
                href="/generate"
                className={cn(buttonVariants({ size: 'sm' }), "mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 h-9 font-bold shadow-sm")}
              >
                ✨ Generate Content
              </Link>
            </div>
          )}
        </div>

        {/* Right pane: Recent activity log (1/3 width) */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            Recent Activity Log
          </h3>
          <Card className="border-gray-100 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-5 space-y-5">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((log, logIdx) => (
                      <li key={log.id}>
                        <div className="relative pb-8">
                          {logIdx !== recentActivity.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-white text-white",
                                log.action.includes('generate') 
                                  ? "bg-indigo-500" 
                                  : log.action.includes('approve') 
                                    ? "bg-amber-500" 
                                    : "bg-emerald-500"
                              )}>
                                <Activity className="w-4 h-4" />
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5">
                              <p className="text-xs font-bold text-gray-900 capitalize">
                                {log.action.replace('_', ' ')}
                              </p>
                              {log.topic && (
                                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                                  Topic: {log.topic}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1">
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
                <div className="text-center py-8">
                  <p className="text-xs text-gray-400">ยังไม่มีคอนเทนต์ / No activity logs recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
