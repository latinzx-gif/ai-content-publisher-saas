'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { buttonVariants } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-gray-50/40 w-64">
      <div className="p-6">
        <Link href="/generate" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            AI
          </div>
          <span>Publisher</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navigationConfig.sidebarNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'w-full justify-start gap-3',
                isActive ? 'bg-gray-200 text-blue-600 font-semibold' : 'text-gray-600'
              )}
            >
              <Icon className="w-5 h-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
         {/* Future User Profile / Logout section */}
      </div>
    </div>
  );
}
