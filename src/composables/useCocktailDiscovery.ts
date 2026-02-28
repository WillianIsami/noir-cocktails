import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { cocktailService } from '@/services/cocktailService';
import type { CategoryItem, DiscoveryMode, DrinkSummary } from '@/types/cocktail';

import { useDebouncedRef } from './useDebouncedRef';

interface DiscoveryExternalState {
  searchQuery: string;
  activeCategory: string | null;
  activeLetter: string | null;
}

interface UseCocktailDiscoveryOptions {
  skipInitialDrinksFetch?: boolean;
}

function normalizeExternalState(state: DiscoveryExternalState): {
  mode: DiscoveryMode;
  searchQuery: string;
  activeCategory: string | null;
  activeLetter: string | null;
} {
  const normalizedSearch = state.searchQuery.trim();

  if (normalizedSearch.length > 0) {
    return {
      mode: 'search',
      searchQuery: state.searchQuery,
      activeCategory: null,
      activeLetter: null,
    };
  }

  if (state.activeCategory) {
    return {
      mode: 'category',
      searchQuery: '',
      activeCategory: state.activeCategory,
      activeLetter: null,
    };
  }

  if (!state.activeLetter) {
    return {
      mode: 'all',
      searchQuery: '',
      activeCategory: null,
      activeLetter: null,
    };
  }

  return {
    mode: 'letter',
    searchQuery: '',
    activeCategory: null,
    activeLetter: state.activeLetter,
  };
}

export function useCocktailDiscovery(options: UseCocktailDiscoveryOptions = {}) {
  const { t } = useI18n();
  const drinks = ref<DrinkSummary[]>([]);
  const categories = ref<CategoryItem[]>([]);

  const mode = ref<DiscoveryMode>('all');
  const activeCategory = ref<string | null>(null);
  const activeLetter = ref<string | null>(null);
  const searchQuery = ref('');

  const isLoadingDrinks = ref(false);
  const isLoadingCategories = ref(false);
  const errorMessage = ref<string | null>(null);

  const isApplyingExternalState = ref(false);

  let drinksAbortController: AbortController | null = null;

  function cancelPendingRequest(): void {
    drinksAbortController?.abort();
    drinksAbortController = null;
  }

  async function fetchCategories(): Promise<void> {
    isLoadingCategories.value = true;

    try {
      categories.value = await cocktailService.listCategories();
    } catch {
      errorMessage.value = t('errors.loadCategories');
      categories.value = [];
    } finally {
      isLoadingCategories.value = false;
    }
  }

  async function fetchDrinks(): Promise<void> {
    cancelPendingRequest();
    drinksAbortController = new AbortController();

    isLoadingDrinks.value = true;
    errorMessage.value = null;

    try {
      if (mode.value === 'all') {
        drinks.value = await cocktailService.listAllDrinks(drinksAbortController.signal);
      } else if (mode.value === 'search') {
        drinks.value = await cocktailService.searchByName(
          searchQuery.value.trim(),
          drinksAbortController.signal,
        );
      } else if (mode.value === 'category' && activeCategory.value) {
        drinks.value = await cocktailService.filterByCategory(
          activeCategory.value,
          drinksAbortController.signal,
        );
      } else if (mode.value === 'letter' && activeLetter.value) {
        drinks.value = await cocktailService.searchByFirstLetter(
          activeLetter.value,
          drinksAbortController.signal,
        );
      } else {
        mode.value = 'all';
        activeLetter.value = null;
        drinks.value = await cocktailService.listAllDrinks(drinksAbortController.signal);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      errorMessage.value = t('errors.loadDrinks');
      drinks.value = [];
    } finally {
      isLoadingDrinks.value = false;
    }
  }

  async function applyExternalState(
    state: DiscoveryExternalState,
    fetchAfterApply = true,
  ): Promise<void> {
    const normalizedState = normalizeExternalState(state);

    isApplyingExternalState.value = true;
    mode.value = normalizedState.mode;
    searchQuery.value = normalizedState.searchQuery;
    activeCategory.value = normalizedState.activeCategory;
    activeLetter.value = normalizedState.activeLetter;
    isApplyingExternalState.value = false;

    if (fetchAfterApply) {
      await fetchDrinks();
    }
  }

  function setCategory(categoryName: string): void {
    mode.value = 'category';
    activeCategory.value = categoryName;
    activeLetter.value = null;
    searchQuery.value = '';
    void fetchDrinks();
  }

  function setLetter(letter: string): void {
    mode.value = 'letter';
    activeLetter.value = letter;
    activeCategory.value = null;
    searchQuery.value = '';
    void fetchDrinks();
  }

  function setSearch(value: string): void {
    searchQuery.value = value;

    if (value.trim().length > 0) {
      mode.value = 'search';
      activeCategory.value = null;
      activeLetter.value = null;
    }
  }

  function resetFilters(): void {
    mode.value = 'all';
    activeLetter.value = null;
    activeCategory.value = null;
    searchQuery.value = '';
    void fetchDrinks();
  }

  const debouncedSearch = useDebouncedRef(searchQuery, 360);

  watch(debouncedSearch, (value) => {
    if (isApplyingExternalState.value) {
      return;
    }

    const normalized = value.trim();

    if (normalized.length === 0) {
      if (mode.value === 'search') {
        mode.value = 'all';
        activeLetter.value = null;
        void fetchDrinks();
      }
      return;
    }

    mode.value = 'search';
    activeCategory.value = null;
    activeLetter.value = null;
    void fetchDrinks();
  });

  const hasActiveFilters = computed(
    () => mode.value !== 'all',
  );

  onMounted(async () => {
    await fetchCategories();

    if (!options.skipInitialDrinksFetch) {
      await fetchDrinks();
    }
  });

  return {
    activeCategory,
    activeLetter,
    categories,
    drinks,
    errorMessage,
    hasActiveFilters,
    isLoadingCategories,
    isLoadingDrinks,
    mode,
    searchQuery,
    applyExternalState,
    fetchDrinks,
    resetFilters,
    setCategory,
    setLetter,
    setSearch,
  };
}
