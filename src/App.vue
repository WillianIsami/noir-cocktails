<template>
  <div class="app-shell">
    <div class="backdrop-photo backdrop-photo--left" aria-hidden="true" />
    <div class="backdrop-photo backdrop-photo--right" aria-hidden="true" />
    <div class="ambient ambient--one" aria-hidden="true" />
    <div class="ambient ambient--two" aria-hidden="true" />
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  position: relative;
  overflow: clip;
}

.app-main {
  padding-bottom: 2.5rem;
}

.backdrop-photo {
  pointer-events: none;
  position: fixed;
  z-index: -2;
  background-size: cover;
  background-position: center;
  filter: grayscale(0.3) brightness(0.32) saturate(0.8);
  opacity: 0.18;
}

.backdrop-photo--left {
  inset: 10% auto auto -12%;
  width: min(42vw, 560px);
  aspect-ratio: 3 / 4;
  border-radius: 2rem;
  background-image:
    linear-gradient(180deg, rgba(8, 9, 12, 0.25), rgba(8, 9, 12, 0.88)),
    url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80');
}

.backdrop-photo--right {
  inset: auto -10% -6% auto;
  width: min(40vw, 520px);
  aspect-ratio: 4 / 5;
  border-radius: 2rem;
  background-image:
    linear-gradient(180deg, rgba(8, 9, 12, 0.28), rgba(8, 9, 12, 0.86)),
    url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80');
}

.ambient {
  pointer-events: none;
  position: fixed;
  border-radius: 999px;
  filter: blur(72px);
  opacity: 0.45;
  z-index: -1;
}

.ambient--one {
  width: min(52vw, 420px);
  aspect-ratio: 1;
  background: rgba(194, 126, 49, 0.28);
  top: -14%;
  left: -10%;
}

.ambient--two {
  width: min(44vw, 380px);
  aspect-ratio: 1;
  background: rgba(131, 73, 39, 0.34);
  top: 30%;
  right: -12%;
}

@media (max-width: 900px) {
  .backdrop-photo {
    opacity: 0.12;
  }

  .backdrop-photo--left {
    inset: 14% auto auto -22%;
    width: 70vw;
  }

  .backdrop-photo--right {
    inset: auto -24% -10% auto;
    width: 70vw;
  }
}
</style>
