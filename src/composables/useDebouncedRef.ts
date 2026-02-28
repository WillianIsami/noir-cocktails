import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';

export function useDebouncedRef<T>(source: Ref<T>, delayMs = 320): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(
    source,
    (value) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        debounced.value = value;
      }, delayMs);
    },
    { flush: 'post' },
  );

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });

  return debounced;
}
