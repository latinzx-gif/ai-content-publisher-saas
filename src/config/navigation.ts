import { PenTool, FileText, User, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navigationConfig = {
  sidebarNav: [
    {
      title: 'Generate',
      href: '/generate',
      icon: PenTool,
    },
    {
      title: 'Drafts',
      href: '/drafts',
      icon: FileText,
    },
    {
      title: 'Brand Profile',
      href: '/profile',
      icon: User,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ] as NavItem[],
};
