<script setup>
import { computed } from 'vue'
import { journalEntries, SPORT_TYPES, ymd } from '@/mock/workouts'

const WEEKS = 12

// ponytail: mock entries are the only source — swap for an API call, keep the shape
const byDate = computed(() => {
  const map = new Map()
  for (const e of journalEntries) {
    const prev = map.get(e.date)
    map.set(e.date, {
      minutes: (prev?.minutes || 0) + (e.durationMin || 0),
      titles: [...(prev?.titles || []), e.title],
    })
  }
  return map
})

// grid runs oldest → newest, one column per week, Mon first
const grid = computed(() => {
  const end = new Date()
  end.setHours(0, 0, 0, 0)
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7)) // to Sunday of this week
  const start = new Date(end)
  start.setDate(end.getDate() - (WEEKS * 7 - 1))

  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = new Date(start)
      day.setDate(start.getDate() + w * 7 + d)
      const key = ymd(day)
      const hit = byDate.value.get(key)
      return {
        key,
        minutes: hit?.minutes || 0,
        // 0 = rest, 1–4 = intensity buckets (minutes trained)
        level: !hit ? 0 : hit.minutes >= 75 ? 4 : hit.minutes >= 50 ? 3 : hit.minutes >= 25 ? 2 : 1,
        label: hit ? `${key} · ${hit.titles.join(', ')} (${hit.minutes} min)` : `${key} · rest`,
      }
    })
  )
})

const activeDays = computed(() => grid.value.flat().filter(d => d.level).length)

const split = computed(() => {
  const total = journalEntries.reduce((a, e) => a + (e.durationMin || 0), 0) || 1
  return SPORT_TYPES
    .map(s => {
      const min = journalEntries
        .filter(e => e.sport === s.id)
        .reduce((a, e) => a + (e.durationMin || 0), 0)
      return { ...s, min, pct: Math.round((min / total) * 100) }
    })
    .filter(s => s.min)
    .sort((a, b) => b.min - a.min)
})

const DAY_LABELS = ['M', '', 'W', '', 'F', '', 'S']
</script>

<template>
  <div class="ts">
    <section class="ts__block">
      <div class="ts__head">
        <h4 class="ts__h">Last {{ WEEKS }} weeks</h4>
        <span class="ts__meta">{{ activeDays }} active days</span>
      </div>
      <div class="heat">
        <div class="heat__days">
          <span v-for="(l, i) in DAY_LABELS" :key="i" class="heat__day">{{ l }}</span>
        </div>
        <div class="heat__grid hide-scrollbar">
          <div v-for="(week, w) in grid" :key="w" class="heat__week">
            <span
              v-for="d in week"
              :key="d.key"
              class="heat__cell"
              :class="`heat__cell--${d.level}`"
              :title="d.label"
            />
          </div>
        </div>
      </div>
      <div class="heat__legend">
        <span>Rest</span>
        <span v-for="l in [0, 1, 2, 3, 4]" :key="l" class="heat__cell" :class="`heat__cell--${l}`" />
        <span>75+ min</span>
      </div>
    </section>

    <section class="ts__block">
      <h4 class="ts__h">Training split</h4>
      <div class="split__bar">
        <span
          v-for="s in split"
          :key="s.id"
          class="split__seg"
          :style="{ width: `${s.pct}%`, background: s.color }"
          :title="`${s.label} · ${s.min} min`"
        />
      </div>
      <ul class="split__legend">
        <li v-for="s in split" :key="s.id" class="split__item">
          <span class="split__dot" :style="{ background: s.color }" />
          <span class="split__label">{{ s.label }}</span>
          <span class="split__pct">{{ s.pct }}%</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.ts { display: flex; flex-direction: column; gap: var(--space-5); }
.ts__block { display: flex; flex-direction: column; gap: var(--space-3); }
.ts__head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-3); }
.ts__h {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ts__meta { font-size: var(--fs-xs); color: var(--color-text-dim); font-variant-numeric: tabular-nums; }

/* Heatmap */
.heat { display: flex; gap: var(--space-2); }
.heat__days, .heat__week { display: flex; flex-direction: column; gap: 3px; }
.heat__day {
  font-size: 0.6rem;
  color: var(--color-text-dim);
  height: 12px;
  line-height: 12px;
}
.heat__grid { display: flex; gap: 3px; overflow-x: auto; flex: 1; }
.heat__cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--color-surface-2);
  flex-shrink: 0;
}
.heat__cell--1 { background: color-mix(in srgb, var(--color-accent) 30%, var(--color-surface-2)); }
.heat__cell--2 { background: color-mix(in srgb, var(--color-accent) 50%, var(--color-surface-2)); }
.heat__cell--3 { background: color-mix(in srgb, var(--color-accent) 75%, var(--color-surface-2)); }
.heat__cell--4 { background: var(--color-accent); }
.heat__legend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  color: var(--color-text-dim);
}

/* Split */
.split__bar {
  display: flex;
  gap: 2px;
  height: 10px;
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.split__seg { display: block; height: 100%; }
.split__legend {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--space-2) var(--space-3);
}
.split__item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--fs-xs); }
.split__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.split__label { flex: 1; color: var(--color-text-muted); }
.split__pct { color: var(--color-text); font-variant-numeric: tabular-nums; }
</style>
