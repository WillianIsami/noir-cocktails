import type {
  CocktailDbCategoryDto,
  CocktailDbDrinkDto,
} from '@/types/api';
import type {
  CategoryItem,
  DrinkDetails,
  DrinkSummary,
  IngredientDetail,
} from '@/types/cocktail';
import { buildIngredientImageUrl } from '@/utils/cocktailMedia';

const MAX_INGREDIENTS = 15;

function normalizeValue(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function mapToDrinkSummary(drink: CocktailDbDrinkDto): DrinkSummary {
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    thumbnail: drink.strDrinkThumb,
    category: normalizeValue(drink.strCategory),
    alcoholic: normalizeValue(drink.strAlcoholic),
    glass: normalizeValue(drink.strGlass),
  };
}

function mapIngredients(drink: CocktailDbDrinkDto): IngredientDetail[] {
  const ingredients: IngredientDetail[] = [];

  for (let index = 1; index <= MAX_INGREDIENTS; index += 1) {
    const ingredient = normalizeValue(drink[`strIngredient${index}`]);
    if (!ingredient) {
      continue;
    }

    const measure = normalizeValue(drink[`strMeasure${index}`]) ?? '';
    ingredients.push({
      name: ingredient,
      measure,
      thumbnail: buildIngredientImageUrl(ingredient),
    });
  }

  return ingredients;
}

export function mapToDrinkDetails(drink: CocktailDbDrinkDto): DrinkDetails {
  const summary = mapToDrinkSummary(drink);
  const instructionsEn = normalizeValue(drink.strInstructions) ?? '';
  const instructionsEs = normalizeValue(drink.strInstructionsES);

  return {
    ...summary,
    instructions: instructionsEn,
    instructionsTranslations: {
      en: instructionsEn,
      es: instructionsEs,
    },
    tags:
      normalizeValue(drink.strTags)
        ?.split(',')
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [],
    ingredients: mapIngredients(drink),
    videoUrl: normalizeValue(drink.strVideo),
  };
}

export function mapToCategories(categories: CocktailDbCategoryDto[]): CategoryItem[] {
  return categories.map((category) => ({
    id: category.strCategory.toLowerCase().replace(/\s+/g, '-'),
    name: category.strCategory,
  }));
}
