'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { navigationConfig } from '@/config/navigation';

export function Navbar({ isSingleOwner = false }: { isSingleOwner?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Find active nav item across sections
  let currentNav;
  for (const section of navigationConfig.sections) {
    const match = section.items.find(item => item.href === pathname);
    if (match) {
      currentNav = match;
      break;
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  const pageTitle = currentNav?.title || 'Dashboard';
  const pageSubtitle = currentNav?.subtitle || 'Welcome back. Here is your content operation center.';

  return (
    <header className="h-20 border-b flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
          {pageTitle}
        </h2>
        <div className="text-xs text-slate-500 font-medium mt-0.5">
          {pageSubtitle}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isSingleOwner ? (
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Single Owner Mode
          </span>
        ) : (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
              <UserIcon className="h-4 w-4" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="rounded-lg gap-2 text-slate-600 border-slate-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-semibold text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
