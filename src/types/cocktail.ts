export interface IngredientDetail {
  name: string;
  measure: string;
  thumbnail: string;
}

export interface DrinkSummary {
  id: string;
  name: string;
  thumbnail: string;
  category: string | null;
  alcoholic: string | null;
  glass: string | null;
}

export interface DrinkInstructionsTranslations {
  en: string;
  es: string | null;
}

export interface DrinkDetails extends DrinkSummary {
  instructions: string;
  instructionsTranslations: DrinkInstructionsTranslations;
  tags: string[];
  ingredients: IngredientDetail[];
  videoUrl: string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
}

export type DiscoveryMode = 'all' | 'search' | 'letter' | 'category';
