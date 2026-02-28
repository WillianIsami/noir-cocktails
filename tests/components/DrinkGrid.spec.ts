import { mount } from '@vue/test-utils';

import DrinkGrid from '@/components/DrinkGrid.vue';
import type { DrinkSummary } from '@/types/cocktail';

const drinks: DrinkSummary[] = [
  {
    id: '1',
    name: 'A1',
    thumbnail: 'a.jpg',
    category: 'Cocktail',
    alcoholic: 'Alcoholic',
    glass: 'Cocktail glass',
  },
  {
    id: '2',
    name: 'B2',
    thumbnail: 'b.jpg',
    category: 'Cocktail',
    alcoholic: 'Alcoholic',
    glass: 'Cocktail glass',
  },
];

describe('DrinkGrid', () => {
  it('renders one DrinkCard per item', () => {
    const wrapper = mount(DrinkGrid, {
      props: { drinks },
      global: {
        stubs: {
          DrinkCard: {
            props: ['drink'],
            template: '<div class="card">{{ drink.name }}</div>',
          },
        },
      },
    });

    expect(wrapper.findAll('.card')).toHaveLength(2);
  });
});
