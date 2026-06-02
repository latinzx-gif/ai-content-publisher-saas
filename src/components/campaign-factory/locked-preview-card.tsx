import type { ReactNode } from 'react'
import { LockKeyhole, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type LockedPreviewCardProps = {
  title: string
  eyebrow: string
  description?: string
  icon: LucideIcon
  className?: string
  children: ReactNode
}

export function LockedPreviewCard({
  title,
  eyebrow,
  description,
  icon: Icon,
  className,
  children,
}: LockedPreviewCardProps) {
  return (
    <section className={cn('relative overflow-hidden rounded-xl border border-[#E6DFD5] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', className)}>
      <div className="flex items-start justify-between gap-4 border-b border-[#E6DFD5]/70 px-5 py-4 dark:border-slate-800">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EBE6DF] text-[#1E1D1B] dark:bg-slate-800 dark:text-slate-100">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7C756C] dark:text-slate-500">{eyebrow}</p>
            <h2 className="mt-1 text-base font-semibold tracking-tight text-[#1E1D1B] dark:text-[#EBE7E0]">{title}</h2>
            {description ? (
              <p className="mt-1 text-xs leading-5 text-[#7C756C] dark:text-slate-400">{description}</p>
            ) : null}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          <LockKeyhole className="h-3 w-3" />
          Locked
        </span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-end bg-white/35 p-4 dark:bg-slate-950/30">
          <div className="rounded-lg border border-[#E6DFD5] bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#7C756C] shadow-sm dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-400">
            V2 Premium Preview
          </div>
        </div>
        <div className="p-5 opacity-90">{children}</div>
      </div>
    </section>
  )
}
