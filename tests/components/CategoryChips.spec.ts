import { mount } from '@vue/test-utils';

import CategoryChips from '@/components/CategoryChips.vue';
import { createTestI18n } from '../helpers';

describe('CategoryChips', () => {
  it('emits clear and select actions', async () => {
    const wrapper = mount(CategoryChips, {
      props: {
        categories: [{ id: 'cocktail', name: 'Cocktail' }],
        activeCategory: null,
        isLoading: false,
      },
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    await buttons[1].trigger('click');

    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('select')?.at(0)).toEqual(['Cocktail']);
  });

  it('shows loading chip when categories are loading', () => {
    const wrapper = mount(CategoryChips, {
      props: {
        categories: [],
        activeCategory: null,
        isLoading: true,
      },
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    expect(wrapper.text()).toContain('Loading...');
  });
});
