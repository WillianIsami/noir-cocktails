const CATEGORY_KEY_BY_TOKEN: Record<string, string> = {
  ordinary_drink: 'apiValues.categories.ordinary_drink',
  cocktail: 'apiValues.categories.cocktail',
  shake: 'apiValues.categories.shake',
  other_unknown: 'apiValues.categories.other_unknown',
  cocoa: 'apiValues.categories.cocoa',
  shot: 'apiValues.categories.shot',
  coffee_tea: 'apiValues.categories.coffee_tea',
  homemade_liqueur: 'apiValues.categories.homemade_liqueur',
  punch_party_drink: 'apiValues.categories.punch_party_drink',
  beer: 'apiValues.categories.beer',
  soft_drink_soda: 'apiValues.categories.soft_drink_soda',
};

const ALCOHOLIC_KEY_BY_TOKEN: Record<string, string> = {
  alcoholic: 'apiValues.alcoholic.alcoholic',
  non_alcoholic: 'apiValues.alcoholic.non_alcoholic',
  optional_alcohol: 'apiValues.alcoholic.optional_alcohol',
};

const GLASS_KEY_BY_TOKEN: Record<string, string> = {
  highball_glass: 'apiValues.glasses.highball_glass',
  cocktail_glass: 'apiValues.glasses.cocktail_glass',
  old_fashioned_glass: 'apiValues.glasses.old_fashioned_glass',
  collins_glass: 'apiValues.glasses.collins_glass',
  pousse_cafe_glass: 'apiValues.glasses.pousse_cafe_glass',
  champagne_flute: 'apiValues.glasses.champagne_flute',
  whiskey_sour_glass: 'apiValues.glasses.whiskey_sour_glass',
  cognac_snifter: 'apiValues.glasses.cognac_snifter',
  brandy_snifter: 'apiValues.glasses.brandy_snifter',
  white_wine_glass: 'apiValues.glasses.white_wine_glass',
  nick_and_nora_glass: 'apiValues.glasses.nick_and_nora_glass',
  hurricane_glass: 'apiValues.glasses.hurricane_glass',
  coffee_mug: 'apiValues.glasses.coffee_mug',
  shot_glass: 'apiValues.glasses.shot_glass',
  jar: 'apiValues.glasses.jar',
  irish_coffee_cup: 'apiValues.glasses.irish_coffee_cup',
  punch_bowl: 'apiValues.glasses.punch_bowl',
  pitcher: 'apiValues.glasses.pitcher',
  pint_glass: 'apiValues.glasses.pint_glass',
  copper_mug: 'apiValues.glasses.copper_mug',
  wine_glass: 'apiValues.glasses.wine_glass',
  beer_mug: 'apiValues.glasses.beer_mug',
  margarita_coupette_glass: 'apiValues.glasses.margarita_coupette_glass',
  beer_pilsner: 'apiValues.glasses.beer_pilsner',
  mason_jar: 'apiValues.glasses.mason_jar',
  martini_glass: 'apiValues.glasses.martini_glass',
  balloon_glass: 'apiValues.glasses.balloon_glass',
};

const SEARCH_ALIASES: Record<string, string> = {
  pinha_colada: 'pina colada',
  pina_colada: 'pina colada',
  cuba_libre: 'cuba libre',
  cuba_livre: 'cuba libre',
  destornillador: 'screwdriver',
  parafuso: 'screwdriver',
  gin_tonica: 'gin tonic',
  gin_tonico: 'gin tonic',
};

type TranslateFn = (key: string) => string;

function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeToken(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function localizeValue(
  rawValue: string | null,
  dictionary: Record<string, string>,
  t: TranslateFn,
): string | null {
  if (!rawValue) {
    return null;
  }

  const key = dictionary[normalizeToken(rawValue)];
  return key ? t(key) : rawValue;
}

export function localizeCategoryValue(value: string | null, t: TranslateFn): string | null {
  return localizeValue(value, CATEGORY_KEY_BY_TOKEN, t);
}

export function localizeAlcoholicValue(value: string | null, t: TranslateFn): string | null {
  return localizeValue(value, ALCOHOLIC_KEY_BY_TOKEN, t);
}

export function localizeGlassValue(value: string | null, t: TranslateFn): string | null {
  return localizeValue(value, GLASS_KEY_BY_TOKEN, t);
}

export function normalizeSearchQueryForApi(rawQuery: string): string {
  const normalized = stripDiacritics(rawQuery).replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '';
  }

  const aliasToken = normalizeToken(normalized);
  return SEARCH_ALIASES[aliasToken] ?? normalized;
}
