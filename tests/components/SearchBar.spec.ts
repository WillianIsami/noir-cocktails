import { mount } from '@vue/test-utils';

import SearchBar from '@/components/SearchBar.vue';
import { createTestI18n } from '../helpers';

describe('SearchBar', () => {
  it('emits model updates and clears value', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'Negroni',
      },
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    await wrapper.find('input').setValue('Margarita');
    expect(wrapper.emitted('update:modelValue')?.at(0)).toEqual(['Margarita']);

    await wrapper.find('.search-bar__clear').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(1)).toEqual(['']);
  });

  it('shows loading state when requested', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        isLoading: true,
      },
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    expect(wrapper.find('.search-bar__spinner').exists()).toBe(true);
  });
});
