import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { DrinkSummary } from '@/types/cocktail';
import { STORAGE_KEYS } from '@/utils/constants';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteDrinks = ref<DrinkSummary[]>(
    loadFromStorage<DrinkSummary[]>(STORAGE_KEYS.favorites, []),
  );

  const totalFavorites = computed(() => favoriteDrinks.value.length);

  const favoriteIds = computed(
    () => new Set(favoriteDrinks.value.map((drink) => drink.id)),
  );

  function isFavorite(drinkId: string): boolean {
    return favoriteIds.value.has(drinkId);
  }

  function addFavorite(drink: DrinkSummary): void {
    if (isFavorite(drink.id)) {
      return;
    }

    favoriteDrinks.value = [drink, ...favoriteDrinks.value];
  }

  function removeFavorite(drinkId: string): void {
    favoriteDrinks.value = favoriteDrinks.value.filter((drink) => drink.id !== drinkId);
  }

  function toggleFavorite(drink: DrinkSummary): void {
    if (isFavorite(drink.id)) {
      removeFavorite(drink.id);
      return;
    }

    addFavorite(drink);
  }

  watch(
    favoriteDrinks,
    (value) => {
      saveToStorage(STORAGE_KEYS.favorites, value);
    },
    { deep: true },
  );

  return {
    favoriteDrinks,
    favoriteIds,
    totalFavorites,
    addFavorite,
    isFavorite,
    removeFavorite,
    toggleFavorite,
  };
});
