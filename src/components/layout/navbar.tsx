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
    <header className="h-14 border-b border-slate-100 bg-[#FAFBFB]/85 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 select-none">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold">Workspace</span>
        <span className="text-slate-300 font-normal">/</span>
        <span className="text-slate-800 font-bold">{pageTitle}</span>
        <span className="hidden lg:inline-block text-slate-300 font-normal mx-2">|</span>
        <span className="hidden lg:inline-block text-[10px] text-slate-400 font-medium">{pageSubtitle}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {isSingleOwner ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200/60 gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Owner Mode
          </span>
        ) : (
          <>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-650 border border-indigo-100 shadow-sm">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
            <Button 
              variant="outline" 
              size="xs" 
              onClick={handleSignOut}
              className="rounded-lg gap-1.5 text-slate-600 border-slate-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-semibold text-xs h-7 px-2.5"
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
