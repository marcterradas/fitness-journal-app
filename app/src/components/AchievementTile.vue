<script setup>
defineProps({
  a: { type: Object, required: true },
})
</script>

<template>
  <div class="ach" :class="{ 'ach--locked': !a.earned, 'ach--done': a.done }">
    <span class="ach__icon">{{ a.earned ? a.icon : '🔒' }}</span>
    <span class="ach__title">{{ a.label }}</span>

    <!-- Rung pips: how far up this ladder you are at a glance -->
    <div class="ach__pips">
      <span v-for="n in a.levels" :key="n" class="ach__pip" :class="{ 'ach__pip--on': n <= a.level }" />
    </div>

    <div v-if="!a.done" class="ach__track"><div class="ach__bar" :style="{ width: a.progress * 100 + '%' }" /></div>
    <span class="ach__meta">{{ a.done ? 'Maxed out' : a.valueLabel }}</span>
  </div>
</template>

<style scoped>
.ach {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
}
.ach--locked { opacity: 0.55; }
.ach--done { border-color: var(--color-accent); background: var(--color-accent-soft); }
.ach__icon { font-size: 1.5rem; }
.ach__title { font-size: var(--fs-xs); font-weight: var(--fw-semibold); }

.ach__pips { display: flex; gap: 3px; }
.ach__pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
}
.ach__pip--on { background: var(--color-accent); border-color: transparent; }

.ach__track {
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: var(--color-surface-2);
  overflow: hidden;
}
.ach__bar { height: 100%; background: var(--color-accent); border-radius: inherit; }
.ach__meta { font-size: 0.65rem; color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
</style>
