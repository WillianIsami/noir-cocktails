import { mount } from '@vue/test-utils';
import { ref } from 'vue';

import HomeView from '@/views/HomeView.vue';
import { createTestI18n, createTestRouter } from '../helpers';

const discoveryState = {
  activeCategory: ref<string | null>(null),
  activeLetter: ref<string | null>(null),
  categories: ref([{ id: 'cocktail', name: 'Cocktail' }]),
  drinks: ref(
    Array.from({ length: 18 }, (_, index) => ({
      id: String(index + 1),
      name: `Drink ${index + 1}`,
      thumbnail: 'thumb.jpg',
      category: 'Cocktail',
      alcoholic: 'Alcoholic',
      glass: 'Cocktail glass',
    })),
  ),
  errorMessage: ref<string | null>(null),
  hasActiveFilters: ref(false),
  isLoadingCategories: ref(false),
  isLoadingDrinks: ref(false),
  mode: ref<'all' | 'search' | 'category' | 'letter'>('all'),
  searchQuery: ref(''),
  applyExternalState: vi.fn().mockResolvedValue(undefined),
  fetchDrinks: vi.fn().mockResolvedValue(undefined),
  resetFilters: vi.fn(),
  setCategory: vi.fn(),
  setLetter: vi.fn(),
  setSearch: vi.fn(),
};

vi.mock('@/composables/useCocktailDiscovery', () => ({
  useCocktailDiscovery: () => discoveryState,
}));

describe('HomeView', () => {
  it('renders paginated list using route query state', async () => {
    const router = createTestRouter();
    await router.push('/?page=2&limit=8');
    await router.isReady();

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestI18n('en-US'), router],
        stubs: {
          HeroSection: true,
          AlphabetFilter: true,
          CategoryChips: true,
          SearchBar: true,
          LoadingState: true,
          EmptyState: true,
          DrinkGrid: {
            props: ['drinks'],
            template: '<div class="drink-grid-stub">{{ drinks.length }}</div>',
          },
        },
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.find('.drink-grid-stub').text()).toBe('8');
    expect(wrapper.text()).toContain('Page 2 of 3');
  });
});
