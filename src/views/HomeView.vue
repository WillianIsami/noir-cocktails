<template>
  <div class="home-view">
    <HeroSection />

    <section class="home-controls container">
      <SearchBar
        :model-value="searchQuery"
        :is-loading="mode === 'search' && isLoadingDrinks"
        @update:model-value="handleSearchInput"
      />

      <AlphabetFilter :active-letter="activeLetter" @select="handleLetterSelect" />

      <CategoryChips
        :categories="categories"
        :active-category="activeCategory"
        :is-loading="isLoadingCategories"
        @select="handleCategorySelect"
        @clear="handleResetFilters"
      />
    </section>

    <section ref="resultsSectionRef" class="container home-results">
      <header
        v-if="!errorMessage && !isLoadingDrinks && drinks.length > 0"
        class="home-results__header"
      >
        <h2>{{ sectionTitle }}</h2>
        <span>{{ t('home.resultsCount', { visible: visibleDrinks.length, total: drinks.length }) }}</span>
      </header>

      <div v-if="errorMessage" class="home-results__error" role="alert">
        <p>{{ errorMessage }}</p>
        <button type="button" @click="fetchDrinks">{{ t('home.retry') }}</button>
      </div>

      <LoadingState v-else-if="isLoadingDrinks" variant="grid" />

      <EmptyState
        v-else-if="drinks.length === 0"
        :title="emptyTitle"
        :description="emptyDescription"
        :action-label="hasActiveFilters ? t('home.resetFilters') : undefined"
        @action="handleResetFilters"
      />

      <template v-else>
        <DrinkGrid :drinks="visibleDrinks" />

        <nav
          class="home-pagination"
          :aria-label="t('pagination.aria')"
        >
          <div class="home-pagination__limit">
            <label for="home-limit">{{ t('pagination.perPage') }}</label>
            <select
              id="home-limit"
              :value="currentLimit"
              @change="handleLimitChange"
            >
              <option
                v-for="option in limitOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <span class="home-pagination__summary">
              {{ t('pagination.pageIndicator', { page: currentPage, total: totalPages }) }}
            </span>
          </div>

          <div class="home-pagination__controls">
            <button
              type="button"
              class="home-pagination__nav"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              {{ t('pagination.previous') }}
            </button>

            <div class="home-pagination__pages">
              <template v-for="token in paginationTokens" :key="String(token)">
                <span
                  v-if="typeof token !== 'number'"
                  class="home-pagination__ellipsis"
                  aria-hidden="true"
                >
                  ...
                </span>

                <button
                  v-else
                  type="button"
                  class="home-pagination__page"
                  :class="{ 'home-pagination__page--active': token === currentPage }"
                  :aria-current="token === currentPage ? 'page' : undefined"
                  :aria-label="t('pagination.goToPage', { page: token })"
                  @click="goToPage(token)"
                >
                  {{ token }}
                </button>
              </template>
            </div>

            <button
              type="button"
              class="home-pagination__nav"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            >
              {{ t('pagination.next') }}
            </button>
          </div>
        </nav>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  useRoute,
  useRouter,
  type LocationQuery,
  type LocationQueryRaw,
  type LocationQueryValue,
} from 'vue-router';

import AlphabetFilter from '@/components/AlphabetFilter.vue';
import CategoryChips from '@/components/CategoryChips.vue';
import DrinkGrid from '@/components/DrinkGrid.vue';
import EmptyState from '@/components/EmptyState.vue';
import HeroSection from '@/components/HeroSection.vue';
import LoadingState from '@/components/LoadingState.vue';
import SearchBar from '@/components/SearchBar.vue';
import { useCocktailDiscovery } from '@/composables/useCocktailDiscovery';
import { localizeCategoryValue } from '@/utils/apiLocalization';

const QUERY_KEYS = {
  search: 'q',
  category: 'category',
  letter: 'letter',
  filter: 'filter',
  page: 'page',
  limit: 'limit',
} as const;

