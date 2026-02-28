<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ 'favorite-button--active': isActive }"
    :aria-pressed="isActive"
    :aria-label="ariaLabel"
    @click.stop.prevent="handleToggle"
  >
    <span class="favorite-button__icon" aria-hidden="true">♥</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFavoritesStore } from '@/stores/favorites';
import type { DrinkSummary } from '@/types/cocktail';

interface FavoriteButtonProps {
  drink: DrinkSummary;
}

const props = defineProps<FavoriteButtonProps>();
const favoritesStore = useFavoritesStore();
const { t } = useI18n();

const isActive = computed(() => favoritesStore.isFavorite(props.drink.id));
const ariaLabel = computed(() =>
  isActive.value ? t('favoriteButton.removeAria') : t('favoriteButton.addAria'),
);

function handleToggle(): void {
  favoritesStore.toggleFavorite(props.drink);
}
</script>

<style scoped>
.favorite-button {
  width: 2.2rem;
  aspect-ratio: 1;
  border-radius: 999px;
  border: 1px solid rgba(225, 187, 130, 0.25);
  background: rgba(12, 13, 16, 0.68);
  color: rgba(245, 230, 210, 0.92);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 220ms ease, border-color 220ms ease, background-color 220ms ease;
}

.favorite-button:hover {
  transform: translateY(-2px);
  border-color: rgba(241, 195, 116, 0.58);
}

.favorite-button--active {
  background: linear-gradient(160deg, rgba(223, 140, 70, 0.9), rgba(182, 86, 52, 0.85));
  border-color: rgba(246, 206, 136, 0.8);
}

.favorite-button__icon {
  font-size: 0.95rem;
  line-height: 1;
}
</style>
