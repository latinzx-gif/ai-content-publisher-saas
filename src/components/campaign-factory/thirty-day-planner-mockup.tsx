import { CalendarDays } from 'lucide-react'
import { mockCampaignFactory } from '@/data/mock-campaign-factory'
import { LockedPreviewCard } from './locked-preview-card'

export function ThirtyDayPlannerMockup() {
  const days = mockCampaignFactory.planner.days

  return (
    <LockedPreviewCard
      title="30-Day Planner Mockup"
      eyebrow="Campaign Planning"
      description="A locked planning surface for duration, daily volume, themes, and platform mix."
      icon={CalendarDays}
      className="lg:col-span-2"
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          ['Duration', `${mockCampaignFactory.planner.durationDays} days`],
          ['Posts per day', `${mockCampaignFactory.planner.postsPerDay} posts`],
          ['Objective', mockCampaignFactory.planner.objective],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[#E6DFD5] bg-[#F8F5F0] px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7C756C] dark:text-slate-500">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#1E1D1B] dark:text-slate-100">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => (
          <div key={day.day} className="min-h-40 rounded-lg border border-[#E6DFD5] bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7C756C] dark:text-slate-500">{day.date}</p>
                <h3 className="mt-1 text-sm font-semibold text-[#1E1D1B] dark:text-slate-100">Day {day.day}</h3>
              </div>
              <span className="rounded-full bg-[#EBE6DF] px-2 py-1 text-[10px] font-bold text-[#7C756C] dark:bg-slate-800 dark:text-slate-400">
                {day.posts.length} posts
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-[#1E1D1B] dark:text-slate-200">{day.theme}</p>
            <div className="mt-3 space-y-2">
              {day.posts.map((post) => (
                <div key={`${day.day}-${post.title}`} className="rounded-md bg-[#F8F5F0] px-2.5 py-2 dark:bg-slate-950">
                  <p className="truncate text-xs font-medium text-[#1E1D1B] dark:text-slate-200">{post.title}</p>
                  <p className="mt-0.5 text-[10px] text-[#7C756C] dark:text-slate-500">{post.platform} / {post.status}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LockedPreviewCard>
  )
}
