<template>
  <article class="drink-details-panel">
    <div class="drink-details-panel__media">
      <img :src="drink.thumbnail" :alt="drink.name" class="drink-details-panel__image" />
      <FavoriteButton class="drink-details-panel__favorite" :drink="favoritePayload" />
    </div>

    <div class="drink-details-panel__body">
      <p class="drink-details-panel__category">
        {{ localizedCategory }}
      </p>
      <h1 class="drink-details-panel__title">{{ drink.name }}</h1>

      <div v-if="metaItems.length > 0" class="drink-details-panel__meta">
        <p v-for="item in metaItems" :key="item.label">
          <span>{{ item.label }}</span>
          {{ item.value }}
        </p>
      </div>

      <section class="drink-details-panel__section">
        <h2>{{ t('drink.ingredientsTitle') }}</h2>

        <ul v-if="drink.ingredients.length > 0">
          <li v-for="ingredient in drink.ingredients" :key="ingredient.name">
            <span class="ingredient-item__main">
              <span
                v-if="showIngredientImage(ingredient)"
                class="ingredient-item__thumb"
                aria-hidden="true"
              >
                <img
                  :src="ingredient.thumbnail"
                  :alt="t('drink.ingredientImageAlt', { ingredient: ingredient.name })"
                  loading="lazy"
                  @error="markIngredientImageAsBroken(ingredient.name)"
                />
              </span>
              <span>{{ ingredient.name }}</span>
            </span>
            <small>{{ ingredient.measure || t('drink.toTaste') }}</small>
          </li>
        </ul>

        <p v-else>{{ t('drink.ingredientsEmpty') }}</p>
      </section>

      <section class="drink-details-panel__section">
        <h2>{{ t('drink.instructionsTitle') }}</h2>
        <p>{{ instructionsText }}</p>
        <small v-if="isTranslatingInstructions" class="drink-details-panel__hint">
          {{ t('drink.instructionsTranslating') }}
        </small>
        <small v-else-if="showInstructionsSourceHint" class="drink-details-panel__hint">
          {{ t('drink.instructionsSourceHint') }}
        </small>
      </section>

      <section v-if="embedVideoUrl" class="drink-details-panel__section">
        <h2>{{ t('drink.videoTitle') }}</h2>
        <div class="drink-details-panel__video-wrap">
          <iframe
            :src="embedVideoUrl"
            :title="t('drink.videoAriaTitle')"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>

      <section v-if="drink.tags.length > 0" class="drink-details-panel__section">
        <h2>{{ t('drink.tagsTitle') }}</h2>
        <div class="drink-details-panel__tags">
          <span v-for="tag in drink.tags" :key="tag">{{ tag }}</span>
        </div>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { translationService } from '@/services/translationService';
import type {
  DrinkDetails,
  DrinkSummary,
  IngredientDetail,
} from '@/types/cocktail';
import {
  localizeAlcoholicValue,
  localizeCategoryValue,
  localizeGlassValue,
} from '@/utils/apiLocalization';
import { toYoutubeEmbedUrl } from '@/utils/video';

import FavoriteButton from './FavoriteButton.vue';

interface DrinkDetailsPanelProps {
  drink: DrinkDetails;
}

interface DetailMetaItem {
  label: string;
  value: string;
}

const props = defineProps<DrinkDetailsPanelProps>();
const { locale, t } = useI18n();
const brokenIngredientImages = ref<Record<string, boolean>>({});
const translatedInstructions = ref<string | null>(null);
const isTranslatingInstructions = ref(false);
const isUsingOriginalInstructions = ref(false);
let latestInstructionRequestId = 0;

function resolveInstructionTargetLanguage(localeValue: string): 'pt' | 'es' | null {
  const languagePrefix = localeValue.split('-')[0]?.toLowerCase();

  if (languagePrefix === 'pt') {
    return 'pt';
  }

  if (languagePrefix === 'es') {
    return 'es';
  }

  return null;
}

const favoritePayload = computed<DrinkSummary>(() => ({
  id: props.drink.id,
  name: props.drink.name,
  thumbnail: props.drink.thumbnail,
  category: props.drink.category,
  alcoholic: props.drink.alcoholic,
  glass: props.drink.glass,
}));

const metaItems = computed<DetailMetaItem[]>(() => {
  const entries = [
    {
      label: t('drink.metaProfile'),
      value: localizeAlcoholicValue(props.drink.alcoholic, t),
    },
    {
      label: t('drink.metaGlass'),
      value: localizeGlassValue(props.drink.glass, t),
    },
  ];

  return entries.filter((entry): entry is DetailMetaItem => Boolean(entry.value));
});

const instructionsText = computed(() => {
  const trimmedInstructions = translatedInstructions.value?.trim() ?? '';
  return trimmedInstructions || t('drink.instructionsFallback');
});

const localizedCategory = computed(
  () =>
    localizeCategoryValue(props.drink.category, t) ??
    t('drink.detailsDefaultCategory'),
);

const showInstructionsSourceHint = computed(
  () =>
    isUsingOriginalInstructions.value &&
    props.drink.instructionsTranslations.en.trim().length > 0,
);

const embedVideoUrl = computed(() => toYoutubeEmbedUrl(props.drink.videoUrl));