const LIMIT_OPTIONS = [8, 12, 16, 24] as const;
const DEFAULT_LIMIT = 12;

type LimitOption = (typeof LIMIT_OPTIONS)[number];
type PaginationToken = number | 'ellipsis-left' | 'ellipsis-right';

interface HomeQueryState {
  search: string;
  category: string | null;
  letter: string | null;
  page: number;
  limit: LimitOption;
}

interface HomeQueryInput {
  search?: string;
  category?: string | null;
  letter?: string | null;
  page?: number | string;
  limit?: LimitOption | number | string;
}

interface DiscoveryRouteState {
  searchQuery: string;
  activeCategory: string | null;
  activeLetter: string | null;
}

interface ScrollIntoListOptions {
  behavior?: ScrollBehavior;
}

function readQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | null {
  if (Array.isArray(value)) {
    const first = value[0];
    return first ?? null;
  }

  return value ?? null;
}

function normalizeLetter(rawLetter: string | null | undefined): string | null {
  const normalized = (rawLetter ?? '').trim().charAt(0).toUpperCase();
  return /^[A-Z]$/.test(normalized) ? normalized : null;
}

function normalizePage(rawPage: string | number | undefined): number {
  const parsedPage = Number.parseInt(String(rawPage ?? ''), 10);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function normalizeLimit(rawLimit: string | number | undefined): LimitOption {
  const parsedLimit = Number.parseInt(String(rawLimit ?? ''), 10);
  return LIMIT_OPTIONS.includes(parsedLimit as LimitOption)
    ? (parsedLimit as LimitOption)
    : DEFAULT_LIMIT;
}

function normalizeHomeQueryState(state: HomeQueryInput): HomeQueryState {
  const normalizedSearch = (state.search ?? '').trim();
  const normalizedCategory = state.category?.trim() ?? null;

  if (normalizedSearch.length > 0) {
    return {
      search: normalizedSearch,
      category: null,
      letter: null,
      page: normalizePage(state.page),
      limit: normalizeLimit(state.limit),
    };
  }

  if (normalizedCategory) {
    return {
      search: '',
      category: normalizedCategory,
      letter: null,
      page: normalizePage(state.page),
      limit: normalizeLimit(state.limit),
    };
  }

  return {
    search: '',
    category: null,
    letter: normalizeLetter(state.letter),
    page: normalizePage(state.page),
    limit: normalizeLimit(state.limit),
  };
}

function parseHomeQuery(query: LocationQuery): HomeQueryState {
  const letterFilterMode = readQueryValue(query[QUERY_KEYS.filter]) === 'letter';

  return normalizeHomeQueryState({
    search: readQueryValue(query[QUERY_KEYS.search]) ?? '',
    category: readQueryValue(query[QUERY_KEYS.category]),
    letter: letterFilterMode ? readQueryValue(query[QUERY_KEYS.letter]) : null,
    page: readQueryValue(query[QUERY_KEYS.page]) ?? undefined,
    limit: readQueryValue(query[QUERY_KEYS.limit]) ?? undefined,
  });
}

function buildHomeQuery(state: HomeQueryState): LocationQueryRaw {
  const query: LocationQueryRaw = {
    [QUERY_KEYS.page]: String(state.page),
    [QUERY_KEYS.limit]: String(state.limit),
  };

  if (state.search.length > 0) {
    query[QUERY_KEYS.search] = state.search;
    return query;
  }

  if (state.category) {
    query[QUERY_KEYS.category] = state.category;
    return query;
  }

  if (state.letter) {
    query[QUERY_KEYS.filter] = 'letter';
    query[QUERY_KEYS.letter] = state.letter;
  }

  return query;
}

function toDiscoveryState(state: HomeQueryState): DiscoveryRouteState {
  if (state.search.length > 0) {
    return {
      searchQuery: state.search,
      activeCategory: null,
      activeLetter: null,
    };
  }

  if (state.category) {
    return {
      searchQuery: '',
      activeCategory: state.category,
      activeLetter: null,
    };
  }

  return {
    searchQuery: '',
    activeCategory: null,
    activeLetter: state.letter,
  };
}

function normalizeDiscoveryState(state: DiscoveryRouteState): DiscoveryRouteState {
  const normalizedSearch = state.searchQuery.trim();

  if (normalizedSearch.length > 0) {
    return {
      searchQuery: normalizedSearch,
      activeCategory: null,
      activeLetter: null,
    };
  }

  if (state.activeCategory) {
    return {
      searchQuery: '',
      activeCategory: state.activeCategory,
      activeLetter: null,
    };
  }

  const normalizedLetter = normalizeLetter(state.activeLetter);

  return {
    searchQuery: '',
    activeCategory: null,
    activeLetter: normalizedLetter,
  };
}

function areDiscoveryStatesEqual(
  first: DiscoveryRouteState,
  second: DiscoveryRouteState,
): boolean {
  const normalizedFirst = normalizeDiscoveryState(first);
  const normalizedSecond = normalizeDiscoveryState(second);

  return (
    normalizedFirst.searchQuery === normalizedSecond.searchQuery
    && normalizedFirst.activeCategory === normalizedSecond.activeCategory
    && normalizedFirst.activeLetter === normalizedSecond.activeLetter
  );
}

function normalizeQueryForCompare(query: LocationQuery | LocationQueryRaw): string {
  return Object.keys(query)
    .sort((first, second) => first.localeCompare(second))
    .map((key) => {
      const value = query[key as keyof typeof query];
      if (Array.isArray(value)) {
        const firstValue = value[0];
        return `${key}=${firstValue == null ? '' : String(firstValue)}`;
      }

      return `${key}=${value == null ? '' : String(value)}`;
    })
    .join('&');
}

function areQueriesEqual(
  first: LocationQuery | LocationQueryRaw,
  second: LocationQuery | LocationQueryRaw,
): boolean {
  return normalizeQueryForCompare(first) === normalizeQueryForCompare(second);
}

function buildPaginationTokens(page: number, total: number): PaginationToken[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const tokens: PaginationToken[] = [1];
  const rangeStart = Math.max(2, page - 1);
  const rangeEnd = Math.min(total - 1, page + 1);

  if (rangeStart > 2) {
    tokens.push('ellipsis-left');
  }

  for (let pageNumber = rangeStart; pageNumber <= rangeEnd; pageNumber += 1) {
    tokens.push(pageNumber);
  }

  if (rangeEnd < total - 1) {
    tokens.push('ellipsis-right');
  }

  tokens.push(total);
  return tokens;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const resultsSectionRef = ref<HTMLElement | null>(null);

const {
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
} = useCocktailDiscovery();

const initialQueryState = parseHomeQuery(route.query);
void applyExternalState(toDiscoveryState(initialQueryState), false);

const queryState = computed(() => parseHomeQuery(route.query));

const limitOptions = LIMIT_OPTIONS;

const currentLimit = computed(() => queryState.value.limit);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(drinks.value.length / currentLimit.value)),
);
const currentPage = computed(() =>
  Math.min(queryState.value.page, totalPages.value),
);

