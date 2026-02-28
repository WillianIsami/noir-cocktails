import { createI18n } from 'vue-i18n';

import enUS from './locales/en-US';
import esES from './locales/es-ES';
import ptBR from './locales/pt-BR';

export const DEFAULT_LOCALE = 'pt-BR' as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'en-US', 'es-ES'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'noir-cocktails-locale';

const messages = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
};

function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

function normalizeLocale(rawLocale: string): string {
  return rawLocale.replace('_', '-');
}

function resolveLocaleCandidate(rawLocale: string): AppLocale | null {
  const normalizedLocale = normalizeLocale(rawLocale);

  if (isAppLocale(normalizedLocale)) {
    return normalizedLocale;
  }

  const localePrefix = normalizedLocale.split('-')[0]?.toLowerCase();
  if (!localePrefix) {
    return null;
  }

  if (localePrefix === 'pt') {
    return 'pt-BR';
  }

  if (localePrefix === 'en') {
    return 'en-US';
  }

  if (localePrefix === 'es') {
    return 'es-ES';
  }

  return null;
}

function resolveInitialLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const persistedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (persistedLocale) {
    const localeCandidate = resolveLocaleCandidate(persistedLocale);
    if (localeCandidate) {
      return localeCandidate;
    }
  }

  const browserCandidate = resolveLocaleCandidate(window.navigator.language);
  return browserCandidate ?? DEFAULT_LOCALE;
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
});

export function setAppLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale;

  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export function initializeI18nLocale(): void {
  setAppLocale(resolveInitialLocale());
}

export function isSupportedLocale(value: string): value is AppLocale {
  return isAppLocale(value);
}