async function syncInstructionsTranslation(): Promise<void> {
  const requestId = ++latestInstructionRequestId;
  const englishInstructions = props.drink.instructionsTranslations.en.trim();
  const spanishInstructions = props.drink.instructionsTranslations.es?.trim() ?? null;

  if (englishInstructions.length === 0) {
    translatedInstructions.value = '';
    isUsingOriginalInstructions.value = false;
    isTranslatingInstructions.value = false;
    return;
  }

  if (locale.value === 'en-US') {
    translatedInstructions.value = englishInstructions;
    isUsingOriginalInstructions.value = false;
    isTranslatingInstructions.value = false;
    return;
  }

  if (locale.value === 'es-ES' && spanishInstructions) {
    translatedInstructions.value = spanishInstructions;
    isUsingOriginalInstructions.value = false;
    isTranslatingInstructions.value = false;
    return;
  }

  const targetLanguage = resolveInstructionTargetLanguage(locale.value);
  if (!targetLanguage) {
    translatedInstructions.value = englishInstructions;
    isUsingOriginalInstructions.value = true;
    isTranslatingInstructions.value = false;
    return;
  }

  isTranslatingInstructions.value = true;

  try {
    const translated = await translationService.translateFromEnglish(
      englishInstructions,
      targetLanguage,
    );

    if (requestId !== latestInstructionRequestId) {
      return;
    }

    if (translated) {
      translatedInstructions.value = translated;
      isUsingOriginalInstructions.value = false;
      return;
    }

    translatedInstructions.value = englishInstructions;
    isUsingOriginalInstructions.value = true;
  } catch {
    if (requestId !== latestInstructionRequestId) {
      return;
    }

    translatedInstructions.value = englishInstructions;
    isUsingOriginalInstructions.value = true;
  } finally {
    if (requestId === latestInstructionRequestId) {
      isTranslatingInstructions.value = false;
    }
  }
}

watch(
  () => [
    props.drink.id,
    props.drink.instructionsTranslations.en,
    props.drink.instructionsTranslations.es,
    locale.value,
  ],
  () => {
    void syncInstructionsTranslation();
  },
  { immediate: true },
);

function showIngredientImage(ingredient: IngredientDetail): boolean {
  if (!ingredient.thumbnail) {
    return false;
  }

  return !brokenIngredientImages.value[ingredient.name];
}

function markIngredientImageAsBroken(ingredientName: string): void {
  brokenIngredientImages.value = {
    ...brokenIngredientImages.value,
    [ingredientName]: true,
  };
}
</script>

<style scoped>
.drink-details-panel {
  display: grid;
  gap: 1.2rem;
}

.drink-details-panel__media {
  position: relative;
  border-radius: 1.1rem;
  overflow: hidden;
  border: 1px solid rgba(217, 173, 104, 0.24);
}

.drink-details-panel__image {
  width: 100%;
  max-height: min(64vh, 540px);
  object-fit: cover;
}

.drink-details-panel__favorite {
  position: absolute;
  top: 0.95rem;
  right: 0.95rem;
}

.drink-details-panel__body {
  border: 1px solid rgba(217, 173, 104, 0.17);
  background: linear-gradient(165deg, rgba(16, 17, 23, 0.92), rgba(22, 24, 31, 0.91));
  border-radius: 1.1rem;
  padding: 1.1rem;
  display: grid;
  gap: 1rem;
}

.drink-details-panel__category {
  margin: 0;
  color: var(--color-accent-soft);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-size: 0.74rem;
  font-weight: 700;
}

.drink-details-panel__title {
  margin: 0;
  font-family: var(--font-heading);
  color: var(--color-text);
  font-size: clamp(1.8rem, 1.6rem + 1.5vw, 2.7rem);
  line-height: 0.95;
}

.drink-details-panel__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.drink-details-panel__meta p {
  margin: 0;
  border: 1px solid rgba(217, 173, 104, 0.16);
  border-radius: 0.75rem;
  padding: 0.65rem 0.8rem;
  color: var(--color-text);
  font-weight: 600;
  background: rgba(13, 15, 20, 0.7);
}

.drink-details-panel__meta span {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.68rem;
  color: rgba(229, 214, 188, 0.66);
  margin-bottom: 0.3rem;
}

.drink-details-panel__section {
  display: grid;
  gap: 0.56rem;
}

.drink-details-panel__section h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
  letter-spacing: 0.03em;
}

.drink-details-panel__section p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.7;
}

.drink-details-panel__hint {
  color: rgba(229, 214, 188, 0.72);
  font-size: 0.78rem;
  font-style: italic;
}

.drink-details-panel__section ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.drink-details-panel__section li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(217, 173, 104, 0.12);
  padding-bottom: 0.4rem;
}

.drink-details-panel__section li span {
  color: var(--color-text);
}

.ingredient-item__main {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.ingredient-item__thumb {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 0.62rem;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(217, 173, 104, 0.2);
  overflow: hidden;
  display: grid;
  place-items: center;
}

.ingredient-item__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.drink-details-panel__section li small {
  color: var(--color-muted);
}

.drink-details-panel__video-wrap {
  width: 100%;
  border-radius: 0.95rem;
  overflow: hidden;
  border: 1px solid rgba(217, 173, 104, 0.22);
  background: #0f1219;
}

.drink-details-panel__video-wrap iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  display: block;
}

.drink-details-panel__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.drink-details-panel__tags span {
  border-radius: 999px;
  border: 1px solid rgba(217, 173, 104, 0.2);
  background: rgba(217, 173, 104, 0.08);
  color: var(--color-text);
  font-size: 0.74rem;
  padding: 0.32rem 0.62rem;
}

@media (min-width: 980px) {
  .drink-details-panel {
    grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
    align-items: start;
  }

  .drink-details-panel__body {
    padding: 1.5rem;
    position: sticky;
    top: 6.2rem;
  }
}
</style>
