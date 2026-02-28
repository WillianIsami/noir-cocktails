# Internationalization (i18n)

This document explains language support and localization behavior in Noir Cocktails.

## 1. Supported locales

- `pt-BR` (default)
- `en-US`
- `es-ES`

i18n entrypoint: `src/i18n/index.ts`

## 2. Locale resolution and persistence

Initial locale is resolved in this order:

1. Stored user preference (`localStorage`, key `noir-cocktails-locale`)
2. Browser locale (`navigator.language`) mapped by prefix
3. Default locale (`pt-BR`)

When locale changes:

- `i18n.global.locale` is updated
- `<html lang="...">` is updated
- New locale is persisted in LocalStorage

## 3. Message files

Locale files:

- `src/i18n/locales/pt-BR.ts`
- `src/i18n/locales/en-US.ts`
- `src/i18n/locales/es-ES.ts`

Message groups include:

- Navigation and page labels
- Home and pagination strings
- Empty/error/loading texts
- Detail page labels
- API value dictionaries (categories, alcoholic profile, glass)

## 4. Localizing API values

Certain fields from TheCocktailDB are English tokens.

`src/utils/apiLocalization.ts` normalizes and maps tokens to i18n keys:

- Category (`strCategory`)
- Alcoholic profile (`strAlcoholic`)
- Glass (`strGlass`)

If a token is not mapped, the raw API value is returned.

## 5. Search query normalization

To improve multilingual search inputs against an English-first API, the app uses `normalizeSearchQueryForApi()`:

- Removes diacritics
- Normalizes spacing
- Applies alias map for common localized terms

Examples:

- `pinha colada` -> `pina colada`
- `cuba livre` -> `cuba libre`

## 6. Instruction translation behavior

Instruction text is handled separately from static UI text.

### Data source preference

1. `en-US`: use `strInstructions`
2. `es-ES`: prefer `strInstructionsES` when available
3. `pt-BR`: translate from English at runtime
4. Unknown locale: fallback to English

### Runtime fallback

File: `src/services/translationService.ts`

- Uses translation endpoint with `sl=en` and target language (`pt` or `es`)
- Caches translated sentences in memory
- Returns `null` on failure without breaking UI

UI behavior in details page:

- Shows "translating" helper text while request is in progress
- Shows source hint when original English text is displayed as fallback

## 7. How to add a new locale

1. Add locale code to `SUPPORTED_LOCALES` in `src/i18n/index.ts`.
2. Create new locale file in `src/i18n/locales`.
3. Register messages object in `src/i18n/index.ts`.
4. Add label key in `locale` section for language switcher.
5. Update locale option type map in `LanguageSwitcher.vue`.
6. Add API token dictionary values if needed.
7. Validate all key paths exist in all locale files.

## 8. Translation quality guidelines

- Keep message keys semantic and stable.
- Avoid embedding business logic in locale strings.
- Prefer API-native translations when available.
- Keep fallback behavior explicit and user-friendly.
- Do not translate identifiers used for API query correctness (for example drink names used in search input guidance).

## 9. Known caveats

- Runtime translation endpoint is not a full localization platform.
- Translation output may vary over time.
- Long instruction text translation depends on network availability.

If this app moves to production scale, replace runtime fallback with a controlled translation provider or pre-translated content pipeline.
