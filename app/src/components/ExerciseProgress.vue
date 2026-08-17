<script setup>
import { ref, computed } from 'vue'
import Chip from '@/components/Chip.vue'
import { exerciseProgress } from '@/mock/workouts'

// ponytail: fixed viewBox scaled by CSS — no resize observer, no chart lib
const W = 320, H = 120, PAD = { l: 10, r: 10, t: 16, b: 22 }

const selectedId = ref(exerciseProgress[0].id)
const hover = ref(null)

const exercise = computed(() => exerciseProgress.find(e => e.id === selectedId.value))

const chart = computed(() => {
  const pts = exercise.value.points
  const values = pts.map(p => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const points = pts.map((p, i) => ({
    ...p,
    i,
    x: PAD.l + (pts.length === 1 ? innerW / 2 : (i * innerW) / (pts.length - 1)),
    y: PAD.t + innerH - ((p.value - min) / span) * innerH,
  }))
  return {
    points,
    min,
    max,
    line: points.map(p => `${p.x},${p.y}`).join(' '),
    area: `${PAD.l},${H - PAD.b} ${points.map(p => `${p.x},${p.y}`).join(' ')} ${points.at(-1).x},${H - PAD.b}`,
  }
})

const delta = computed(() => {
  const pts = exercise.value.points
  const diff = pts.at(-1).value - pts[0].value
  return { diff: Math.round(diff * 10) / 10, pct: Math.round((diff / pts[0].value) * 100) }
})

const active = computed(() => chart.value.points[hover.value] ?? chart.value.points.at(-1))

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>

<template>
  <div class="prog">
    <div class="prog__chips">
      <Chip
        v-for="e in exerciseProgress"
        :key="e.id"
        size="sm"
        :active="e.id === selectedId"
        @click="selectedId = e.id; hover = null"
      >{{ e.name }}</Chip>
    </div>

    <div class="prog__head">
      <div>
        <span class="prog__name">{{ exercise.name }}</span>
        <span class="prog__sub">Top set · last {{ exercise.points.length }} weeks</span>
      </div>
      <div class="prog__now">
        <span class="prog__value">{{ active.value }}<small>{{ exercise.unit }}</small></span>
        <span class="prog__delta" :class="{ 'prog__delta--down': delta.diff < 0 }">
          {{ delta.diff >= 0 ? '+' : '' }}{{ delta.diff }}{{ exercise.unit }} ({{ delta.pct }}%)
        </span>
      </div>
    </div>

    <svg class="prog__svg" :viewBox="`0 0 ${W} ${H}`" role="img"
         :aria-label="`${exercise.name} top set progress, ${chart.min} to ${chart.max} ${exercise.unit}`">
      <line v-for="f in [0, 0.5, 1]" :key="f"
            :x1="PAD.l" :x2="W - PAD.r"
            :y1="PAD.t + f * (H - PAD.t - PAD.b)" :y2="PAD.t + f * (H - PAD.t - PAD.b)"
            class="prog__grid" />

      <polygon :points="chart.area" class="prog__area" />
      <polyline :points="chart.line" class="prog__line" />

      <line v-if="hover !== null" class="prog__cross"
            :x1="active.x" :x2="active.x" :y1="PAD.t" :y2="H - PAD.b" />

      <circle :cx="active.x" :cy="active.y" r="3.5" class="prog__dot" />

      <circle
        v-for="p in chart.points"
        :key="p.i"
        :cx="p.x" :cy="p.y" r="10"
        class="prog__hit"
        @pointerenter="hover = p.i"
        @pointerleave="hover = null"
      />

      <text :x="PAD.l" :y="H - 6" class="prog__axis">{{ fmtDate(chart.points[0].date) }}</text>
      <text :x="W - PAD.r" :y="H - 6" text-anchor="end" class="prog__axis">
        {{ fmtDate(chart.points.at(-1).date) }}
      </text>
      <text :x="PAD.l" :y="PAD.t - 5" class="prog__axis">{{ chart.max }}{{ exercise.unit }}</text>
    </svg>

    <p class="prog__hint">{{ fmtDate(active.date) }} · {{ active.value }}{{ exercise.unit }}</p>
  </div>
</template>

<style scoped>
.prog { display: flex; flex-direction: column; gap: var(--space-3); }
.prog__chips { display: flex; gap: var(--space-2); overflow-x: auto; padding-bottom: 2px; }
.prog__chips::-webkit-scrollbar { display: none; }

.prog__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.prog__name { display: block; font-weight: var(--fw-semibold); color: var(--color-text); }
.prog__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.prog__now { text-align: right; display: flex; flex-direction: column; gap: 2px; }
.prog__value {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
.prog__value small { font-size: var(--fs-xs); color: var(--color-text-dim); margin-left: 2px; }
.prog__delta { font-size: var(--fs-xs); color: var(--color-accent); font-variant-numeric: tabular-nums; }
.prog__delta--down { color: var(--sport-cardio); }

.prog__svg { width: 100%; height: auto; display: block; overflow: visible; }
.prog__grid { stroke: var(--color-border); stroke-width: 1; }
.prog__line {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.prog__area { fill: var(--color-accent-soft); stroke: none; }
.prog__cross { stroke: var(--color-border-strong); stroke-width: 1; stroke-dasharray: 3 3; }
.prog__dot { fill: var(--color-accent); stroke: var(--color-bg-elevated); stroke-width: 2; }
.prog__hit { fill: transparent; cursor: pointer; }
.prog__axis { fill: var(--color-text-dim); font-size: 9px; font-family: inherit; }
.prog__hint {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
}
</style>
