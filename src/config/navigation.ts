import { 
  LayoutGrid, 
  PenLine, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Layers, 
  ShieldCheck, 
  Link2, 
  Settings,
  type LucideIcon 
} from 'lucide-react';

export interface NavItem {
  title: string;
  titleKey: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  subtitle?: string;
  subtitleKey?: string;
}

export interface NavSection {
  label: string;
  labelKey: string;
  items: NavItem[];
}

export const navigationConfig = {
  sections: [
    {
      label: 'Workspace',
      labelKey: 'nav.workspace',
      items: [
        {
          title: 'Operations Dashboard',
          titleKey: 'nav.operationsDashboard',
          href: '/',
          icon: LayoutGrid,
          description: 'ศูนย์ควบคุมการดำเนินงานคอนเทนต์',
          subtitle: 'Oversee bilingual content, review flow, and publishing.',
          subtitleKey: 'deck.subtitle'
        },
        {
          title: 'Editor Canvas',
          titleKey: 'nav.editorCanvas',
          href: '/generate',
          icon: PenLine,
          description: 'สตูดิโอสร้างคอนเทนต์ด้วย AI',
          subtitle: 'Compose fresh content drafts from your brand context.',
          subtitleKey: 'canvas.subtitle'
        },
        {
          title: 'Review Board',
          titleKey: 'nav.reviewBoard',
          href: '/drafts',
          icon: CheckSquare,
          description: 'บอร์ดตรวจสอบและปรับแต่งโพสต์',
          subtitle: 'Refine, approve, and queue your content drafts.',
          subtitleKey: 'board.subtitle'
        },
        {
          title: 'Calendar & Publishing',
          titleKey: 'nav.calendarPublishing',
          href: '/calendar',
          icon: CalendarIcon,
          description: 'ตารางเวลาการเผยแพร่คอนเทนต์',
          subtitle: 'Plan and schedule approved posts across visual slots.',
          subtitleKey: 'calendar.subtitle'
        },
        {
          title: 'Asset Composer',
          titleKey: 'nav.assetComposer',
          href: '/asset-composer',
          icon: Layers,
          description: 'เครื่องมือสร้างและจัดการภาพเนื้อหา',
          subtitle: 'Configure visual layouts and typography templates.',
          subtitleKey: 'asset.subtitle'
        }
      ]
    },
    {
      label: 'Engine Settings',
      labelKey: 'nav.engineSettings',
      items: [
        {
          title: 'Brand & Voice',
          titleKey: 'nav.brandVoice',
          href: '/profile',
          icon: ShieldCheck,
          description: 'จัดการตัวตนและน้ำเสียงของแบรนด์',
          subtitle: 'Configure your company persona, voice guidelines, and target profiles.',
          subtitleKey: 'profile.subtitle'
        },
        {
          title: 'Integrations',
          titleKey: 'nav.integrations',
          href: '/settings',
          icon: Link2,
          description: 'จัดการการเชื่อมต่อ API และช่องทางโซเชียล',
          subtitle: 'Manage secure API key vaults for OpenAI and Buffer.',
          subtitleKey: 'settings.subtitle'
        },
        {
          title: 'Settings',
          titleKey: 'nav.settings',
          href: '/settings',
          icon: Settings,
          description: 'การจัดการตั้งค่าทั่วไป',
          subtitle: 'Manage secure API key vaults for OpenAI and Buffer.',
          subtitleKey: 'settings.subtitle'
        }
      ]
    }
  ] as NavSection[]
};
