<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="brand" to="/">
        <span class="brand__dot" aria-hidden="true" />
        Noir Cocktails
      </RouterLink>

      <nav class="app-nav" :aria-label="t('nav.aria')">
        <div class="app-nav__links">
          <RouterLink class="app-nav__link" to="/">{{ t('nav.explore') }}</RouterLink>
          <RouterLink class="app-nav__link app-nav__favorites" to="/favorites">
            {{ t('nav.favorites') }}
            <span class="app-nav__badge">{{ favoritesStore.totalFavorites }}</span>
          </RouterLink>
        </div>
        <LanguageSwitcher class="app-nav__locale" />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useFavoritesStore } from '@/stores/favorites';

const favoritesStore = useFavoritesStore();
const { t } = useI18n();
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(14px);
  background: linear-gradient(
    180deg,
    rgba(10, 11, 14, 0.88) 0%,
    rgba(10, 11, 14, 0.58) 100%
  );
  border-bottom: 1px solid rgba(217, 173, 104, 0.14);
}

.app-header__inner {
  min-height: 4.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 1rem + 0.8vw, 1.65rem);
  letter-spacing: 0.04em;
}

.brand__dot {
  width: 0.62rem;
  height: 0.62rem;
  border-radius: 999px;
  background: radial-gradient(circle at top, #f5c374, #b06a36 74%);
  box-shadow: 0 0 22px rgba(245, 195, 116, 0.55);
}

.app-nav {
  display: inline-grid;
  align-items: center;
  justify-content: flex-end;
  grid-template-columns: auto auto;
  gap: 0.4rem;
  min-width: 0;
}

.app-nav__links {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.app-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.6rem 0.95rem;
  transition: color 240ms ease, border-color 240ms ease, background-color 240ms ease;
}

.app-nav__link:hover,
.app-nav__link.router-link-active {
  color: var(--color-text);
  border-color: rgba(217, 173, 104, 0.24);
  background: rgba(217, 173, 104, 0.08);
}

.app-nav__badge {
  min-width: 1.35rem;
  height: 1.35rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(217, 173, 104, 0.18);
  color: var(--color-text);
  font-size: 0.74rem;
  font-weight: 700;
}

@media (max-width: 820px) {
  .app-header__inner {
    gap: 0.6rem;
  }

  .brand {
    font-size: clamp(1.12rem, 1rem + 0.9vw, 1.35rem);
  }

  .app-nav__link {
    font-size: 0.82rem;
    padding: 0.5rem 0.78rem;
  }
}

@media (max-width: 700px) {
  .app-header__inner {
    min-height: 4.25rem;
    padding-block: 0.6rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: stretch;
  }

  .brand {
    justify-self: start;
  }

  .app-nav {
    width: 100%;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }

  .app-nav__links {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
  }

  .app-nav__link {
    justify-content: center;
    width: 100%;
    padding: 0.56rem 0.72rem;
  }

  .app-nav__locale {
    width: 100%;
  }

  .app-nav__locale :deep(.language-switcher) {
    width: 100%;
    justify-content: stretch;
  }

  .app-nav__locale :deep(.language-switcher__select) {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .app-header__inner {
    padding-top: 0.5rem;
    padding-bottom: 0.55rem;
  }

  .brand {
    font-size: 1.07rem;
  }

  .app-nav__link {
    font-size: 0.78rem;
    padding: 0.52rem 0.62rem;
  }
}
</style>
