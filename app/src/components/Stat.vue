<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  align: { type: String, default: 'center' },
})
</script>

<template>
  <div :class="['stat', `stat--${align}`]">
    <span v-if="icon" class="stat__icon">{{ icon }}</span>
    <span class="stat__value">{{ value }}</span>
    <span class="stat__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.stat--center { align-items: center; text-align: center; }
.stat--start  { align-items: flex-start; text-align: left; }

.stat__icon {
  font-size: var(--fs-md);
  margin-bottom: var(--space-1);
}
.stat__value {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-family: var(--font-display);
  letter-spacing: -0.01em;
}
.stat__label {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--fw-medium);
}
</style>
