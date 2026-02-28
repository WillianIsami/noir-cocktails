<template>
  <div class="search-bar" :class="{ 'search-bar--loading': isLoading }">
    <span class="search-bar__icon" aria-hidden="true">⌕</span>

    <input
      :value="modelValue"
      type="search"
      class="search-bar__input"
      :placeholder="resolvedPlaceholder"
      autocomplete="off"
      @input="handleInput"
      @keydown.esc="clearSearch"
    />

    <button
      v-if="modelValue"
      class="search-bar__clear"
      type="button"
      :aria-label="t('search.clearAria')"
      @click="clearSearch"
    >
      {{ t('search.clear') }}
    </button>

    <span v-if="isLoading" class="search-bar__spinner" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface SearchBarProps {
  modelValue: string;
  placeholder?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<SearchBarProps>(), {
  placeholder: undefined,
  isLoading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { t } = useI18n();

const resolvedPlaceholder = computed(
  () => props.placeholder ?? t('search.placeholder'),
);

function handleInput(event: Event): void {
  const { value } = event.target as HTMLInputElement;
  emit('update:modelValue', value);
}

function clearSearch(): void {
  emit('update:modelValue', '');
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.45rem 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(217, 173, 104, 0.24);
  background: linear-gradient(145deg, rgba(15, 16, 21, 0.96), rgba(24, 27, 33, 0.9));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 24px rgba(3, 3, 5, 0.22);
  transition: border-color 220ms ease, box-shadow 220ms ease;
}

.search-bar:focus-within {
  border-color: rgba(236, 187, 113, 0.58);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 34px rgba(3, 3, 5, 0.36);
}

.search-bar__icon {
  color: rgba(229, 196, 142, 0.78);
  font-size: 1.15rem;
}

.search-bar__input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text);
  font-size: 0.98rem;
  font-family: var(--font-body);
  padding: 0.55rem 0;
}

.search-bar__input::placeholder {
  color: rgba(216, 206, 191, 0.42);
}

.search-bar__clear {
  border: 0;
  border-radius: 999px;
  background: rgba(217, 173, 104, 0.14);
  color: var(--color-text);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  transition: background-color 200ms ease;
}

.search-bar__clear:hover {
  background: rgba(217, 173, 104, 0.24);
}

.search-bar__spinner {
  width: 0.88rem;
  aspect-ratio: 1;
  border-radius: 999px;
  border: 2px solid rgba(217, 173, 104, 0.3);
  border-top-color: rgba(217, 173, 104, 0.94);
  animation: spin 700ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 500px) {
  .search-bar {
    padding-left: 0.78rem;
  }

  .search-bar__clear {
    font-size: 0.72rem;
    padding-inline: 0.68rem;
  }
}
</style>
