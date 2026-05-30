import { Sparkles, Library, Fingerprint, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navigationConfig = {
  sidebarNav: [
    {
      title: 'สร้างคอนเทนต์',
      href: '/generate',
      icon: Sparkles,
    },
    {
      title: 'คลังเนื้อหา',
      href: '/drafts',
      icon: Library,
    },
    {
      title: 'ตัวตนแบรนด์',
      href: '/profile',
      icon: Fingerprint,
    },
    {
      title: 'การตั้งค่า',
      href: '/settings',
      icon: Settings,
    },
  ] as NavItem[],
};