const visibleDrinks = computed(() => {
  const startIndex = (currentPage.value - 1) * currentLimit.value;
  return drinks.value.slice(startIndex, startIndex + currentLimit.value);
});

const paginationTokens = computed(() =>
  buildPaginationTokens(currentPage.value, totalPages.value),
);

function scrollToResultsTop(options: ScrollIntoListOptions = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  const target = resultsSectionRef.value;
  if (!target) {
    return;
  }

  const topOffset = 92;
  const nextTop = target.getBoundingClientRect().top + window.scrollY - topOffset;

  window.scrollTo({
    top: Math.max(nextTop, 0),
    behavior: options.behavior ?? 'smooth',
  });
}

const sectionTitle = computed(() => {
  if (mode.value === 'search' && searchQuery.value.trim()) {
    return t('home.sectionTitle.search', { query: searchQuery.value.trim() });
  }

  if (mode.value === 'category' && activeCategory.value) {
    return localizeCategoryValue(activeCategory.value, t) ?? activeCategory.value;
  }

  if (mode.value === 'letter' && activeLetter.value) {
    return t('home.sectionTitle.letter', { letter: activeLetter.value });
  }

  return t('home.sectionTitle.all');
});

const emptyTitle = computed(() => {
  if (mode.value === 'search') {
    return t('home.empty.searchTitle');
  }

  if (mode.value === 'category') {
    return t('home.empty.categoryTitle');
  }

  if (mode.value === 'all') {
    return t('home.empty.allTitle');
  }

  return t('home.empty.letterTitle');
});

