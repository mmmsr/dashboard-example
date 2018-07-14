
export default [
  {
    path: '/',
    component: () => import('layouts/login-root'),
    redirect: '/main/chart01',
    children: [
      { path: 'login', component: () => import('pages/auth/login') },
      { path: 'register', component: () => import('pages/auth/register') },
      { path: 'confirm', component: () => import('pages/auth/confirm') },
      { path: 'reset', component: () => import('pages/auth/reset') }
    ]
  },
  {
    path: '/main',
    component: () => import('layouts/main'),
    meta: {
      requiresAuth: false // デモ用設定
    },
    children: [
      { path: 'inquiries', component: () => import('pages/main/inquiry-list') },
      { path: 'chart01', component: () => import('pages/main/chart01') },
      { path: 'plan/edit', component: () => import('pages/main/plan-edit') },
      { path: 'password-change', component: () => import('pages/auth/password-change') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
