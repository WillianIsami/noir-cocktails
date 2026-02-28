import { apiClient } from '@/services/apiClient';
import type {
  CocktailDbCategoryDto,
  CocktailDbDrinkDto,
  CocktailDbListResponse,
} from '@/types/api';
import type { CategoryItem, DrinkDetails, DrinkSummary } from '@/types/cocktail';
import {
  mapToCategories,
  mapToDrinkDetails,
  mapToDrinkSummary,
} from '@/utils/mappers';
import { normalizeSearchQueryForApi } from '@/utils/apiLocalization';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
let cachedAllDrinks: DrinkSummary[] | null = null;

function mapDrinkList(response: CocktailDbListResponse<CocktailDbDrinkDto>): DrinkSummary[] {
  return (response.drinks ?? []).map(mapToDrinkSummary);
}

function mergeUniqueDrinks(groups: DrinkSummary[][]): DrinkSummary[] {
  const uniqueById = new Map<string, DrinkSummary>();

  groups.flat().forEach((drink) => {
    if (!uniqueById.has(drink.id)) {
      uniqueById.set(drink.id, drink);
    }
  });

  return Array.from(uniqueById.values());
}

export const cocktailService = {
  async listCategories(signal?: AbortSignal): Promise<CategoryItem[]> {
    const response = await apiClient.get<CocktailDbListResponse<CocktailDbCategoryDto>>(
      'list.php?c=list',
      signal,
    );

    return mapToCategories(response.drinks ?? []);
  },

  async searchByName(name: string, signal?: AbortSignal): Promise<DrinkSummary[]> {
    const normalizedName = normalizeSearchQueryForApi(name);
    const query = encodeURIComponent(normalizedName);
    const response = await apiClient.get<CocktailDbListResponse<CocktailDbDrinkDto>>(
      `search.php?s=${query}`,
      signal,
    );

    return mapDrinkList(response);
  },

  async searchByFirstLetter(letter: string, signal?: AbortSignal): Promise<DrinkSummary[]> {
    const query = encodeURIComponent(letter);
    const response = await apiClient.get<CocktailDbListResponse<CocktailDbDrinkDto>>(
      `search.php?f=${query}`,
      signal,
    );

    return mapDrinkList(response);
  },

  async listAllDrinks(signal?: AbortSignal): Promise<DrinkSummary[]> {
    if (cachedAllDrinks) {
      return cachedAllDrinks;
    }

    const settledResults = await Promise.allSettled(
      ALPHABET.map((letter) => cocktailService.searchByFirstLetter(letter, signal)),
    );

    const abortedResult = settledResults.find(
      (result) =>
        result.status === 'rejected'
        && result.reason instanceof DOMException
        && result.reason.name === 'AbortError',
    );
    if (abortedResult && abortedResult.status === 'rejected') {
      throw abortedResult.reason;
    }

    const successfulGroups = settledResults
      .filter(
        (result): result is PromiseFulfilledResult<DrinkSummary[]> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);

    const mergedDrinks = mergeUniqueDrinks(successfulGroups);

    if (mergedDrinks.length === 0) {
      throw new Error('Unable to fetch drinks.');
    }

    cachedAllDrinks = mergedDrinks;
    return mergedDrinks;
  },

  async filterByCategory(category: string, signal?: AbortSignal): Promise<DrinkSummary[]> {
    const query = encodeURIComponent(category);
    const response = await apiClient.get<CocktailDbListResponse<CocktailDbDrinkDto>>(
      `filter.php?c=${query}`,
      signal,
    );

    return mapDrinkList(response);
  },

  async getById(id: string, signal?: AbortSignal): Promise<DrinkDetails | null> {
    const query = encodeURIComponent(id);
    const response = await apiClient.get<CocktailDbListResponse<CocktailDbDrinkDto>>(
      `lookup.php?i=${query}`,
      signal,
    );

    const drink = response.drinks?.[0];
    return drink ? mapToDrinkDetails(drink) : null;
  },
};
