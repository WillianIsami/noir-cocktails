<template>
  <section class="alphabet-filter" :aria-label="t('alphabet.aria')">
    <button
      v-for="letter in letters"
      :key="letter"
      type="button"
      class="alphabet-filter__item"
      :class="{ 'alphabet-filter__item--active': activeLetter === letter }"
      @click="emit('select', letter)"
    >
      {{ letter }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { ALPHABET } from '@/utils/constants';

interface AlphabetFilterProps {
  activeLetter: string | null;
}

defineProps<AlphabetFilterProps>();

const emit = defineEmits<{
  select: [letter: string];
}>();

const { t } = useI18n();
const letters = ALPHABET;
</script>

<style scoped>
.alphabet-filter {
  display: grid;
  grid-template-columns: repeat(13, minmax(0, 1fr));
  gap: 0.38rem;
  background: rgba(13, 14, 19, 0.75);
  border: 1px solid rgba(217, 173, 104, 0.14);
  border-radius: 1rem;
  padding: 0.54rem;
}

.alphabet-filter__item {
  border: 0;
  border-radius: 0.66rem;
  background: transparent;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease, transform 200ms ease;
}

.alphabet-filter__item:hover {
  background: rgba(217, 173, 104, 0.1);
  color: var(--color-text);
}

.alphabet-filter__item--active {
  color: #100f0c;
  background: linear-gradient(160deg, #f1c57c, #c0783e);
  box-shadow: 0 8px 20px rgba(192, 120, 62, 0.35);
}

@media (max-width: 730px) {
  .alphabet-filter {
    grid-template-columns: repeat(9, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .alphabet-filter {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
</style>
