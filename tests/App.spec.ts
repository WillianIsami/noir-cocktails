import { mount } from '@vue/test-utils';

import App from '@/App.vue';

describe('App shell', () => {
  it('renders backdrop structure and main layout', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          AppHeader: true,
          RouterView: true,
        },
      },
    });

    expect(wrapper.find('.app-shell').exists()).toBe(true);
    expect(wrapper.findAll('.backdrop-photo')).toHaveLength(2);
    expect(wrapper.find('main.app-main').exists()).toBe(true);
  });
});
