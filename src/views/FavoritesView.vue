<template>
  <div class="favorites-view container">
    <header class="favorites-view__header">
      <p>{{ t('favoritesPage.eyebrow') }}</p>
      <h1>{{ t('favoritesPage.title') }}</h1>
      <span>{{ t('favoritesPage.savedCount', { count: favoritesStore.totalFavorites }) }}</span>
    </header>

    <EmptyState
      v-if="favoritesStore.favoriteDrinks.length === 0"
      :title="t('favoritesPage.emptyTitle')"
      :description="t('favoritesPage.emptyDescription')"
      :action-label="t('favoritesPage.emptyAction')"
      @action="navigateToHome"
    />

    <DrinkGrid v-else :drinks="favoritesStore.favoriteDrinks" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import DrinkGrid from '@/components/DrinkGrid.vue';
import EmptyState from '@/components/EmptyState.vue';
import { useFavoritesStore } from '@/stores/favorites';

const router = useRouter();
const favoritesStore = useFavoritesStore();
const { t } = useI18n();

function navigateToHome(): void {
  void router.push({ name: 'home' });
}
</script>

<style scoped>
.favorites-view {
  padding-top: clamp(2.1rem, 5vw, 3.3rem);
  display: grid;
  gap: 1.2rem;
}

.favorites-view__header {
  display: grid;
  gap: 0.35rem;
}

.favorites-view__header p {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-accent-soft);
  font-size: 0.75rem;
  font-weight: 700;
}

.favorites-view__header h1 {
  margin: 0;
  font-family: var(--font-heading);
  color: var(--color-text);
  font-size: clamp(1.8rem, 1.6rem + 1.8vw, 3rem);
  line-height: 0.95;
}

.favorites-view__header span {
  color: var(--color-muted);
}
</style>
