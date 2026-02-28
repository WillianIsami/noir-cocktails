import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { createMemoryHistory, createRouter } from 'vue-router';

import enUS from '@/i18n/locales/en-US';
import esES from '@/i18n/locales/es-ES';
import ptBR from '@/i18n/locales/pt-BR';

export function createTestI18n(locale: 'pt-BR' | 'en-US' | 'es-ES' = 'pt-BR') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'pt-BR',
    messages: {
      'pt-BR': ptBR,
      'en-US': enUS,
      'es-ES': esES,
    },
  });
}

export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>home</div>' } },
      { path: '/favorites', name: 'favorites', component: { template: '<div>fav</div>' } },
      { path: '/drink/:id', name: 'drink-details', component: { template: '<div>details</div>' } },
    ],
  });
}

export function createTestPlugins(locale: 'pt-BR' | 'en-US' | 'es-ES' = 'pt-BR') {
  return {
    pinia: createPinia(),
    i18n: createTestI18n(locale),
    router: createTestRouter(),
  };
}
