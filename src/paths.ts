export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    dashboard: '/dashboard',
    account: '/dashboard/account',
    vendor: '/dashboard/customers',
    bookings: '/dashboard/integrations',
    payments: '/dashboard/payments',
    categories: '/dashboard/service-categories',
    settings: '/dashboard/settings',
    job_management: '/dashboard/job_management',
    blog_management: '/dashboard/blog_management',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
