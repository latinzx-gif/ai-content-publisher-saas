import { Crown, LockKeyhole, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PremiumFeatureHero() {
  return (
    <section className="rounded-xl border border-[#E6DFD5] bg-[#F8F5F0] px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
              <Crown className="h-3 w-3" />
              Premium
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E6DFD5] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C756C] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <LockKeyhole className="h-3 w-3" />
              Locked Preview
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1E1D1B] dark:text-[#EBE7E0]">
            Campaign Factory
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7C756C] dark:text-slate-400">
            Preview the future premium workflow for planning 30-day campaigns, generating queued content,
            routing images, and preparing approved posts for scheduling.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button disabled className="h-10 rounded-xl px-5 text-xs">
            <Sparkles className="h-4 w-4" />
            Upgrade to Unlock
          </Button>
          <Button disabled variant="outline" className="h-10 rounded-xl px-5 text-xs">
            View V2 Scope
          </Button>
        </div>
      </div>
    </section>
  )
}
