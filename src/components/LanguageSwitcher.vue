<template>
  <div class="language-switcher">
    <label class="language-switcher__label" for="language-select">{{ t('locale.label') }}</label>

    <select
      id="language-select"
      class="language-switcher__select"
      :value="locale"
      :aria-label="t('locale.switcherAria')"
      @change="handleLocaleChange"
    >
      <option
        v-for="option in localeOptions"
        :key="option.code"
        :value="option.code"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  isSupportedLocale,
  setAppLocale,
  SUPPORTED_LOCALES,
} from '@/i18n';
import type { AppLocale } from '@/i18n';

interface LocaleOption {
  code: AppLocale;
  label: string;
}

const { locale, t } = useI18n();

const localeLabelKeyMap: Record<AppLocale, 'locale.ptBR' | 'locale.enUS' | 'locale.esES'> = {
  'pt-BR': 'locale.ptBR',
  'en-US': 'locale.enUS',
  'es-ES': 'locale.esES',
};

const localeOptions = computed<LocaleOption[]>(() =>
  SUPPORTED_LOCALES.map((localeCode) => ({
    code: localeCode,
    label: t(localeLabelKeyMap[localeCode]),
  })),
);

function handleLocaleChange(event: Event): void {
  const nextLocale = (event.target as HTMLSelectElement).value;

  if (!isSupportedLocale(nextLocale)) {
    return;
  }

  setAppLocale(nextLocale);
}
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.language-switcher__label {
  color: rgba(237, 225, 205, 0.72);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.language-switcher__select {
  border: 1px solid rgba(217, 173, 104, 0.28);
  border-radius: 999px;
  background: rgba(14, 16, 21, 0.92);
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.78rem;
  padding: 0.38rem 0.75rem;
  cursor: pointer;
}

.language-switcher__select:focus {
  outline: 2px solid rgba(241, 195, 116, 0.56);
  outline-offset: 1px;
}

@media (max-width: 700px) {
  .language-switcher__label {
    display: none;
  }
}
</style>
