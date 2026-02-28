import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';

import { i18n } from '@/i18n';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      titleKey: 'routes.homeTitle',
    },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: {
      titleKey: 'routes.favoritesTitle',
    },
  },
  {
    path: '/drink/:id',
    name: 'drink-details',
    component: () => import('@/views/DrinkDetailsView.vue'),
    meta: {
      titleKey: 'routes.detailsTitle',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }

    // Keep scroll position on same-route query updates (pagination/filter changes).
    if (to.path === from.path) {
      return false;
    }

    return { top: 0, behavior: 'smooth' };
  },
});

function setDocumentTitle(route: RouteLocationNormalizedLoaded): void {
  const titleKey = typeof route.meta.titleKey === 'string' ? route.meta.titleKey : null;
  if (!titleKey) {
    return;
  }

  document.title = i18n.global.t(titleKey);
}

router.afterEach((to) => {
  setDocumentTitle(to);
});

watch(
  () => i18n.global.locale.value,
  () => {
    setDocumentTitle(router.currentRoute.value);
  },
);

export default router;
