'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { buttonVariants } from '@/components/ui/button';
import { ChevronDown, Check, Briefcase } from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ isSingleOwner = false }: { isSingleOwner?: boolean }) {
  const pathname = usePathname();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  return (
    <div className="flex flex-col h-full border-r border-slate-200/60 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 w-64 shrink-0 select-none">
      {/* Workspace Selector Dropdown Header */}
      <div className="p-4 border-b border-slate-100/80 dark:border-slate-800/80 relative">
        <div 
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 active:scale-[0.98] group"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/10 shrink-0">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight truncate leading-tight">
              Content OS Studio
            </span>
            <span className="block text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider leading-none mt-0.5">
              Production Workspace
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors shrink-0" />
        </div>

        {/* Workspace Dropdown Panel */}
        {showWorkspaceMenu && (
          <div className="absolute top-16 left-4 right-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-805 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-50 dark:border-slate-800 mb-1">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest px-2 py-0.5">Active Workspace</p>
            </div>
            <button 
              onClick={() => setShowWorkspaceMenu(false)}
              className="flex items-center justify-between w-full p-2 text-left rounded-xl bg-slate-55 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/40 rounded-md flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px] font-black">C</div>
                <span>Content OS Studio</span>
              </div>
              <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </button>
            <div className="mt-2 p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed text-center px-1">
                Workspace synced with database rules & Supabase auth.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Directory Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navigationConfig.sections.map((section) => (
          <div key={section.label} className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-400/80 dark:text-slate-500/85 uppercase tracking-[0.18em] px-3.5 mb-1.5">
              {section.label}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 border-none',
                      isActive 
                        ? 'bg-slate-150/80 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-bold shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-150/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                    <span className="text-xs font-semibold tracking-tight">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Simplified Minimal Footer */}
      <div className="p-4 border-t border-slate-100/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">Content Pipeline Live</span>
        </div>
        {isSingleOwner && (
          <span className="text-[8px] bg-slate-205 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
            Owner Mode
          </span>
        )}
      </div>
    </div>
  );
}
