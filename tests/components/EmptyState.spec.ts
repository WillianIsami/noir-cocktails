import { mount } from '@vue/test-utils';

import EmptyState from '@/components/EmptyState.vue';

describe('EmptyState', () => {
  it('renders title/description and emits optional action', async () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No drinks',
        description: 'Try another filter',
        actionLabel: 'Reset',
      },
    });

    expect(wrapper.text()).toContain('No drinks');
    expect(wrapper.text()).toContain('Try another filter');

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('action')).toHaveLength(1);
  });
});
