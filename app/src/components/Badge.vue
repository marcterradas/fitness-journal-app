<script setup>
defineProps({
  tone: { type: String, default: 'neutral' },
  icon: { type: String, default: '' },
})
</script>

<template>
  <span :class="['badge', `badge--${tone}`]">
    <span v-if="icon" class="badge__icon">{{ icon }}</span>
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.badge__icon { font-size: var(--fs-sm); }

.badge--neutral { background: var(--color-surface-2); color: var(--color-text-muted); }
.badge--accent  { background: var(--color-accent-soft); color: var(--color-accent); }
.badge--success { background: rgba(74, 222, 128, 0.15); color: var(--color-success); }
.badge--warning { background: rgba(251, 191, 36, 0.15); color: var(--color-warning); }
.badge--danger  { background: rgba(248, 113, 113, 0.15); color: var(--color-danger); }
.badge--mood    { background: rgba(251, 113, 133, 0.15); color: var(--color-mood); }
.badge--strength{ background: rgba(251, 146, 60, 0.15); color: var(--sport-strength); }
.badge--running { background: rgba(74, 222, 128, 0.15); color: var(--sport-running); }
.badge--cycling { background: rgba(56, 189, 248, 0.15); color: var(--sport-cycling); }
.badge--yoga    { background: rgba(192, 132, 252, 0.15); color: var(--sport-yoga); }
.badge--swimming{ background: rgba(34, 211, 238, 0.15); color: var(--sport-swimming); }
.badge--cardio  { background: rgba(248, 113, 113, 0.15); color: var(--sport-cardio); }
</style>
