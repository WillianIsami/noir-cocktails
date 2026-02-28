import { mount } from '@vue/test-utils';

import HeroSection from '@/components/HeroSection.vue';
import { createTestI18n } from '../helpers';

describe('HeroSection', () => {
  it('renders localized hero content', () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [createTestI18n('en-US')],
      },
    });

    expect(wrapper.text()).toContain('Discover cocktails for every mood of the night.');
    expect(wrapper.findAll('img')).toHaveLength(3);
  });
});
