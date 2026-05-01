<script setup>
defineProps({
  active: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
})
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    :class="['chip', `chip--${size}`, { 'chip--active': active }]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.45rem 0.9rem;
  background-color: var(--color-surface-2);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--t-fast) var(--ease);
}
.chip:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
}
.chip--active {
  background-color: var(--color-accent);
  color: var(--color-accent-ink);
  border-color: var(--color-accent);
}
.chip--sm { padding: 0.25rem 0.6rem; font-size: var(--fs-xs); }
.chip--lg { padding: 0.55rem 1.1rem; font-size: var(--fs-md); }
</style>
