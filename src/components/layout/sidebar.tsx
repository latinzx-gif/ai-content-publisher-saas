'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { buttonVariants } from '@/components/ui/button';
import { ChevronDown, Check, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';

export function Sidebar({ isSingleOwner = false }: { isSingleOwner?: boolean }) {
  const pathname = usePathname();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full border-r border-[#E6DFD5] dark:border-slate-800 bg-[#F3EFEA] dark:bg-slate-950 w-64 shrink-0 select-none">
      {/* Workspace Selector Dropdown Header */}
      <div className="p-5 border-b border-[#E6DFD5]/70 dark:border-slate-800/80 relative">
        <div 
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-3 px-1 py-1 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex-1 min-w-0">
            <span className="block text-[15px] font-medium tracking-[0.08em] uppercase text-[#1E1D1B] dark:text-[#EBE7E0] font-serif leading-tight">
              Content OS Studio
            </span>
            <span className="block text-[9px] text-[#7C756C] dark:text-slate-400 font-bold uppercase tracking-[0.15em] mt-1 leading-none">
              {t('sidebar.workspace')}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C756C] dark:text-slate-500 group-hover:text-slate-655 dark:group-hover:text-slate-400 transition-colors shrink-0" />
        </div>
 
        {/* Workspace Dropdown Panel */}
        {showWorkspaceMenu && (
          <div className="absolute top-16 left-4 right-4 bg-white dark:bg-slate-900 border border-[#E6DFD5] rounded-xl p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-50 dark:border-slate-800 mb-1">
              <p className="text-[9px] font-black text-slate-455 uppercase tracking-widest px-2 py-0.5">{t('sidebar.activeWorkspace')}</p>
            </div>
            <button 
              onClick={() => setShowWorkspaceMenu(false)}
              className="flex items-center justify-between w-full p-2 text-left rounded-xl bg-slate-55 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#EBE6DF] rounded-md flex items-center justify-center text-slate-800 text-[10px] font-black">C</div>
                <span>Content OS Studio</span>
              </div>
              <Check className="w-3.5 h-3.5 text-indigo-650" />
            </button>
          </div>
        )}
      </div>
 
      {/* Directory Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigationConfig.sections.map((section, sectionIdx) => (
          <div key={section.label} className="space-y-1">
            {sectionIdx > 0 && (
              <div className="border-t border-[#E6DFD5]/70 dark:border-slate-800/80 my-4 mx-1" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
 
                return (
                  <Link
                    key={`${section.label}-${item.title}-${item.href}`}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 border-none h-9.5',
                      isActive 
                        ? 'bg-[#EBE6DF] dark:bg-slate-800 text-[#1E1D1B] dark:text-[#EBE7E0] font-bold shadow-sm' 
                        : 'text-[#7C756C] dark:text-slate-400 hover:bg-[#EBE6DF]/40 dark:hover:bg-slate-800/40 hover:text-[#1E1D1B] dark:hover:text-slate-100'
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#1E1D1B] dark:text-[#EBE7E0]" : "text-[#7C756C]/70 dark:text-slate-500")} />
                    <span className="text-xs font-medium tracking-tight">
                      {/* Resolve menu link text via translations key */}
                      {t(item.titleKey)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
 
      {/* Connection status footer */}
      <div className="p-4 border-t border-[#E6DFD5] bg-[#EBE6DF]/35 dark:bg-slate-900/30 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-[#1E1D1B]/80 dark:text-slate-455 uppercase tracking-[0.1em]">{t('sidebar.pipelineLive')}</span>
        </div>
        <span className="text-[9px] text-[#7C756C] dark:text-slate-500">{t('sidebar.allOperational')}</span>
      </div>
    </div>
  );
}
