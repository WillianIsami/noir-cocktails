<template>
  <TransitionGroup name="drink-grid" tag="section" class="drink-grid">
    <DrinkCard v-for="drink in drinks" :key="drink.id" :drink="drink" />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { DrinkSummary } from '@/types/cocktail';

import DrinkCard from './DrinkCard.vue';

interface DrinkGridProps {
  drinks: DrinkSummary[];
}

defineProps<DrinkGridProps>();
</script>

<style scoped>
.drink-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .drink-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .drink-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.15rem;
  }
}

@media (min-width: 1260px) {
  .drink-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.drink-grid-enter-active,
.drink-grid-leave-active {
  transition: all 280ms ease;
}

.drink-grid-enter-from,
.drink-grid-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
