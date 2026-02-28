import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';

import { useFavoritesStore } from '@/stores/favorites';
import type { DrinkSummary } from '@/types/cocktail';
import { STORAGE_KEYS } from '@/utils/constants';

const sampleDrink: DrinkSummary = {
  id: '11007',
  name: 'Margarita',
  thumbnail: 'https://cdn.test/margarita.jpg',
  category: 'Cocktail',
  alcoholic: 'Alcoholic',
  glass: 'Cocktail glass',
};

describe('favorites store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('hydrates initial favorites from localStorage', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([sampleDrink]));

    const store = useFavoritesStore();
    expect(store.favoriteDrinks).toEqual([sampleDrink]);
    expect(store.isFavorite(sampleDrink.id)).toBe(true);
  });

  it('toggles favorites and persists updates', async () => {
    const store = useFavoritesStore();

    store.toggleFavorite(sampleDrink);
    await nextTick();
    expect(store.totalFavorites).toBe(1);
    expect(store.favoriteIds.has(sampleDrink.id)).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEYS.favorites)).toContain(sampleDrink.id);

    store.toggleFavorite(sampleDrink);
    await nextTick();
    expect(store.totalFavorites).toBe(0);
    expect(store.isFavorite(sampleDrink.id)).toBe(false);
  });
});