const emptyDescription = computed(() => {
  if (mode.value === 'search') {
    return t('home.empty.searchDescription');
  }

  if (mode.value === 'category' && activeCategory.value) {
    const localizedCategory =
      localizeCategoryValue(activeCategory.value, t) ?? activeCategory.value;
    return t('home.empty.categoryDescription', { category: localizedCategory });
  }

  if (mode.value === 'all') {
    return t('home.empty.allDescription');
  }

  return t('home.empty.letterDescription');
});

async function replaceHomeQuery(patch: Partial<HomeQueryState>): Promise<void> {
  const nextState = normalizeHomeQueryState({
    ...queryState.value,
    ...patch,
  });

  const nextQuery = buildHomeQuery(nextState);
  if (areQueriesEqual(route.query, nextQuery)) {
    return;
  }

  await router.replace({
    name: 'home',
    query: nextQuery,
  });
}

let searchQueryTimer: ReturnType<typeof setTimeout> | null = null;

function clearPendingSearchQuerySync(): void {
  if (!searchQueryTimer) {
    return;
  }

  clearTimeout(searchQueryTimer);
  searchQueryTimer = null;
}

function handleSearchInput(value: string): void {
  setSearch(value);
  clearPendingSearchQuerySync();

  searchQueryTimer = setTimeout(() => {
    const normalizedSearch = value.trim();

    if (normalizedSearch.length > 0) {
      void replaceHomeQuery({
        search: normalizedSearch,
        category: null,
        letter: null,
        page: 1,
      });
      return;
    }

    void replaceHomeQuery({
      search: '',
      category: null,
      letter: null,
      page: 1,
    });
  }, 420);
}

function handleCategorySelect(categoryName: string): void {
  clearPendingSearchQuerySync();
  setCategory(categoryName);

  void replaceHomeQuery({
    search: '',
    category: categoryName,
    letter: null,
    page: 1,
  });
}

function handleLetterSelect(letter: string): void {
  clearPendingSearchQuerySync();
  setLetter(letter);

  void replaceHomeQuery({
    search: '',
    category: null,
    letter,
    page: 1,
  });
}

function handleResetFilters(): void {
  clearPendingSearchQuerySync();
  resetFilters();

  void replaceHomeQuery({
    search: '',
    category: null,
    letter: null,
    page: 1,
  });
}

function goToPage(page: number): void {
  const normalizedPage = Math.max(1, Math.min(page, totalPages.value));
  if (normalizedPage === currentPage.value) {
    return;
  }

  void replaceHomeQuery({ page: normalizedPage }).then(() => {
    scrollToResultsTop();
  });
}

function handleLimitChange(event: Event): void {
  const nextLimit = Number.parseInt((event.target as HTMLSelectElement).value, 10);
  if (!LIMIT_OPTIONS.includes(nextLimit as LimitOption)) {
    return;
  }

  void replaceHomeQuery({
    limit: nextLimit as LimitOption,
    page: 1,
  }).then(() => {
    scrollToResultsTop();
  });
}

