<script setup>
defineProps({
  padding: { type: String, default: 'md' },
  variant: { type: String, default: 'surface' },
})
</script>

<template>
  <div :class="['card', `card--${variant}`, `card--p-${padding}`]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 100%;
}
.card--elevated {
  background-color: var(--color-surface-2);
  box-shadow: var(--shadow-md);
}
.card--accent {
  background:
    linear-gradient(140deg, var(--color-accent-soft), transparent 60%),
    var(--color-surface);
  border-color: var(--color-accent);
}
.card--ghost {
  background-color: transparent;
  border-color: var(--color-border);
}

.card--p-none { padding: 0; }
.card--p-sm   { padding: var(--space-3); }
.card--p-md   { padding: var(--space-4); }
.card--p-lg   { padding: var(--space-6); }
</style>
