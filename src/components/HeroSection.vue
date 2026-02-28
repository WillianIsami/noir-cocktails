<template>
  <section class="hero-section container">
    <div class="hero-section__content">
      <p class="hero-section__eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1 class="hero-section__title">{{ t('hero.title') }}</h1>
      <p class="hero-section__description">
        {{ t('hero.description') }}
      </p>

      <div class="hero-section__stats">
        <article class="hero-stat">
          <p class="hero-stat__label">{{ t('hero.stats.searchLabel') }}</p>
          <p class="hero-stat__value">{{ t('hero.stats.searchValue') }}</p>
        </article>
        <article class="hero-stat">
          <p class="hero-stat__label">{{ t('hero.stats.filtersLabel') }}</p>
          <p class="hero-stat__value">{{ t('hero.stats.filtersValue') }}</p>
        </article>
        <article class="hero-stat">
          <p class="hero-stat__label">{{ t('hero.stats.collectionLabel') }}</p>
          <p class="hero-stat__value">{{ t('hero.stats.collectionValue') }}</p>
        </article>
      </div>
    </div>

    <div class="hero-gallery" aria-hidden="true">
      <figure class="hero-gallery__card hero-gallery__card--primary">
        <img :src="heroImages.primary" alt="" loading="lazy" />
      </figure>
      <figure class="hero-gallery__card hero-gallery__card--top">
        <img :src="heroImages.top" alt="" loading="lazy" />
      </figure>
      <figure class="hero-gallery__card hero-gallery__card--bottom">
        <img :src="heroImages.bottom" alt="" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const heroImages = {
  primary:
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1400&q=80',
  top:
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80',
  bottom:
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
};
</script>

<style scoped>
.hero-section {
  padding-top: clamp(2.5rem, 7vw, 4.6rem);
  display: grid;
  gap: 1.2rem;
  position: relative;
}

.hero-section__content {
  display: grid;
  gap: 1.05rem;
}

.hero-section__eyebrow {
  color: var(--color-accent-soft);
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.75rem;
  font-weight: 700;
}

.hero-section__title {
  margin: 0;
  max-width: 16ch;
  font-family: var(--font-heading);
  line-height: 0.95;
  letter-spacing: 0.015em;
  font-size: clamp(2.3rem, 7vw, 5rem);
  color: var(--color-text);
}

.hero-section__description {
  max-width: 54ch;
  color: var(--color-muted);
  line-height: 1.65;
  font-size: clamp(1rem, 0.94rem + 0.42vw, 1.15rem);
}

.hero-section__stats {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.8rem;
}

.hero-stat {
  border: 1px solid rgba(217, 173, 104, 0.18);
  background: linear-gradient(150deg, rgba(25, 27, 33, 0.8), rgba(14, 15, 19, 0.82));
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.hero-stat__label {
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(237, 225, 205, 0.66);
  margin: 0;
}

.hero-stat__value {
  margin: 0.32rem 0 0;
  color: var(--color-text);
  font-weight: 600;
}

.hero-gallery {
  display: none;
}

.hero-gallery__card {
  margin: 0;
  border-radius: 1.1rem;
  overflow: hidden;
  border: 1px solid rgba(217, 173, 104, 0.2);
  box-shadow: 0 20px 38px rgba(2, 2, 4, 0.4);
}

.hero-gallery__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.05);
}

@media (min-width: 780px) {
  .hero-section__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .hero-section {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.85fr);
    align-items: end;
  }

  .hero-gallery {
    display: grid;
    min-height: 520px;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.75rem;
  }

  .hero-gallery__card--primary {
    grid-row: 1 / span 2;
  }
}
</style>
