/* eslint-disable -- Allowing console logs for debugging purposes*/
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
export const navItems = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.dashboard, icon: 'chart-pie' },
  { key: 'user', title: 'Users', href: paths.dashboard.vendor, icon: 'users' },
  
  { key: 'payments', title: 'Payments', href: paths.dashboard.payments, icon: 'credit-card' },

  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  
] satisfies NavItemConfig[];
