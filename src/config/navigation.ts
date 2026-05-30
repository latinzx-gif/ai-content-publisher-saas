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
      label: 'Overview',
      items: [
        {
          title: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
          description: 'ภาพรวมระบบและสถานะงาน',
          subtitle: 'Welcome back. Here is your content operation center.'
        }
      ]
    },
    {
      label: 'Content',
      items: [
        {
          title: 'Create Content',
          href: '/generate',
          icon: Sparkles,
          description: 'สร้างคอนเทนต์ใหม่ด้วย AI',
          subtitle: 'Generate 5 or 10 posts from your brand context.'
        },
        {
          title: 'Review Content',
          href: '/drafts',
          icon: CheckSquare,
          description: 'ตรวจสอบและอนุมัติโพสต์',
          subtitle: 'Approve, edit, and publish generated content drafts.'
        },
        {
          title: 'Content Calendar',
          href: '/calendar',
          icon: CalendarIcon,
          description: 'ตารางเวลาการเผยแพร่',
          subtitle: 'Schedule and manage approved posts visually.'
        }
      ]
    },
    {
      label: 'Configuration',
      items: [
        {
          title: 'Brand Profile',
          href: '/profile',
          icon: Fingerprint,
          description: 'ตัวตนแบรนด์และน้ำเสียง',
          subtitle: 'Configure your target audience, industry guidelines, and voice.'
        },
        {
          title: 'Integrations',
          href: '/settings',
          icon: Link2,
          description: 'การเชื่อมต่อ API',
          subtitle: 'Link external services like OpenAI keys and Buffer accounts.'
        }
      ]
    }
  ] as NavSection[]
};
