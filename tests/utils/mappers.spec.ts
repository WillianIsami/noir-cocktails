import type { CocktailDbDrinkDto } from '@/types/api';
import { mapToCategories, mapToDrinkDetails, mapToDrinkSummary } from '@/utils/mappers';

const baseDrink: CocktailDbDrinkDto = {
  idDrink: '11007',
  strDrink: 'Margarita',
  strDrinkThumb: 'https://cdn.test/margarita.jpg',
  strCategory: 'Cocktail',
  strAlcoholic: 'Alcoholic',
  strGlass: 'Cocktail glass',
  strInstructions: 'Shake with ice.',
  strInstructionsES: 'Agitar con hielo.',
  strTags: 'IBA,Classic',
  strVideo: 'https://www.youtube.com/watch?v=abc123',
  strIngredient1: 'Tequila',
  strMeasure1: '2 oz',
  strIngredient2: 'Lime juice',
  strMeasure2: null,
};

describe('mappers', () => {
  it('maps summary fields', () => {
    expect(mapToDrinkSummary(baseDrink)).toEqual({
      id: '11007',
      name: 'Margarita',
      thumbnail: 'https://cdn.test/margarita.jpg',
      category: 'Cocktail',
      alcoholic: 'Alcoholic',
      glass: 'Cocktail glass',
    });
  });

  it('maps details with tags, ingredient thumbnails, and instruction translations', () => {
    const details = mapToDrinkDetails(baseDrink);

    expect(details.instructions).toBe('Shake with ice.');
    expect(details.instructionsTranslations).toEqual({
      en: 'Shake with ice.',
      es: 'Agitar con hielo.',
    });
    expect(details.tags).toEqual(['IBA', 'Classic']);
    expect(details.ingredients).toEqual([
      {
        name: 'Tequila',
        measure: '2 oz',
        thumbnail: 'https://www.thecocktaildb.com/images/ingredients/Tequila-small.png',
      },
      {
        name: 'Lime juice',
        measure: '',
        thumbnail: 'https://www.thecocktaildb.com/images/ingredients/Lime%20juice-small.png',
      },
    ]);
  });

  it('maps categories list', () => {
    expect(
      mapToCategories([{ strCategory: 'Coffee / Tea' }, { strCategory: 'Ordinary Drink' }]),
    ).toEqual([
      { id: 'coffee-/-tea', name: 'Coffee / Tea' },
      { id: 'ordinary-drink', name: 'Ordinary Drink' },
    ]);
  });
});
