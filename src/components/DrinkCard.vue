<template>
  <article class="drink-card">
    <RouterLink class="drink-card__link" :to="{ name: 'drink-details', params: { id: drink.id } }">
      <div class="drink-card__image-wrap">
        <img
          class="drink-card__image"
          :src="drink.thumbnail"
          :alt="drink.name"
          loading="lazy"
        />
      </div>

      <div class="drink-card__body">
        <p class="drink-card__category">{{ localizedCategory }}</p>
        <h3 class="drink-card__name">{{ drink.name }}</h3>

        <p v-if="metaItems.length > 0" class="drink-card__meta">
          <span v-for="item in metaItems" :key="item">{{ item }}</span>
        </p>
      </div>
    </RouterLink>

    <FavoriteButton class="drink-card__favorite" :drink="drink" />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import type { DrinkSummary } from '@/types/cocktail';
import {
  localizeAlcoholicValue,
  localizeCategoryValue,
  localizeGlassValue,
} from '@/utils/apiLocalization';

import FavoriteButton from './FavoriteButton.vue';

interface DrinkCardProps {
  drink: DrinkSummary;
}

const props = defineProps<DrinkCardProps>();
const { t } = useI18n();

const localizedCategory = computed(
  () => localizeCategoryValue(props.drink.category, t) ?? t('drink.defaultCategory'),
);

const metaItems = computed(() =>
  [
    localizeAlcoholicValue(props.drink.alcoholic, t),
    localizeGlassValue(props.drink.glass, t),
  ].filter(
    (item): item is string => Boolean(item),
  ),
);
</script>

<style scoped>
.drink-card {
  position: relative;
  border-radius: 1.18rem;
  overflow: hidden;
  border: 1px solid rgba(215, 174, 114, 0.16);
  background: linear-gradient(160deg, rgba(25, 27, 34, 0.92), rgba(17, 18, 22, 0.93));
  box-shadow: 0 18px 32px rgba(3, 3, 5, 0.35);
  transition: transform 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
}

.drink-card:hover {
  transform: translateY(-4px);
  border-color: rgba(236, 188, 117, 0.44);
  box-shadow: 0 24px 38px rgba(3, 3, 5, 0.45);
}

.drink-card__link {
  text-decoration: none;
  color: inherit;
  display: grid;
  min-height: 100%;
}

.drink-card__image-wrap {
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.drink-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 360ms ease;
}

.drink-card:hover .drink-card__image {
  transform: scale(1.05);
}

.drink-card__body {
  display: grid;
  gap: 0.58rem;
  padding: 1rem 1rem 1.08rem;
}

.drink-card__category {
  margin: 0;
  color: var(--color-accent-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.67rem;
  font-weight: 700;
}

.drink-card__name {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.26rem;
  line-height: 1.1;
  color: var(--color-text);
}

.drink-card__meta {
  margin: 0;
  color: var(--color-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.76rem;
}

.drink-card__meta span {
  border-radius: 999px;
  border: 1px solid rgba(216, 173, 108, 0.16);
  background: rgba(216, 173, 108, 0.08);
  padding: 0.2rem 0.5rem;
}

.drink-card__favorite {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}
</style>
