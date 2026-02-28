import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';

import FavoritesView from '@/views/FavoritesView.vue';
import { useFavoritesStore } from '@/stores/favorites';
import { createTestI18n, createTestRouter } from '../helpers';

describe('FavoritesView', () => {
  it('renders empty state when there are no favorites', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const router = createTestRouter();
    await router.push('/favorites');
    await router.isReady();

    const wrapper = mount(FavoritesView, {
      global: {
        plugins: [createTestI18n('en-US'), pinia, router],
      },
    });

    expect(wrapper.text()).toContain('No favorites yet');
  });

  it('renders drink grid when favorites exist', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useFavoritesStore();
    store.addFavorite({
      id: '1',
      name: 'A1',
      thumbnail: 'a.jpg',
      category: 'Cocktail',
      alcoholic: 'Alcoholic',
      glass: 'Cocktail glass',
    });

    const router = createTestRouter();
    await router.push('/favorites');
    await router.isReady();

    const wrapper = mount(FavoritesView, {
      global: {
        plugins: [createTestI18n('en-US'), pinia, router],
      },
    });

    expect(wrapper.text()).toContain('A1');
  });
});
