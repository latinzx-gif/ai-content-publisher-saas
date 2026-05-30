'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Send,
  Fingerprint,
  Link2,
  Plus,
  Sparkles,
  Cpu,
  Layers,
  Check,
  X,
  FileEdit,
  Volume2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { generatePosts } from '@/actions/generate';
import { approvePost, rejectPost } from '@/actions/drafts';
import { sendPostToBuffer } from '@/actions/publish';
import { toast } from 'sonner';
import { Post } from '@/types';

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
  stats: initialStats, 
  brandData,
  posts: initialPosts
}: DashboardClientProps) {
  // Live state for interactive updates
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [stats, setStats] = useState(initialStats);
  
  // Scratchpad state
  const [scratchpadText, setScratchpadText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);

  const stages = [
    { label: 'Ingesting Context', desc: 'Analyzing brand profile parameters and scratchpad prompt' },
    { label: 'Synthesizing Drafts', desc: 'Drafting multi-format social posts via GPT-4o context engines' },
    { label: 'Structuring Deliverables', desc: 'Formatting hooks, captions, and hashtags' },
    { label: 'Committed to OS Pipeline', desc: 'Committing post records to active workspace database' }
  ];

  // Inline Actions
  async function handleApprove(postId: string) {
    // Optimistic UI update
    const previousPosts = [...posts];
    setPosts(posts.map(p => p.id === postId ? { ...p, status: 'approved' } : p));
    setStats(prev => ({
      ...prev,
      draft: Math.max(0, prev.draft - 1),
      approved: prev.approved + 1
    }));
    
    try {
      await approvePost(postId);
      toast.success('Post approved in pipeline.');
    } catch {
      setPosts(previousPosts);
      setStats(initialStats);
      toast.error('Failed to approve post.');
    }
  }

  async function handleReject(postId: string) {
    const previousPosts = [...posts];
    setPosts(posts.map(p => p.id === postId ? { ...p, status: 'rejected' } : p));
    setStats(prev => ({
      ...prev,
      draft: Math.max(0, prev.draft - 1)
    }));

    try {
      await rejectPost(postId);
      toast.success('Post rejected from active list.');
    } catch {
      setPosts(previousPosts);
      setStats(initialStats);
      toast.error('Failed to reject post.');
    }
  }

  async function handlePublish(postId: string) {
    if (!stats.hasBuffer) {
      toast.error('Connect your Buffer account in settings first.');
      return;
    }

    toast.loading('Dispatching post to Buffer queue...', { id: postId });
    try {
      const result = await sendPostToBuffer(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, status: 'published' } : p));
      setStats(prev => ({
        ...prev,
        approved: Math.max(0, prev.approved - 1),
        published: prev.published + 1
      }));
      toast.success('Dispatched to Buffer queue!', { id: postId });
      if (result.externalUrl) {
        window.open(result.externalUrl, '_blank');
      }
    } catch {
      toast.error('Failed to dispatch to Buffer.', { id: postId });
    }
  }

  // Handle scratchpad synthesis
  async function handleSynthesize() {
    if (!scratchpadText.trim()) {
      toast.error('Please type a content idea first.');
      return;
    }
    if (!stats.hasOpenAI) {
      toast.error('Please link your OpenAI API key in settings.');
      return;
    }
    if (!stats.hasBrand) {
      toast.error('Please configure your Brand Profile first.');
      return;
    }

    setIsGenerating(true);
    setGenerationStage(0);

    const intervalId = setInterval(() => {
      setGenerationStage(prev => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    try {
      await generatePosts({
        topic: scratchpadText,
        tone: brandData?.tone || 'Professional',
        personality: brandData?.personality || 'น่าเชื่อถือ',
        postCount: 5
      });
      
      toast.success(`Success! Generated 5 fresh drafts.`);
      setScratchpadText('');
      
      // Reload posts from DB or simple reload window since server actions update next cache
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error generating content';
      toast.error(message);
    } finally {
      clearInterval(intervalId);
      setIsGenerating(false);
    }
  }

  // Columns for Linear-style Board
  const draftPosts = posts.filter(p => p.status === 'draft');
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const publishedPosts = posts.filter(p => p.status === 'published' || p.status === 'failed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8 pb-16 animate-in fade-in duration-500">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <span className="text-[9px] font-black uppercase text-indigo-650 dark:text-indigo-400 tracking-[0.25em]">Content OS</span>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-150 tracking-tight font-heading">
            Workspace Command Deck
          </h1>
          <p className="text-slate-450 dark:text-slate-500 text-xs mt-1">
            Operating dashboard for <span className="font-bold text-slate-700 dark:text-slate-300">{userEmail}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/generate" className={cn(buttonVariants({ size: 'xs', variant: 'outline' }), "rounded-lg text-[10px] font-bold h-8 border-slate-200 bg-white hover:bg-slate-50")}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            AI Composer
          </Link>
          <Link href="/settings" className={cn(buttonVariants({ size: 'xs', variant: 'outline' }), "rounded-lg text-[10px] font-bold h-8 border-slate-200 bg-white hover:bg-slate-50")}>
            <Link2 className="w-3.5 h-3.5 mr-1" />
            Channels
          </Link>
        </div>
      </div>

      {/* 2. Notion-Style Scratchpad & Brand GUID HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Notion-style interactive scratchpad */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400">
                <FileEdit className="w-3 h-3" />
              </span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Notion-Style Scratchpad</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Synthesis Deck
            </span>
          </div>

          {isGenerating ? (
            <div className="py-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-100 dark:border-slate-800 border-t-indigo-600" />
                <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">OS AI Composer active...</h4>
                <p className="text-slate-400 dark:text-slate-500 text-xs max-w-sm mx-auto">
                  Transforming scratchpad idea into multiple channel distribution drafts.
                </p>
              </div>

              {/* Progress logger terminal widget */}
              <div className="max-w-md mx-auto text-left bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] space-y-2 shadow-inner">
                {stages.map((stage, idx) => {
                  const isCompleted = generationStage > idx;
                  const isActive = generationStage === idx;
                  return (
                    <div key={idx} className={cn("flex items-start gap-2 transition-opacity", !isCompleted && !isActive ? "opacity-30" : "opacity-100")}>
                      <span className={cn("font-bold", isCompleted ? "text-emerald-500" : isActive ? "text-indigo-400" : "text-slate-700")}>
                        {isCompleted ? '✓' : isActive ? '▶' : '•'}
                      </span>
                      <div>
                        <span className={cn("font-bold", isActive ? "text-indigo-400" : "text-slate-350")}>{stage.label}</span>
                        {isActive && <span className="block text-slate-500 mt-0.5">{stage.desc}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="💡 Jot down a content concept, brief brief, or direct legal tip to synthesis (e.g. '3 tips on Labor Law severance calculations' or 'PDPA consent updates for service business website')..."
                className="w-full min-h-[120px] bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none resize-none font-medium leading-relaxed"
              />
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">
                  Press compile to generate 5 social drafts formatted automatically.
                </span>
                <Button 
                  onClick={handleSynthesize}
                  className="bg-indigo-600 hover:bg-indigo-755 text-white font-black text-xs rounded-xl h-9 px-4 gap-1.5 active:scale-[0.98] transition-all"
                  disabled={!scratchpadText.trim()}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Synthesize Drafts
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Brand Guideline HUD sidebar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-50 dark:bg-purple-950 text-purple-650 dark:text-purple-400">
              <Fingerprint className="w-3 h-3" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Brand Context HUD</h3>
          </div>

          {brandData ? (
            <div className="space-y-3.5 text-xs text-left">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Brand & Business</span>
                <p className="font-bold text-slate-850 dark:text-slate-250 truncate">{brandData.name} • <span className="font-medium text-slate-500">{brandData.business_type}</span></p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Audience Persona</span>
                <p className="font-medium text-slate-650 dark:text-slate-400 line-clamp-1 leading-normal">
                  <Users className="w-3 h-3 inline mr-1 text-slate-400" />
                  {brandData.target_audience}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-50 dark:border-slate-800">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Active Tone</span>
                  <p className="font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    {brandData.tone}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Voice Style</span>
                  <p className="font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    {brandData.personality}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 font-medium mb-3">No active brand profile linked.</p>
              <Link href="/profile" className={cn(buttonVariants({ size: 'xs', variant: 'outline' }), "rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600")}>
                Configure HUD Guidelines
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* 3. Linear-Style Kanban Content Pipeline */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-650 dark:text-emerald-400">
              <Layers className="w-3 h-3" />
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Active Workflow Board</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Drag posts status or approve inline
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Column 1: Drafts needing review */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 min-h-[400px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/60 mb-2">
              <span className="text-xs font-bold text-slate-750 dark:text-slate-250 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-450 animate-pulse" />
                In Review Drafts
              </span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">
                {draftPosts.length}
              </span>
            </div>
            
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {draftPosts.map(post => {
                const meta = post.metadata || {};
                return (
                  <div key={post.id} className="bg-white dark:bg-slate-900 p-3.5 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-750 transition-all group">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        {meta.platform || 'General'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">
                        {meta.title || post.content.split('\n')[0] || 'Untitled Draft'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {meta.caption || post.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/80">
                      <button 
                        onClick={() => handleReject(post.id)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-colors"
                        title="Reject Draft"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleApprove(post.id)}
                        className="p-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 text-[10px] font-bold px-2.5"
                        title="Approve Draft"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>
                );
              })}
              {draftPosts.length === 0 && (
                <div className="py-12 text-center text-slate-400 dark:text-slate-600 text-xs font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No pending drafts.
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Approved / Scheduled queue */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 min-h-[400px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/60 mb-2">
              <span className="text-xs font-bold text-slate-750 dark:text-slate-250 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Approved & Ready
              </span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">
                {approvedPosts.length}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {approvedPosts.map(post => {
                const meta = post.metadata || {};
                return (
                  <div key={post.id} className="bg-white dark:bg-slate-900 p-3.5 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-750 transition-all group">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-650 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        {meta.platform || 'General'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">
                        {meta.title || post.content.split('\n')[0] || 'Untitled Draft'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {meta.caption || post.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/80">
                      <button 
                        onClick={() => handlePublish(post.id)}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-black shadow-sm"
                        title="Send to Buffer"
                      >
                        <Send className="w-3 h-3" /> Dispatch to Buffer
                      </button>
                    </div>
                  </div>
                );
              })}
              {approvedPosts.length === 0 && (
                <div className="py-12 text-center text-slate-400 dark:text-slate-600 text-xs font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No approved drafts ready.
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Published and activity timeline */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 min-h-[400px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/60 mb-2">
              <span className="text-xs font-bold text-slate-750 dark:text-slate-250 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Pushed Live / Log
              </span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">
                {publishedPosts.length}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {publishedPosts.map(post => {
                const meta = post.metadata || {};
                return (
                  <div key={post.id} className="bg-white dark:bg-slate-900 p-3 border border-slate-200/50 dark:border-slate-805 rounded-xl shadow-xs space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className={cn(
                        "font-bold px-1.5 py-0.5 rounded uppercase tracking-wide",
                        post.status === 'published' ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-650"
                      )}>
                        {post.status}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-350 truncate">
                      {meta.title || post.content.split('\n')[0] || 'Untitled Post'}
                    </h4>
                  </div>
                );
              })}

              {publishedPosts.length === 0 && (
                <div className="py-12 text-center text-slate-400 dark:text-slate-600 text-xs font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No published history.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
