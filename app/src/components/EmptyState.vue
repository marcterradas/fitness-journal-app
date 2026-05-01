<script setup>
defineProps({
  icon: { type: String, default: '🌱' },
  title: { type: String, default: 'Nothing yet' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="empty">
    <div class="empty__icon">{{ icon }}</div>
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="description" class="empty__desc">{{ description }}</p>
    <div v-if="$slots.default" class="empty__cta"><slot /></div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-8) var(--space-4);
  gap: var(--space-2);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
}
.empty__icon { font-size: 2.5rem; margin-bottom: var(--space-2); }
.empty__title { font-size: var(--fs-lg); font-weight: var(--fw-semibold); color: var(--color-text); }
.empty__desc { color: var(--color-text-muted); max-width: 28rem; }
.empty__cta { margin-top: var(--space-3); }
</style>
