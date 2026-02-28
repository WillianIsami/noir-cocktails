import { buildIngredientImageUrl } from '@/utils/cocktailMedia';

describe('cocktailMedia', () => {
  it('builds ingredient image URLs with encoded names', () => {
    expect(buildIngredientImageUrl('Lime Juice')).toBe(
      'https://www.thecocktaildb.com/images/ingredients/Lime%20Juice-small.png',
    );
    expect(buildIngredientImageUrl('Lime Juice', 'medium')).toBe(
      'https://www.thecocktaildb.com/images/ingredients/Lime%20Juice-medium.png',
    );
  });

  it('returns empty string for empty ingredient names', () => {
    expect(buildIngredientImageUrl('   ')).toBe('');
  });
});
