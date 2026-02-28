const INGREDIENT_IMAGE_BASE_URL = 'https://www.thecocktaildb.com/images/ingredients';

export function buildIngredientImageUrl(
  ingredientName: string,
  size: 'small' | 'medium' = 'small',
): string {
  const normalizedIngredientName = ingredientName.trim();
  if (!normalizedIngredientName) {
    return '';
  }

  return `${INGREDIENT_IMAGE_BASE_URL}/${encodeURIComponent(normalizedIngredientName)}-${size}.png`;
}
