import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';

import { useDebouncedRef } from '@/composables/useDebouncedRef';

describe('useDebouncedRef', () => {
  it('updates the debounced ref after delay', async () => {
    vi.useFakeTimers();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const source = ref('initial');
        const debounced = useDebouncedRef(source, 200);
        expose({
          setSource(value: string) {
            source.value = value;
          },
          getDebounced() {
            return debounced.value;
          },
        });
        return () => null;
      },
    });

    const wrapper = mount(Harness);
    const vm = wrapper.vm as unknown as {
      setSource: (value: string) => void;
      getDebounced: () => string;
    };

    vm.setSource('next');
    await wrapper.vm.$nextTick();
    expect(vm.getDebounced()).toBe('initial');

    vi.advanceTimersByTime(199);
    await wrapper.vm.$nextTick();
    expect(vm.getDebounced()).toBe('initial');

    vi.advanceTimersByTime(1);
    await wrapper.vm.$nextTick();
    expect(vm.getDebounced()).toBe('next');
  });
});
