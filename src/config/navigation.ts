import { 
  LayoutDashboard, 
  Sparkles, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Fingerprint, 
  Link2, 
  type LucideIcon 
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  subtitle?: string; // Add subtitle for navbar description
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigationConfig = {
  sections: [
    {
      label: 'Workspace',
      items: [
        {
          title: 'Command Deck',
          href: '/',
          icon: LayoutDashboard,
          description: 'ศูนย์ควบคุมการดำเนินงานคอนเทนต์',
          subtitle: 'Operational workspace for your content business.'
        },
        {
          title: 'Editor Canvas',
          href: '/generate',
          icon: Sparkles,
          description: 'สตูดิโอสร้างคอนเทนต์ด้วย AI',
          subtitle: 'Compose fresh content drafts from your brand context.'
        },
        {
          title: 'Pipeline Board',
          href: '/drafts',
          icon: CheckSquare,
          description: 'บอร์ดตรวจสอบและปรับแต่งโพสต์',
          subtitle: 'Refine, approve, and queue your content drafts.'
        },
        {
          title: 'Social Scheduler',
          href: '/calendar',
          icon: CalendarIcon,
          description: 'ตารางเวลาการเผยแพร่คอนเทนต์',
          subtitle: 'Plan and schedule approved posts across visual slots.'
        }
      ]
    },
    {
      label: 'Engine Settings',
      items: [
        {
          title: 'Brand Engine',
          href: '/profile',
          icon: Fingerprint,
          description: 'จัดการตัวตนและน้ำเสียงของแบรนด์',
          subtitle: 'Configure your company persona, voice guidelines, and target profiles.'
        },
        {
          title: 'Publishing Channels',
          href: '/settings',
          icon: Link2,
          description: 'จัดการการเชื่อมต่อ API และช่องทางโซเชียล',
          subtitle: 'Manage secure API key vaults for OpenAI and Buffer.'
        }
      ]
    }
  ] as NavSection[]
};
