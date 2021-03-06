const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/auth' }, // Redirect empty Route to Auth
      { path: '/auth', name: 'Authorization', component: () => import('pages/Auth.vue') },
      { path: '/search', name: 'Search', component: () => import('pages/Search.vue') },
      { path: '/favorites', name: 'Favorites', component: () => import('pages/Favorites.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
