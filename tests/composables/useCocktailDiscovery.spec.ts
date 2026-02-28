import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';

import { createTestI18n } from '../helpers';

interface ServiceMocks {
  listCategories: ReturnType<typeof vi.fn>;
  listAllDrinks: ReturnType<typeof vi.fn>;
  searchByName: ReturnType<typeof vi.fn>;
  searchByFirstLetter: ReturnType<typeof vi.fn>;
  filterByCategory: ReturnType<typeof vi.fn>;
}

async function mountDiscoveryHarness(serviceMocks: ServiceMocks) {
  vi.resetModules();
  vi.doMock('@/services/cocktailService', () => ({
    cocktailService: serviceMocks,
  }));

  const { useCocktailDiscovery } = await import('@/composables/useCocktailDiscovery');

  const Harness = defineComponent({
    setup(_, { expose }) {
      const state = useCocktailDiscovery();
      expose(state);
      return () => null;
    },
  });

  const wrapper = mount(Harness, {
    global: {
      plugins: [createTestI18n('en-US')],
    },
  });

  await Promise.resolve();
  await Promise.resolve();

  return wrapper;
}

function createServiceMocks(): ServiceMocks {
  return {
    listCategories: vi.fn().mockResolvedValue([{ id: 'cocktail', name: 'Cocktail' }]),
    listAllDrinks: vi.fn().mockResolvedValue([
      {
        id: '11007',
        name: 'Margarita',
        thumbnail: 'thumb.jpg',
        category: 'Cocktail',
        alcoholic: 'Alcoholic',
        glass: 'Cocktail glass',
      },
    ]),
    searchByName: vi.fn().mockResolvedValue([]),
    searchByFirstLetter: vi.fn().mockResolvedValue([]),
    filterByCategory: vi.fn().mockResolvedValue([]),
  };
}

describe('useCocktailDiscovery', () => {
  it('loads categories and all drinks on mount', async () => {
    const serviceMocks = createServiceMocks();
    const wrapper = await mountDiscoveryHarness(serviceMocks);
    const vm = wrapper.vm as unknown as {
      mode: string;
      categories: Array<{ name: string }>;
      drinks: Array<{ id: string }>;
    };

    expect(serviceMocks.listCategories).toHaveBeenCalledTimes(1);
    expect(serviceMocks.listAllDrinks).toHaveBeenCalledTimes(1);
    expect(vm.mode).toBe('all');
    expect(vm.categories[0].name).toBe('Cocktail');
    expect(vm.drinks[0].id).toBe('11007');
  });

  it('switches modes for category, letter, search, and reset', async () => {
    vi.useFakeTimers();
    const serviceMocks = createServiceMocks();
    const wrapper = await mountDiscoveryHarness(serviceMocks);
    const vm = wrapper.vm as unknown as {
      setCategory: (category: string) => void;
      setLetter: (letter: string) => void;
      setSearch: (value: string) => void;
      resetFilters: () => void;
      applyExternalState: (
        state: { searchQuery: string; activeCategory: string | null; activeLetter: string | null },
        fetchAfterApply?: boolean,
      ) => Promise<void>;
      mode: string;
    };

    vm.setCategory('Cocktail');
    await Promise.resolve();
    expect(serviceMocks.filterByCategory).toHaveBeenCalledWith('Cocktail', expect.any(AbortSignal));
    expect(vm.mode).toBe('category');

    vm.setLetter('B');
    await Promise.resolve();
    expect(serviceMocks.searchByFirstLetter).toHaveBeenCalledWith('B', expect.any(AbortSignal));
    expect(vm.mode).toBe('letter');

    vm.setSearch('Negroni');
    await nextTick();
    vi.advanceTimersByTime(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(serviceMocks.searchByName).toHaveBeenCalledWith('Negroni', expect.any(AbortSignal));
    expect(vm.mode).toBe('search');

    vm.resetFilters();
    await Promise.resolve();
    expect(serviceMocks.listAllDrinks).toHaveBeenCalledTimes(2);
    expect(vm.mode).toBe('all');

    await vm.applyExternalState(
      {
        searchQuery: '',
        activeCategory: null,
        activeLetter: 'C',
      },
      true,
    );
    expect(serviceMocks.searchByFirstLetter).toHaveBeenCalledWith('C', expect.any(AbortSignal));
  });
});
