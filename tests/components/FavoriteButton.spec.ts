import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';

import FavoriteButton from '@/components/FavoriteButton.vue';
import type { DrinkSummary } from '@/types/cocktail';
import { useFavoritesStore } from '@/stores/favorites';
import { createTestI18n } from '../helpers';

const drink: DrinkSummary = {
  id: '11007',
  name: 'Margarita',
  thumbnail: 'thumb.jpg',
  category: 'Cocktail',
  alcoholic: 'Alcoholic',
  glass: 'Cocktail glass',
};

describe('FavoriteButton', () => {
  it('toggles favorite state in the store', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(FavoriteButton, {
      props: { drink },
      global: {
        plugins: [createTestI18n('en-US'), pinia],
      },
    });

    const store = useFavoritesStore();
    expect(store.totalFavorites).toBe(0);

    await wrapper.trigger('click');
    expect(store.totalFavorites).toBe(1);
    expect(wrapper.classes()).toContain('favorite-button--active');

    await wrapper.trigger('click');
    expect(store.totalFavorites).toBe(0);
  });
});
