<script setup>
import { computed } from 'vue'
import { SPORT_TYPES } from '@/mock/workouts'

const props = defineProps({
  sport: { type: String, required: true },
  size: { type: String, default: 'md' },
})

const meta = computed(() => SPORT_TYPES.find(s => s.id === props.sport) || { emoji: '🏃', color: 'var(--color-accent)', label: props.sport })
</script>

<template>
  <span
    :class="['sport-icon', `sport-icon--${size}`]"
    :style="{ background: `color-mix(in srgb, ${meta.color} 18%, transparent)`, color: meta.color }"
    :title="meta.label"
  >
    {{ meta.emoji }}
  </span>
</template>

<style scoped>
.sport-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.sport-icon--sm { width: 1.75rem; height: 1.75rem; font-size: var(--fs-sm); }
.sport-icon--md { width: 2.5rem; height: 2.5rem; font-size: var(--fs-lg); }
.sport-icon--lg { width: 3rem; height: 3rem; font-size: var(--fs-xl); }
</style>
