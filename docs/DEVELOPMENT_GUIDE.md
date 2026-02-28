# Development Guide

This guide is for developers maintaining or extending Noir Cocktails.

## 1. Local setup

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run test
npm run coverage
npm run build
```

## 2. Engineering conventions

### TypeScript

- Keep strict typing across all layers.
- Avoid `any`; prefer explicit interfaces and union types.
- Keep API DTOs and domain models separate.

### Components

- Keep components focused on view concerns.
- Use typed props and emits.
- Keep heavy orchestration in composables/services.

### Services

- Put all network calls in `src/services`.
- Reuse `apiClient` for transport concerns.
- Avoid direct fetch calls in views/components.

### Composables

- Encapsulate state machines and async orchestration.
- Expose a minimal, explicit public API.
- Manage timers and subscriptions with lifecycle cleanup.

### Stores

- Use Pinia only for cross-route/client-persistent state.
- Keep route-driven page state in query params, not in global store.

## 3. How to add a new feature

Use this sequence:

1. Define required domain types in `src/types`.
2. Extend DTO types only if API contract requires it.
3. Add service method(s) in `src/services/cocktailService.ts`.
4. Add mapping/normalization in `src/utils/mappers.ts` or relevant utility.
5. Add/extend composable orchestration.
6. Render through view + focused components.
7. Add i18n strings for all supported locales.
8. Validate by running typecheck, tests, and production build.

## 4. Route query state rules

For the home discovery page:

- Query params are the single source of truth for page/filter/search state.
- Always normalize and canonicalize query params before applying state.
- Preserve state consistency when navigating to details and returning.

Avoid introducing hidden in-memory state that diverges from URL query.

## 5. UI and UX rules

- Preserve the premium dark visual identity.
- Keep loading, empty, and error states explicit.
- Use smooth but restrained transitions.
- Maintain responsive behavior from mobile to widescreen.

## 6. i18n workflow

- Add keys to all locale files together.
- Keep naming consistent with existing key groups.
- Use dictionary mapping for API categorical values.
- Preserve fallback behavior for partial translations.

## 7. Persistence workflow

- LocalStorage access must go through `src/utils/storage.ts`.
- Add new keys in `src/utils/constants.ts`.
- Ensure JSON parse failures fail safely to defaults.

## 8. Performance notes

- Prefer abortable requests for rapidly changing inputs.
- Keep expensive derived values in computed state.
- Avoid duplicate API calls when route state is unchanged.
- Reuse caching only where staleness is acceptable (for example all-drinks list cache).

## 9. Quality checklist before merge

- `npm run typecheck` passes
- `npm run test` passes
- `npm run coverage` passes
- `npm run build` passes
- Home query state works for deep links
- Back navigation preserves listing context
- i18n keys exist in all locales
- Favorites persist across reloads
- Loading/empty/error UI still behaves correctly

## 10. Current gaps (recommended backlog)

- Expand integration tests for route-state edge cases
- Add end-to-end tests for discovery/favorites/details flows
- Optional PWA/offline strategy
- Configurable API and translation endpoints via environment variables
