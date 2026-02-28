<template>
  <section class="empty-state" role="status" aria-live="polite">
    <div class="empty-state__icon" aria-hidden="true">◌</div>
    <h2 class="empty-state__title">{{ title }}</h2>
    <p class="empty-state__description">{{ description }}</p>

    <button
      v-if="actionLabel"
      type="button"
      class="empty-state__action"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </section>
</template>

<script setup lang="ts">
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
}

defineProps<EmptyStateProps>();

const emit = defineEmits<{
  action: [];
}>();
</script>

<style scoped>
.empty-state {
  border: 1px solid rgba(217, 173, 104, 0.15);
  border-radius: 1.1rem;
  padding: 2.4rem 1.2rem;
  background: linear-gradient(165deg, rgba(18, 20, 24, 0.88), rgba(13, 14, 19, 0.84));
  text-align: center;
  max-width: 620px;
  margin-inline: auto;
}

.empty-state__icon {
  width: 2.4rem;
  height: 2.4rem;
  margin-inline: auto;
  border-radius: 999px;
  border: 1px solid rgba(230, 190, 126, 0.3);
  display: grid;
  place-items: center;
  color: rgba(230, 190, 126, 0.78);
}

.empty-state__title {
  margin: 1rem 0 0;
  font-family: var(--font-heading);
  color: var(--color-text);
  font-size: clamp(1.4rem, 1.2rem + 0.7vw, 1.9rem);
}

.empty-state__description {
  margin: 0.6rem auto 0;
  max-width: 42ch;
  color: var(--color-muted);
  line-height: 1.6;
}

.empty-state__action {
  margin-top: 1.1rem;
  border: 1px solid rgba(241, 195, 116, 0.55);
  border-radius: 999px;
  background: rgba(241, 195, 116, 0.16);
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.6rem 1.1rem;
  cursor: pointer;
  transition: background-color 200ms ease;
}

.empty-state__action:hover {
  background: rgba(241, 195, 116, 0.22);
}
</style>
