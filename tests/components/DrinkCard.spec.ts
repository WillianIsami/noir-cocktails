import { mount, RouterLinkStub } from '@vue/test-utils';

import DrinkCard from '@/components/DrinkCard.vue';
import type { DrinkSummary } from '@/types/cocktail';
import { createTestI18n } from '../helpers';

const drink: DrinkSummary = {
  id: '11007',
  name: 'Margarita',
  thumbnail: 'https://cdn.test/margarita.jpg',
  category: 'Cocktail',
  alcoholic: 'Alcoholic',
  glass: 'Cocktail glass',
};

describe('DrinkCard', () => {
  it('renders card details with localized metadata', () => {
    const wrapper = mount(DrinkCard, {
      props: { drink },
      global: {
        plugins: [createTestI18n('en-US')],
        stubs: {
          RouterLink: RouterLinkStub,
          FavoriteButton: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Margarita');
    expect(wrapper.text()).toContain('Cocktail');
    expect(wrapper.text()).toContain('Alcoholic');
    expect(wrapper.text()).toContain('Cocktail glass');
  });
});
