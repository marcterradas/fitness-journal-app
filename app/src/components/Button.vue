<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
})
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: inherit;
  font-weight: var(--fw-semibold);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}

.btn--sm { padding: var(--space-2) var(--space-3); font-size: var(--fs-sm); }
.btn--md { padding: var(--space-3) var(--space-4); font-size: var(--fs-md); }
.btn--lg { padding: var(--space-4) var(--space-5); font-size: var(--fs-lg); }

.btn--primary {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}
.btn--primary:hover { background: var(--color-accent-hover); }

.btn--secondary {
  background: var(--color-surface-2);
  color: var(--color-text);
  border-color: var(--color-border);
}
.btn--secondary:hover { background: var(--color-surface-hover); }

.btn--ghost {
  background: transparent;
  color: var(--color-text);
}
.btn--ghost:hover { background: var(--color-surface-2); }

.btn--danger {
  background: var(--color-danger);
  color: white;
}
</style>
