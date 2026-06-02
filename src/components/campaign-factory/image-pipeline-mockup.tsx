import { ImageIcon } from 'lucide-react'
import { mockCampaignFactory } from '@/data/mock-campaign-factory'
import { LockedPreviewCard } from './locked-preview-card'

export function ImagePipelineMockup() {
  return (
    <LockedPreviewCard
      title="Image Pipeline Mockup"
      eyebrow="Approved Text to Visuals"
      description="A future review layer for generated image prompts and visual candidates."
      icon={ImageIcon}
    >
      <div className="space-y-3">
        {mockCampaignFactory.imagePipeline.map((item, index) => (
          <div key={item.title} className="grid gap-3 rounded-lg border border-[#E6DFD5] bg-[#F8F5F0] p-3 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[88px_1fr]">
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[#D8CEC0] bg-white text-[#7C756C] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500">
              <span className="text-lg font-semibold">0{index + 1}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-[#1E1D1B] dark:text-slate-100">{item.title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#7C756C] dark:bg-slate-950 dark:text-slate-400">
                  {item.aspectRatio}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7C756C] dark:text-slate-400">{item.prompt}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">{item.stage}</p>
            </div>
          </div>
        ))}
      </div>
    </LockedPreviewCard>
  )
}
