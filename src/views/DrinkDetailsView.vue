<template>
  <div class="drink-details-view container">
    <button type="button" class="drink-details-view__back" @click="goBackToDiscovery">
      {{ t('detailsPage.back') }}
    </button>

    <LoadingState v-if="isLoading" variant="details" />

    <EmptyState
      v-else-if="errorMessage"
      :title="t('detailsPage.loadErrorTitle')"
      :description="errorMessage"
      :action-label="t('detailsPage.retry')"
      @action="fetchDrink"
    />

    <DrinkDetailsPanel v-else-if="drink" :drink="drink" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import DrinkDetailsPanel from '@/components/DrinkDetailsPanel.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingState from '@/components/LoadingState.vue';
import { cocktailService } from '@/services/cocktailService';
import type { DrinkDetails } from '@/types/cocktail';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const drink = ref<DrinkDetails | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

function goBackToDiscovery(): void {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push({ name: 'home' });
}

async function fetchDrink(): Promise<void> {
  const drinkId = String(route.params.id ?? '');
  if (!drinkId) {
    errorMessage.value = t('detailsPage.missingId');
    drink.value = null;
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await cocktailService.getById(drinkId);

    if (!response) {
      errorMessage.value = t('detailsPage.notFound');
      drink.value = null;
      return;
    }

    drink.value = response;
  } catch {
    errorMessage.value = t('detailsPage.loadError');
    drink.value = null;
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => route.params.id,
  () => {
    void fetchDrink();
  },
  { immediate: true },
);
</script>

<style scoped>
.drink-details-view {
  padding-top: clamp(1.8rem, 4vw, 3rem);
  display: grid;
  gap: 1rem;
}

.drink-details-view__back {
  justify-self: start;
  text-decoration: none;
  color: var(--color-muted);
  font-weight: 700;
  border: 1px solid rgba(217, 173, 104, 0.22);
  border-radius: 999px;
  padding: 0.48rem 0.88rem;
  transition: color 200ms ease, border-color 200ms ease;
  background: transparent;
  cursor: pointer;
}

.drink-details-view__back:hover {
  color: var(--color-text);
  border-color: rgba(217, 173, 104, 0.58);
}
</style>
