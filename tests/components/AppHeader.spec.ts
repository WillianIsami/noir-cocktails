import { createPinia, setActivePinia } from 'pinia';
import { mount, RouterLinkStub } from '@vue/test-utils';

import AppHeader from '@/components/AppHeader.vue';
import { useFavoritesStore } from '@/stores/favorites';
import { createTestI18n } from '../helpers';

describe('AppHeader', () => {
  it('renders nav links and favorite counter', () => {
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

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestI18n('en-US'), pinia],
        stubs: {
          RouterLink: RouterLinkStub,
          LanguageSwitcher: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Explore');
    expect(wrapper.text()).toContain('Favorites');
    expect(wrapper.find('.app-nav__badge').text()).toBe('1');
  });
});
