export type CampaignPlannerDay = {
  day: number
  date: string
  theme: string
  posts: {
    title: string
    platform: string
    status: string
  }[]
}

export type QueueColumn = {
  label: string
  count: number
  items: {
    title: string
    detail: string
    status: string
  }[]
}

export type ImagePipelineItem = {
  title: string
  prompt: string
  stage: string
  aspectRatio: string
}

export type SchedulePipelineItem = {
  day: string
  time: string
  platform: string
  title: string
  status: string
}

export const mockCampaignFactory = {
  planner: {
    durationDays: 30,
    postsPerDay: 3,
    objective: 'Awareness + Lead Nurture',
    days: [
      {
        day: 1,
        date: 'Mon',
        theme: 'PDPA Essentials',
        posts: [
          { title: 'PDPA consent checklist', platform: 'Facebook', status: 'Planned' },
          { title: 'Data controller duties', platform: 'Instagram', status: 'Planned' },
          { title: 'SME compliance reminder', platform: 'Facebook', status: 'Planned' },
        ],
      },
      {
        day: 2,
        date: 'Tue',
        theme: 'Labour Law',
        posts: [
          { title: 'Probation policy update', platform: 'Facebook', status: 'Planned' },
          { title: 'HR documentation tip', platform: 'Instagram', status: 'Planned' },
          { title: 'Employee handbook clause', platform: 'Facebook', status: 'Planned' },
        ],
      },
      {
        day: 3,
        date: 'Wed',
        theme: 'Contract Risk',
        posts: [
          { title: 'Payment term protection', platform: 'Facebook', status: 'Planned' },
          { title: 'Termination clause warning', platform: 'Instagram', status: 'Planned' },
          { title: 'Supplier agreement audit', platform: 'Facebook', status: 'Planned' },
        ],
      },
      {
        day: 4,
        date: 'Thu',
        theme: 'BOI Promotion',
        posts: [
          { title: 'BOI eligibility basics', platform: 'Facebook', status: 'Planned' },
          { title: 'Investment incentive map', platform: 'Instagram', status: 'Planned' },
          { title: 'Application document prep', platform: 'Facebook', status: 'Planned' },
        ],
      },
      {
        day: 5,
        date: 'Fri',
        theme: 'Tax Planning',
        posts: [
          { title: 'Q2 tax checklist', platform: 'Facebook', status: 'Planned' },
          { title: 'Deductible expense reminder', platform: 'Instagram', status: 'Planned' },
          { title: 'Director tax risk note', platform: 'Facebook', status: 'Planned' },
        ],
      },
      {
        day: 6,
        date: 'Sat',
        theme: 'Founder Q&A',
        posts: [
          { title: 'Most asked legal question', platform: 'Facebook', status: 'Planned' },
          { title: 'Before signing checklist', platform: 'Instagram', status: 'Planned' },
          { title: 'Client scenario breakdown', platform: 'Facebook', status: 'Planned' },
        ],
      },
    ] satisfies CampaignPlannerDay[],
  },
  queue: [
    {
      label: 'Planned',
      count: 90,
      items: [
        { title: 'Day 07 - Contract Checklist', detail: 'Facebook / awareness', status: 'Waiting' },
        { title: 'Day 08 - Tax Tip Series', detail: 'Instagram / education', status: 'Waiting' },
      ],
    },
    {
      label: 'Generating Text',
      count: 18,
      items: [
        { title: 'Day 04 - BOI Benefits', detail: 'Prompt compiled', status: 'Locked' },
        { title: 'Day 05 - PDPA FAQ', detail: 'Brand memory ready', status: 'Locked' },
      ],
    },
    {
      label: 'Ready for Review',
      count: 12,
      items: [
        { title: 'Day 02 - HR Update', detail: 'Caption + hashtags', status: 'Locked' },
        { title: 'Day 03 - Contract Risk', detail: 'Thai language post', status: 'Locked' },
      ],
    },
    {
      label: 'Approved',
      count: 6,
      items: [
        { title: 'Day 01 - PDPA Tip', detail: 'Ready for image queue', status: 'Locked' },
        { title: 'Day 01 - Tax Planning', detail: 'Ready for scheduling', status: 'Locked' },
      ],
    },
  ] satisfies QueueColumn[],
  imagePipeline: [
    {
      title: 'PDPA Compliance Tips',
      prompt: 'Professional Thai business advisory visual with clean office context and compliance checklist motif.',
      stage: 'Image Review',
      aspectRatio: '4:5',
    },
    {
      title: 'Labour Law Update',
      prompt: 'HR manager reviewing policy documents, modern Thai workplace, credible advisory tone.',
      stage: 'Prompt Ready',
      aspectRatio: '1:1',
    },
    {
      title: 'Tax Planning Reminder',
      prompt: 'Premium financial planning desk scene with tax calendar and document stack, no text overlay.',
      stage: 'Generating',
      aspectRatio: '4:5',
    },
  ] satisfies ImagePipelineItem[],
  schedulePipeline: [
    { day: 'Mon', time: '09:00', platform: 'Facebook', title: 'PDPA consent checklist', status: 'Scheduled' },
    { day: 'Wed', time: '13:00', platform: 'Instagram', title: 'Tax planning reminder', status: 'Ready' },
    { day: 'Fri', time: '10:30', platform: 'Facebook', title: 'Contract clause warning', status: 'Buffer Queue' },
    { day: 'Sun', time: '18:00', platform: 'Instagram', title: 'Founder legal Q&A', status: 'Locked' },
  ] satisfies SchedulePipelineItem[],
}
