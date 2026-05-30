'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { navigationConfig } from '@/config/navigation';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const currentNav = navigationConfig.sidebarNav.find(item => item.href === pathname);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  return (
    <header className="h-20 border-b flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {currentNav?.title || 'Dashboard'}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span>AI Content Publisher</span>
          <span>/</span>
          <span className="text-gray-400 capitalize">{pathname.split('/').filter(Boolean)[0] || 'Overview'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
          <UserIcon className="h-5 w-5" />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="rounded-lg gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </Button>
      </div>
    </header>
  );
}
