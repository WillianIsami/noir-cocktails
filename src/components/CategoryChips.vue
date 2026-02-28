<template>
  <section class="category-chips" :aria-label="t('categories.aria')">
    <button
      type="button"
      class="category-chip"
      :class="{ 'category-chip--active': activeCategory === null }"
      @click="emit('clear')"
    >
      {{ t('categories.all') }}
    </button>

    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="category-chip"
      :class="{ 'category-chip--active': activeCategory === category.name }"
      @click="emit('select', category.name)"
    >
      {{ localizeCategoryValue(category.name, t) }}
    </button>

    <span v-if="isLoading" class="category-chip category-chip--loading">{{ t('categories.loading') }}</span>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { CategoryItem } from '@/types/cocktail';
import { localizeCategoryValue } from '@/utils/apiLocalization';

interface CategoryChipsProps {
  categories: CategoryItem[];
  activeCategory: string | null;
  isLoading: boolean;
}

defineProps<CategoryChipsProps>();

const emit = defineEmits<{
  clear: [];
  select: [categoryName: string];
}>();

const { t } = useI18n();
</script>

<style scoped>
.category-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.52rem;
}

.category-chip {
  border: 1px solid rgba(217, 173, 104, 0.2);
  border-radius: 999px;
  padding: 0.52rem 0.88rem;
  background: rgba(18, 20, 25, 0.75);
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 200ms ease, background-color 200ms ease, color 200ms ease;
}

.category-chip:hover {
  border-color: rgba(236, 187, 113, 0.55);
  color: var(--color-text);
}

.category-chip--active {
  color: #120f09;
  border-color: rgba(241, 199, 130, 0.86);
  background: linear-gradient(140deg, #f1c782 0%, #c47638 100%);
}

.category-chip--loading {
  cursor: default;
  color: rgba(229, 221, 207, 0.7);
  background: rgba(18, 20, 25, 0.92);
}
</style>
