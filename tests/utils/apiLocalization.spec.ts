import {
  localizeAlcoholicValue,
  localizeCategoryValue,
  localizeGlassValue,
  normalizeSearchQueryForApi,
} from '@/utils/apiLocalization';

const translations: Record<string, string> = {
  'apiValues.categories.cocktail': 'Coquetel',
  'apiValues.alcoholic.alcoholic': 'Alcoólico',
  'apiValues.glasses.cocktail_glass': 'Taça de coquetel',
};

const t = (key: string): string => translations[key] ?? key;

describe('apiLocalization', () => {
  it('localizes known category/alcoholic/glass tokens', () => {
    expect(localizeCategoryValue('Cocktail', t)).toBe('Coquetel');
    expect(localizeAlcoholicValue('Alcoholic', t)).toBe('Alcoólico');
    expect(localizeGlassValue('Cocktail glass', t)).toBe('Taça de coquetel');
  });

  it('returns original value when there is no mapping', () => {
    expect(localizeCategoryValue('Experimental Category', t)).toBe('Experimental Category');
  });

  it('returns null for empty values', () => {
    expect(localizeCategoryValue(null, t)).toBeNull();
    expect(localizeAlcoholicValue(null, t)).toBeNull();
    expect(localizeGlassValue(null, t)).toBeNull();
  });

  it('normalizes localized aliases for API search compatibility', () => {
    expect(normalizeSearchQueryForApi('  piñha   colada ')).toBe('pina colada');
    expect(normalizeSearchQueryForApi('cuba livre')).toBe('cuba libre');
    expect(normalizeSearchQueryForApi('')).toBe('');
  });
});
