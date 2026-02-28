# Noir Cocktails

Noir Cocktails is a premium cocktail discovery web app built with Vue 3, TypeScript, and Vite.
It focuses on production-style frontend architecture, strong typing, multilingual UX, and polished visual design.

## Project overview

Noir Cocktails is a project focused on a high-quality experience for discovering, filtering, and saving cocktail recipes.

## Product preview

### Home (desktop, full page)

![Noir Cocktails home page on desktop](docs/images/home-desktop-full.png)

### Home (mobile, full page)

<img src="docs/images/home-mobile-full.png" alt="Noir Cocktails home page on mobile" width="320" />

### Drink details (desktop, full page)

![Noir Cocktails drink details page on desktop](docs/images/drink-details-desktop-full.png)

### Drink details (mobile, full page)

<img src="docs/images/drink-details-mobile-full.png" alt="Noir Cocktails drink details page on mobile" width="320" />

### Favorites (desktop, full page)

![Noir Cocktails favorites page on desktop](docs/images/favorites-desktop-full.png)

### Favorites (mobile, full page)

<img src="docs/images/favorites-mobile-full.png" alt="Noir Cocktails favorites page on mobile" width="320" />

Favorites preview images use seeded local favorites to show the populated experience.

## Core features

- Cocktail discovery with search, category filter, and alphabet filter.
- Client-side pagination with URL query state persistence.
- Consistent navigation state when opening details and returning to listing.
- Favorites management with Pinia + LocalStorage persistence.
- Drink details with ingredients, measures, optional video embed, and translated instructions.
- Multilingual UI (`pt-BR`, `en-US`, `es-ES`) with persisted locale.
- Premium dark visual system with responsive behavior for mobile, tablet, desktop, and widescreen.

## Tech stack

- Vue 3 (Composition API)
- TypeScript (strict mode)
- Vite
- Vue Router
- Pinia
- Vue I18n
- SCSS

## API

Primary data source:

- TheCocktailDB: `https://www.thecocktaildb.com/api.php`

Translation fallback for instructions (when native API translation is not available):

- Google Translate endpoint: `https://translate.googleapis.com/translate_a/single`

See details in [`docs/API_AND_DATA_FLOW.md`](docs/API_AND_DATA_FLOW.md).

## Getting started

### 1) Prerequisites

- Node.js 18+
- npm 9+

### 2) Install dependencies

```bash
npm install
```

### 3) Start local development

```bash
npm run dev
```

### 4) Type-check and build

```bash
npm run typecheck
npm run test
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Available scripts

- `npm run dev`: Starts Vite dev server.
- `npm run build`: Runs `vue-tsc --noEmit` then Vite production build.
- `npm run preview`: Serves the built app from `dist`.
- `npm run typecheck`: Runs TypeScript checks only.
- `npm run test`: Runs the Vitest test suite.
- `npm run coverage`: Runs tests with coverage report.

## Project structure

```text
src/
  assets/
  components/
  composables/
  i18n/
  router/
  services/
  stores/
  styles/
  types/
  utils/
  views/
```

Detailed architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Routing and persistent UI state

Main routes:

- `/`: Home discovery page
- `/favorites`: Favorite drinks
- `/drink/:id`: Drink details

Home view keeps discovery state in URL query params:

- `q`: Search query
- `category`: Selected category
- `filter=letter` + `letter`: Explicit letter filter
- `page`: Current page
- `limit`: Items per page

This allows consistent back/forward navigation and deep links.

## Internationalization strategy

- Default locale: `pt-BR`
- Supported locales: `pt-BR`, `en-US`, `es-ES`
- Locale is stored in LocalStorage and restored on startup.
- API text values (category, alcoholic profile, glass) are localized via dictionary mapping.
- Instructions are resolved by locale with fallback logic.

See [`docs/INTERNATIONALIZATION.md`](docs/INTERNATIONALIZATION.md).

## Architectural highlights

- Clear separation between UI, domain mapping, data services, and shared utilities.
- Strong DTO-to-domain mapping layer to isolate API shape changes.
- Composable-driven state orchestration for discovery flow.
- Abortable requests and debounced search to improve UX and network efficiency.
- Reusable components with strict prop and event typing.

## Current constraints and design decisions

- TheCocktailDB does not provide native server pagination (`page`, `limit`, `total`).
  - Solution: data is fetched by current filters, then paginated client-side.
- There is no true "list all" endpoint.
  - Solution: `listAllDrinks()` aggregates `search.php?f=` across `a-z` and deduplicates results.
- No service worker/PWA yet.
  - App requires network access for live API and translation fallback.

## Documentation index

- [Showcase](docs/SHOWCASE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API and Data Flow](docs/API_AND_DATA_FLOW.md)
- [Internationalization](docs/INTERNATIONALIZATION.md)
- [Development Guide](docs/DEVELOPMENT_GUIDE.md)

## License

This project is licensed under the [MIT License](LICENSE).