watch(
  () => route.query,
  async (nextQuery) => {
    const parsedState = parseHomeQuery(nextQuery);
    const canonicalQuery = buildHomeQuery(parsedState);

    if (!areQueriesEqual(nextQuery, canonicalQuery)) {
      await router.replace({
        name: 'home',
        query: canonicalQuery,
      });
      return;
    }

    const nextDiscoveryState = toDiscoveryState(parsedState);
    const currentDiscoveryState: DiscoveryRouteState = {
      searchQuery: searchQuery.value,
      activeCategory: activeCategory.value,
      activeLetter: activeLetter.value,
    };

    if (!areDiscoveryStatesEqual(nextDiscoveryState, currentDiscoveryState)) {
      await applyExternalState(nextDiscoveryState, true);
    }
  },
  { immediate: true },
);

watch(
  [() => queryState.value.page, totalPages],
  ([page, pages]) => {
    if (page > pages) {
      void replaceHomeQuery({ page: pages });
    }
  },
);

onBeforeUnmount(() => {
  clearPendingSearchQuerySync();
});
</script>

<style scoped>
.home-view {
  display: grid;
  gap: 1.8rem;
}

.home-controls {
  display: grid;
  gap: 1rem;
}

.home-results {
  padding-top: 0.4rem;
  display: grid;
  gap: 1rem;
}

.home-results__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.7rem;
}

.home-results__header h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 1.35rem + 1.1vw, 2.2rem);
  color: var(--color-text);
}

.home-results__header span {
  color: var(--color-muted);
  font-size: 0.86rem;
}

.home-results__error {
  border: 1px solid rgba(214, 84, 84, 0.32);
  background: rgba(94, 28, 28, 0.22);
  border-radius: 1rem;
  padding: 1rem;
  color: rgba(253, 225, 225, 0.92);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.home-results__error p {
  margin: 0;
}

.home-results__error button {
  border: 0;
  border-radius: 999px;
  padding: 0.52rem 0.82rem;
  font-weight: 700;
  background: rgba(245, 182, 135, 0.23);
  color: #fde1dd;
  cursor: pointer;
}

.home-pagination {
  margin-top: 0.5rem;
  border: 1px solid rgba(217, 173, 104, 0.18);
  border-radius: 1rem;
  background: linear-gradient(160deg, rgba(18, 19, 25, 0.86), rgba(12, 14, 18, 0.9));
  padding: 0.82rem 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.home-pagination__limit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: max-content;
}

.home-pagination__limit label {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.home-pagination__limit select {
  border: 1px solid rgba(217, 173, 104, 0.26);
  border-radius: 999px;
  background: rgba(10, 11, 15, 0.8);
  color: var(--color-text);
  font-weight: 600;
  padding: 0.4rem 0.7rem;
}

.home-pagination__controls {
  display: inline-flex;
  align-items: center;
  gap: 0.62rem;
  margin-left: auto;
}

.home-pagination__nav,
.home-pagination__page {
  border: 1px solid rgba(217, 173, 104, 0.24);
  border-radius: 999px;
  background: rgba(16, 18, 24, 0.85);
  color: var(--color-text);
  font-weight: 700;
  padding: 0.45rem 0.78rem;
  cursor: pointer;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.home-pagination__nav:hover,
.home-pagination__page:hover {
  border-color: rgba(217, 173, 104, 0.58);
  background: rgba(25, 28, 36, 0.95);
}

.home-pagination__nav:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.home-pagination__pages {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.38rem;
}

.home-pagination__page {
  min-width: 2.1rem;
}

.home-pagination__page--active {
  background: linear-gradient(140deg, #f1c782 0%, #c47638 100%);
  border-color: rgba(241, 199, 130, 0.88);
  color: #1a1309;
}

.home-pagination__ellipsis {
  color: var(--color-muted);
  font-size: 0.9rem;
  padding-inline: 0.1rem;
}

.home-pagination__summary {
  margin: 0 0 0 0.2rem;
  color: var(--color-muted);
  font-size: 0.8rem;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .home-pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .home-pagination__limit {
    justify-content: space-between;
  }

  .home-pagination__controls {
    margin-left: 0;
    justify-content: space-between;
  }

  .home-pagination__pages {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .home-pagination__summary {
    display: none;
  }
}

@media (max-width: 620px) {
  .home-results__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
