import { mount } from '@vue/test-utils';

import LoadingState from '@/components/LoadingState.vue';

describe('LoadingState', () => {
  it('renders grid skeleton by default', () => {
    const wrapper = mount(LoadingState);
    expect(wrapper.findAll('.loading-grid__card')).toHaveLength(8);
  });

  it('renders details skeleton when variant is details', () => {
    const wrapper = mount(LoadingState, {
      props: {
        variant: 'details',
      },
    });

    expect(wrapper.find('.loading-details').exists()).toBe(true);
  });
});
