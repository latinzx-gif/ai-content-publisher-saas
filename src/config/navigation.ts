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
}

export const navigationConfig = {
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'ภาพรวมระบบและสถานะงาน'
    },
    {
      title: 'Create Content',
      href: '/generate',
      icon: Sparkles,
      description: 'สร้างคอนเทนต์ใหม่ด้วย AI'
    },
    {
      title: 'Review Content',
      href: '/drafts',
      icon: CheckSquare,
      description: 'ตรวจสอบและอนุมัติโพสต์'
    },
    {
      title: 'Content Calendar',
      href: '/calendar',
      icon: CalendarIcon,
      description: 'ตารางเวลาการเผยแพร่'
    },
    {
      title: 'Brand Profile',
      href: '/profile',
      icon: Fingerprint,
      description: 'ตัวตนแบรนด์และน้ำเสียง'
    },
    {
      title: 'Integrations',
      href: '/settings',
      icon: Link2,
      description: 'การเชื่อมต่อ API'
    },
  ] as NavItem[],
};
