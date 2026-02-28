import { mount } from '@vue/test-utils';

import AlphabetFilter from '@/components/AlphabetFilter.vue';
import { createTestI18n } from '../helpers';

describe('AlphabetFilter', () => {
  it('renders alphabet and emits selected letter', async () => {
    const wrapper = mount(AlphabetFilter, {
      props: {
        activeLetter: 'A',
      },
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(26);
    expect(buttons[0].classes()).toContain('alphabet-filter__item--active');

    await buttons[1].trigger('click');
    expect(wrapper.emitted('select')?.at(0)).toEqual(['B']);
  });
});
