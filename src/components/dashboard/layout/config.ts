/* eslint-disable -- Allowing console logs for debugging purposes*/
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
export const navItems = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.dashboard, icon: 'chart-pie' },
  { key: 'user', title: 'User Management', href: paths.dashboard.vendor, icon: 'users' },
  { key: 'job', title: 'Job Management', href: paths.dashboard.job_management, icon: 'users' },
  { key: 'blog', title: 'Blog Management', href: paths.dashboard.blog_management, icon: 'users' },
  { key: 'faq', title: 'FAQ Management', href: paths.dashboard.faq_management, icon: 'users' },
  { key: 'content', title: 'Content Management', href: paths.dashboard.content_management, icon: 'users' },
] satisfies NavItemConfig[];
