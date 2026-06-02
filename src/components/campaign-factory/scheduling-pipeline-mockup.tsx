import { Clock3 } from 'lucide-react'
import { mockCampaignFactory } from '@/data/mock-campaign-factory'
import { LockedPreviewCard } from './locked-preview-card'

export function SchedulingPipelineMockup() {
  return (
    <LockedPreviewCard
      title="Scheduling Pipeline Mockup"
      eyebrow="Approved Assets to Buffer"
      description="A locked queue preview for scheduled campaign posts after text and image approval."
      icon={Clock3}
    >
      <div className="space-y-3">
        {mockCampaignFactory.schedulePipeline.map((item) => (
          <div key={`${item.day}-${item.time}-${item.title}`} className="flex items-start gap-3 rounded-lg border border-[#E6DFD5] bg-[#F8F5F0] p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="w-14 shrink-0 rounded-lg bg-white px-2 py-2 text-center dark:bg-slate-950">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7C756C] dark:text-slate-500">{item.day}</p>
              <p className="mt-1 text-xs font-semibold text-[#1E1D1B] dark:text-slate-100">{item.time}</p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#7C756C] dark:bg-slate-950 dark:text-slate-400">{item.platform}</span>
                <span className="rounded-full bg-[#EBE6DF] px-2 py-0.5 text-[10px] font-bold text-[#7C756C] dark:bg-slate-800 dark:text-slate-400">{item.status}</span>
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-[#1E1D1B] dark:text-slate-100">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </LockedPreviewCard>
  )
}
