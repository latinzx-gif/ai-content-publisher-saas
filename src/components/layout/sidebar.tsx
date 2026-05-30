'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-white w-72 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
      <div className="p-8">
        <Link href="/generate" className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter text-blue-600 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <Rocket className="w-6 h-6 fill-current" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Publisher
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        {navigationConfig.sidebarNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'w-full justify-start gap-4 px-4 py-6 rounded-xl transition-all duration-200',
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Milestone 1</span>
          </div>
          <h4 className="text-sm font-bold mb-1">Generate → Review</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            AI Content Pipeline is active and ready for production testing.
          </p>
        </div>
      </div>
    </div>
  );
}
