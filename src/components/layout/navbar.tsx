'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export function Navbar({ isSingleOwner = false }: { isSingleOwner?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { t } = useLanguage();

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

  const pageTitle = currentNav ? currentNav.title : 'Dashboard';

  return (
    <header className="h-14 border-b border-[#E6DFD5] dark:border-slate-800 bg-[#FAF8F5]/85 dark:bg-slate-950/85 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 select-none">
      <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-[#7C756C]">
        <span className="hover:text-[#1E1D1B] transition-colors">Workspace</span>
        <span>/</span>
        <span className="hover:text-[#1E1D1B] transition-colors">Content Operations</span>
        <span>/</span>
        <span className="text-[#1E1D1B] dark:text-[#EBE7E0] font-semibold">{pageTitle}</span>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Language switcher segmented control */}
        <LanguageSwitcher />

        <div className="flex items-center gap-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E1D1B] dark:bg-[#EBE7E0] text-white dark:text-[#1E1D1B] font-bold text-[10px] tracking-wider select-none shadow-sm">
            OS
          </div>
          <button 
            onClick={handleSignOut}
            className="text-[10px] tracking-widest text-[#7C756C] hover:text-[#1E1D1B] dark:hover:text-[#EBE7E0] font-bold transition-colors uppercase cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
