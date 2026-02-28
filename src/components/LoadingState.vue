<template>
  <section v-if="variant === 'grid'" class="loading-grid" aria-live="polite" aria-busy="true">
    <article v-for="card in cards" :key="card" class="loading-grid__card">
      <div class="loading-grid__image" />
      <div class="loading-grid__line loading-grid__line--strong" />
      <div class="loading-grid__line" />
    </article>
  </section>

  <section v-else class="loading-details" aria-live="polite" aria-busy="true">
    <div class="loading-details__cover" />
    <div class="loading-details__line loading-details__line--title" />
    <div class="loading-details__line" />
    <div class="loading-details__line" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface LoadingStateProps {
  variant?: 'grid' | 'details';
}

const props = withDefaults(defineProps<LoadingStateProps>(), {
  variant: 'grid',
});

const cards = computed(() => Array.from({ length: props.variant === 'grid' ? 8 : 1 }, (_, index) => index));
</script>

<style scoped>
.loading-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.loading-grid__card,
.loading-details {
  border: 1px solid rgba(217, 173, 104, 0.12);
  background: rgba(17, 19, 25, 0.74);
  border-radius: 1rem;
  padding: 0.8rem;
}

.loading-grid__image,
.loading-details__cover,
.loading-grid__line,
.loading-details__line {
  background: linear-gradient(
    90deg,
    rgba(39, 42, 50, 0.72) 25%,
    rgba(58, 63, 75, 0.72) 40%,
    rgba(39, 42, 50, 0.72) 55%
  );
  background-size: 200% 100%;
  animation: pulse 1.25s linear infinite;
  border-radius: 0.62rem;
}

.loading-grid__image {
  aspect-ratio: 4 / 5;
}

.loading-grid__line {
  margin-top: 0.68rem;
  height: 0.76rem;
}

.loading-grid__line--strong {
  width: 70%;
  height: 1rem;
}

.loading-details {
  display: grid;
  gap: 0.7rem;
  max-width: 780px;
}

.loading-details__cover {
  width: 100%;
  aspect-ratio: 16 / 8;
}

.loading-details__line {
  height: 0.88rem;
}

.loading-details__line--title {
  width: 46%;
  height: 1.2rem;
}

@keyframes pulse {
  to {
    background-position-x: -200%;
  }
}

@media (min-width: 640px) {
  .loading-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .loading-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1260px) {
  .loading-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
