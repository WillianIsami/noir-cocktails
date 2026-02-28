import { afterEach, vi } from 'vitest';

class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  disconnect(): void {}

  observe(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(): void {}
}

if (!('IntersectionObserver' in globalThis)) {
  // jsdom does not provide IntersectionObserver.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.IntersectionObserver = IntersectionObserverMock;
}

if (!('scrollTo' in window)) {
  window.scrollTo = vi.fn();
} else {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
}

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  window.localStorage.clear();
});
