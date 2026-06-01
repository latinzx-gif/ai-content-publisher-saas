'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 select-none text-[11px] font-medium tracking-wider">
      <button
        onClick={() => setLanguage('th')}
        className={cn(
          "transition-all uppercase cursor-pointer",
          currentLanguage === 'th' 
            ? "text-[#1E1D1B] dark:text-[#EBE7E0] font-bold border-b border-[#967F5C]" 
            : "text-[#7C756C] hover:text-[#1E1D1B] dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        TH
      </button>
      <span className="text-[#E6DFD5] dark:text-slate-800">/</span>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "transition-all uppercase cursor-pointer",
          currentLanguage === 'en' 
            ? "text-[#1E1D1B] dark:text-[#EBE7E0] font-bold border-b border-[#967F5C]" 
            : "text-[#7C756C] hover:text-[#1E1D1B] dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        EN
      </button>
    </div>
  );
}
