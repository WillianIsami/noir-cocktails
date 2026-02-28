export interface CocktailDbListResponse<T> {
  drinks: T[] | null;
}

export interface CocktailDbCategoryDto {
  strCategory: string;
}

export interface CocktailDbDrinkDto {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string | null;
  strAlcoholic?: string | null;
  strGlass?: string | null;
  strInstructions?: string | null;
  strInstructionsES?: string | null;
  strInstructionsDE?: string | null;
  strInstructionsFR?: string | null;
  strInstructionsIT?: string | null;
  'strInstructionsZH-HANS'?: string | null;
  'strInstructionsZH-HANT'?: string | null;
  strTags?: string | null;
  strVideo?: string | null;
  [ingredient: `strIngredient${number}`]: string | null | undefined;
  [measure: `strMeasure${number}`]: string | null | undefined;
}
