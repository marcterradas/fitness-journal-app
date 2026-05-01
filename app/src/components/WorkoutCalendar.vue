<script setup>
import { ref, computed } from 'vue'
import { SPORT_TYPES } from '@/mock/workouts'

const props = defineProps({
  entries: { type: Array, required: true },
  initialDate: { type: Date, default: () => new Date() },
  weekStartsOn: { type: Number, default: 1 }, // 1 = Monday
})

const cursor = ref(new Date(props.initialDate.getFullYear(), props.initialDate.getMonth(), 1))

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const today = new Date()

const monthLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(cursor.value)
)

const weekdays = computed(() => {
  const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const start = props.weekStartsOn % 7
  return [...base.slice(start), ...base.slice(0, start)]
})

const sportMeta = (sport) => SPORT_TYPES.find(s => s.id === sport) || null

const entriesByDate = computed(() => {
  const map = new Map()
  for (const e of props.entries) {
    const list = map.get(e.date) || []
    list.push(e)
    map.set(e.date, list)
  }
  return map
})

function ymd(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const cells = computed(() => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startOffset = (firstDay.getDay() - props.weekStartsOn + 7) % 7

  const out = []
  // Leading blanks
  for (let i = 0; i < startOffset; i++) out.push({ blank: true, key: `b${i}` })
  // Days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    const key = ymd(date)
    const dayEntries = entriesByDate.value.get(key) || []
    out.push({
      blank: false,
      key,
      date,
      day: d,
      isToday: sameDay(date, today),
      isFuture: date > today,
      entries: dayEntries,
    })
  }
  return out
})

const monthSummary = computed(() => {
  const inMonth = props.entries.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === cursor.value.getFullYear() && d.getMonth() === cursor.value.getMonth()
  })
  return {
    sessions: inMonth.length,
    minutes: inMonth.reduce((a, e) => a + (e.durationMin || 0), 0),
    distance: inMonth.reduce((a, e) => a + (e.distanceKm || 0), 0),
  }
})

const selected = ref(null)

function selectCell(cell) {
  if (cell.blank || !cell.entries.length) return
  selected.value = selected.value?.key === cell.key ? null : cell
}

function shift(delta) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
  selected.value = null
}
</script>

<template>
  <div class="cal">
    <header class="cal__head">
      <button class="cal__nav" @click="shift(-1)" aria-label="Previous month">‹</button>
      <div class="cal__title-wrap">
        <span class="cal__title">{{ monthLabel }}</span>
        <span class="cal__summary">
          {{ monthSummary.sessions }} sessions · {{ monthSummary.minutes }} min<span v-if="monthSummary.distance"> · {{ monthSummary.distance.toFixed(1) }} km</span>
        </span>
      </div>
      <button class="cal__nav" @click="shift(1)" aria-label="Next month">›</button>
    </header>

    <div class="cal__weekdays">
      <span v-for="d in weekdays" :key="d" class="cal__weekday">{{ d }}</span>
    </div>

    <div class="cal__grid">
      <div
        v-for="c in cells"
        :key="c.key"
        :class="[
          'cell',
          { 'cell--blank': c.blank },
          { 'cell--today': !c.blank && c.isToday },
          { 'cell--future': !c.blank && c.isFuture },
          { 'cell--has': !c.blank && c.entries.length },
          { 'cell--active': !c.blank && selected?.key === c.key },
        ]"
        @click="selectCell(c)"
      >
        <template v-if="!c.blank">
          <span class="cell__day">{{ c.day }}</span>
          <div v-if="c.entries.length" class="cell__marks">
            <span
              v-for="(e, i) in c.entries.slice(0, 3)"
              :key="e.id || i"
              class="cell__dot"
              :title="e.title"
              :style="{ background: sportMeta(e.sport)?.color || 'var(--color-accent)' }"
            />
            <span v-if="c.entries.length > 3" class="cell__more">+{{ c.entries.length - 3 }}</span>
          </div>
        </template>
      </div>
    </div>

    <div v-if="selected" class="cal__detail">
      <div class="detail__head">
        <span class="detail__date">
          {{ new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(selected.date) }}
        </span>
        <button class="detail__close" @click="selected = null" aria-label="Close">×</button>
      </div>
      <ul class="detail__list">
        <li v-for="e in selected.entries" :key="e.id" class="detail__item">
          <span
            class="detail__icon"
            :style="{ background: `color-mix(in srgb, ${sportMeta(e.sport)?.color} 18%, transparent)`, color: sportMeta(e.sport)?.color }"
          >
            {{ sportMeta(e.sport)?.emoji || '·' }}
          </span>
          <div class="detail__main">
            <span class="detail__title">{{ e.title }}</span>
            <span class="detail__meta">
              <span v-if="e.durationMin">{{ e.durationMin }} min</span>
              <span v-if="e.distanceKm"> · {{ e.distanceKm }} km</span>
              <span v-if="e.volumeKg"> · {{ e.volumeKg.toLocaleString() }} kg</span>
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="cal__legend">
      <span
        v-for="s in SPORT_TYPES"
        :key="s.id"
        class="legend"
      >
        <span class="legend__dot" :style="{ background: s.color }" />
        <span class="legend__lbl">{{ s.label }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.cal {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Header */
.cal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.cal__nav {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--t-fast) var(--ease);
}
.cal__nav:hover { background: var(--color-surface-hover); }
.cal__title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}
.cal__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  letter-spacing: -0.01em;
}
.cal__summary {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
}

/* Weekdays */
.cal__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
}
.cal__weekday {
  text-align: center;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-dim);
  padding: var(--space-1) 0;
}

/* Grid */
.cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
}
.cell {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  cursor: default;
  transition: all var(--t-fast) var(--ease);
  min-height: 2.75rem;
  position: relative;
}
.cell--blank {
  background: transparent;
  border-color: transparent;
}
.cell--has {
  background: var(--color-surface-2);
  cursor: pointer;
}
.cell--has:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
  transform: translateY(-1px);
}
.cell--today {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-glow);
}
.cell--today .cell__day {
  color: var(--color-accent);
  font-weight: var(--fw-bold);
}
.cell--future { opacity: 0.55; }
.cell--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.cell--active .cell__day { color: var(--color-accent-ink); }
.cell--active .cell__more { color: var(--color-accent-ink); }

.cell__day {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
.cell__marks {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
}
.cell__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.cell__more {
  font-size: 0.625rem;
  color: var(--color-text-dim);
  margin-left: 2px;
  font-weight: var(--fw-semibold);
}

/* Detail panel */
.cal__detail {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.detail__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detail__date {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}
.detail__close {
  background: transparent;
  border: none;
  color: var(--color-text-dim);
  font-size: 1.5rem;
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1;
}
.detail__list { display: flex; flex-direction: column; gap: var(--space-2); }
.detail__item {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}
.detail__icon {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-md);
  flex-shrink: 0;
}
.detail__main { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.detail__title {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
}
.detail__meta {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
}

/* Legend */
.cal__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}
.legend {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}
.legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend__lbl {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}

@media (max-width: 480px) {
  .cell { padding: var(--space-1); }
  .cell__day { font-size: var(--fs-xs); }
  .cell__dot { width: 5px; height: 5px; }
}
</style>
