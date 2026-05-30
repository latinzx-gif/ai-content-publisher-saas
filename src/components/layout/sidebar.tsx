'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

export function Sidebar({ isSingleOwner = false }: { isSingleOwner?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-white w-72 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
      {/* Brand Identity / Logo Header */}
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-3 font-extrabold group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-150 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="block text-base font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
              AI Content Publisher
            </span>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Content OS for Professionals
            </span>
          </div>
        </Link>
      </div>

      {/* Grouped Navigation sections */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navigationConfig.sections.map((section) => (
          <div key={section.label} className="space-y-1.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
              {section.label}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start gap-4 px-4 py-5 rounded-xl transition-all duration-200',
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm hover:bg-indigo-50 hover:text-indigo-700' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                    <span className="text-sm font-semibold tracking-tight">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom status card */}
      <div className="p-6 border-t border-slate-50">
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10">
            <Rocket className="w-20 h-20 rotate-45 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Milestone 1</span>
            {isSingleOwner && (
              <span className="text-[8px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Single Owner</span>
            )}
          </div>
          <h4 className="text-xs font-bold mb-1 relative z-10">Generate → Review → Publish</h4>
          <p className="text-[10px] text-slate-400 leading-normal relative z-10 font-medium">
            Workflow architecture is fully connected.
          </p>
        </div>
      </div>
    </div>
  );
}
