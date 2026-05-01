<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  size: { type: Number, default: 96 },
  stroke: { type: Number, default: 8 },
  color: { type: String, default: 'var(--color-accent)' },
  trackColor: { type: String, default: 'var(--color-surface-2)' },
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - Math.max(0, Math.min(1, props.value))))
</script>

<template>
  <div class="ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" class="ring__svg">
      <circle
        :cx="size / 2" :cy="size / 2" :r="radius"
        fill="none" :stroke="trackColor" :stroke-width="stroke"
      />
      <circle
        :cx="size / 2" :cy="size / 2" :r="radius"
        fill="none" :stroke="color" :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>
    <div class="ring__content"><slot /></div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ring__svg {
  position: absolute;
  inset: 0;
  transition: stroke-dashoffset var(--t-med) var(--ease);
}
.ring__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
}
</style>
