import { ListChecks } from 'lucide-react'
import { mockCampaignFactory } from '@/data/mock-campaign-factory'
import { LockedPreviewCard } from './locked-preview-card'

export function ContentQueueMockup() {
  return (
    <LockedPreviewCard
      title="Content Queue Dashboard"
      eyebrow="Text Generation Queue"
      description="Mock queue columns for campaign posts before review and approval."
      icon={ListChecks}
      className="lg:col-span-2"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {mockCampaignFactory.queue.map((column) => (
          <div key={column.label} className="rounded-lg border border-[#E6DFD5] bg-[#F8F5F0] p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#1E1D1B] dark:text-slate-100">{column.label}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#7C756C] dark:bg-slate-950 dark:text-slate-400">
                {column.count}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {column.items.map((item) => (
                <div key={item.title} className="rounded-lg border border-[#E6DFD5]/70 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="line-clamp-1 text-xs font-semibold text-[#1E1D1B] dark:text-slate-200">{item.title}</p>
                  <p className="mt-1 text-[10px] text-[#7C756C] dark:text-slate-500">{item.detail}</p>
                  <span className="mt-2 inline-flex rounded-full bg-[#EBE6DF] px-2 py-0.5 text-[10px] font-bold text-[#7C756C] dark:bg-slate-800 dark:text-slate-400">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LockedPreviewCard>
  )
}
