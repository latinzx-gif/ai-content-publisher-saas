import { PremiumFeatureHero } from './premium-feature-hero'
import { ThirtyDayPlannerMockup } from './thirty-day-planner-mockup'
import { ContentQueueMockup } from './content-queue-mockup'
import { ImagePipelineMockup } from './image-pipeline-mockup'
import { SchedulingPipelineMockup } from './scheduling-pipeline-mockup'

export function CampaignFactoryPreview() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden pb-20">
      <PremiumFeatureHero />
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <ThirtyDayPlannerMockup />
        <ContentQueueMockup />
        <ImagePipelineMockup />
        <SchedulingPipelineMockup />
      </div>
    </div>
  )
}
