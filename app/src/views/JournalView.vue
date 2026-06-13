<script setup>
import { ref, computed } from 'vue'
import WorkoutCalendar from '@/components/WorkoutCalendar.vue'
import Card from '@/components/Card.vue'
import Badge from '@/components/Badge.vue'
import SportIcon from '@/components/SportIcon.vue'
import { journalEntries, SPORT_TYPES, todayWorkout } from '@/mock/workouts'
import { currentUser, getUserRank, RANKS } from '@/mock/user'

const recentEntries = journalEntries.slice(0, 3)
const showMonth = ref(false)

const rank = getUserRank(currentUser.stats.workouts)
const nextRank = RANKS[RANKS.findIndex(r => r.id === rank.id) + 1] || null

const today = new Date()

function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const weekDays = computed(() => {
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = ymd(d)
    const entry = journalEntries.find(e => e.date === key) || null
    return {
      label: labels[i],
      day: d.getDate(),
      key,
      entry,
      isToday: d.toDateString() === today.toDateString(),
      isFuture: d > today,
    }
  })
})

const sportMeta = (sport) => SPORT_TYPES.find(s => s.id === sport) || null
</script>

<template>
  <div class="journal">
    <header class="journal__head">
      <div>
        <h1 class="journal__title">Training journal</h1>
        <p class="journal__sub">Your story, one session at a time.</p>
      </div>
      <button class="journal__new">+ New entry</button>
    </header>

    <!-- Goals -->
    <section>
      <h3 class="section-h">Goals</h3>
      <div class="goals">
        <Card v-for="g in currentUser.goals" :key="g.id" padding="md">
          <div class="goal__row">
            <span class="goal__label">{{ g.label }}</span>
            <Badge tone="accent">{{ Math.round(g.progress * 100) }}%</Badge>
          </div>
          <div class="goal__bar">
            <div class="goal__fill" :style="{ width: `${g.progress * 100}%` }" />
          </div>
        </Card>
      </div>
    </section>

    <!-- Rank -->
    <Card padding="md" class="rank" :style="{ '--rank-color': rank.color }">
      <span class="rank__icon">{{ rank.icon }}</span>
      <div class="rank__info">
        <span class="rank__label">{{ rank.label }}</span>
        <span class="rank__sub">
          {{ currentUser.stats.workouts }} workouts
          <template v-if="nextRank"> · {{ nextRank.min - currentUser.stats.workouts }} to {{ nextRank.label }}</template>
        </span>
      </div>
      <div class="rank__tiers">
        <span
          v-for="r in RANKS"
          :key="r.id"
          class="rank__pip"
          :style="{
            background: r.id === rank.id ? rank.color : 'var(--color-surface-2)',
            border: `1px solid ${r.id === rank.id ? rank.color : 'var(--color-border)'}`
          }"
          :title="r.label"
        />
      </div>
    </Card>

    <!-- Today's workout -->
    <Card padding="lg" class="today">
      <div class="today__head">
        <div>
          <span class="today__eyebrow">Today's session</span>
          <h2 class="today__title">{{ todayWorkout.title }}</h2>
        </div>
        <SportIcon :sport="todayWorkout.sport" size="lg" />
      </div>
      <div class="today__meta">
        <Badge :tone="todayWorkout.sport" icon="⏱">{{ todayWorkout.durationMin }} min</Badge>
        <Badge tone="neutral" icon="📋">{{ todayWorkout.exerciseCount }} exercises</Badge>
      </div>
      <ul class="today__list">
        <li v-for="ex in todayWorkout.exercises.slice(0, 4)" :key="ex.name" class="today__item">
          <span>{{ ex.name }}</span>
          <span class="today__item-meta">{{ ex.sets }} × {{ ex.reps }}</span>
        </li>
        <li v-if="todayWorkout.exercises.length > 4" class="today__item today__item--more">
          +{{ todayWorkout.exercises.length - 4 }} more
        </li>
      </ul>
      <button class="today__cta">Start workout →</button>
    </Card>

    <!-- Week / Month toggle -->
    <Card padding="lg">
      <div class="cal-header">
        <h3 class="week__title">{{ showMonth ? 'This month' : 'This week' }}</h3>
        <button class="cal-toggle" @click="showMonth = !showMonth">
          {{ showMonth ? 'Week' : 'Month' }}
        </button>
      </div>

      <div v-if="!showMonth" class="week">
        <div
          v-for="d in weekDays"
          :key="d.key"
          class="week__day"
          :class="{
            'week__day--today': d.isToday,
            'week__day--done': d.entry,
            'week__day--future': d.isFuture,
          }"
        >
          <span class="week__label">{{ d.label }}</span>
          <div class="week__circle">
            <span class="week__num">{{ d.day }}</span>
            <span
              v-if="d.entry"
              class="week__dot"
              :style="{ background: sportMeta(d.entry.sport)?.color || 'var(--color-accent)' }"
            />
          </div>
        </div>
      </div>

      <WorkoutCalendar v-else :entries="journalEntries" />
    </Card>

    <!-- Recent sessions -->
    <Card padding="none">
      <div class="recent__head">
        <span class="section-h" style="margin:0">Recent sessions</span>
        <button class="recent__all">See all →</button>
      </div>
      <ul class="recent__list">
        <li v-for="e in recentEntries" :key="e.id" class="recent__item">
          <SportIcon :sport="e.sport" size="sm" />
          <div class="recent__info">
            <span class="recent__title">{{ e.title }}</span>
            <span class="recent__meta">
              <span v-if="e.durationMin">{{ e.durationMin }} min</span>
              <span v-if="e.distanceKm"> · {{ e.distanceKm }} km</span>
            </span>
          </div>
          <span class="recent__date">{{ new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
        </li>
      </ul>
    </Card>
  </div>
</template>

<style scoped>
.journal {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
}
.journal__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.journal__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
}
.journal__sub {
  color: var(--color-text-muted);
  margin-top: var(--space-1);
  font-size: var(--fs-sm);
}
.journal__new {
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.journal__new:hover { background: var(--color-accent-hover); }

/* Recent sessions */
.recent__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.recent__all {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  cursor: pointer;
}
.recent__list { display: flex; flex-direction: column; }
.recent__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.recent__item:last-child { border-bottom: none; }
.recent__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.recent__title { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--color-text); }
.recent__meta { font-size: var(--fs-xs); color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
.recent__date { font-size: var(--fs-xs); color: var(--color-text-dim); white-space: nowrap; }

.section-h {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
  letter-spacing: 0.02em;
}

/* Goals */
.goals { display: flex; flex-direction: column; gap: var(--space-3); }
.goal__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}
.goal__label { font-weight: var(--fw-medium); color: var(--color-text); }
.goal__bar {
  height: 8px;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.goal__fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-pill);
  transition: width var(--t-med) var(--ease);
}

/* Rank */
.rank {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: color-mix(in srgb, var(--rank-color) 12%, var(--color-surface-2)) !important;
  border: 1px solid color-mix(in srgb, var(--rank-color) 35%, transparent) !important;
}
.rank__icon { font-size: 2rem; flex-shrink: 0; }
.rank__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.rank__label {
  font-weight: var(--fw-bold);
  font-size: var(--fs-md);
  color: var(--rank-color);
}
.rank__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.rank__tiers { display: flex; gap: 4px; align-items: center; }
.rank__pip {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}

/* Today's workout */
.today { display: flex; flex-direction: column; gap: var(--space-3); }
.today__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.today__eyebrow {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
  margin-bottom: var(--space-1);
}
.today__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
}
.today__meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.today__list { display: flex; flex-direction: column; }
.today__item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: var(--fs-sm);
}
.today__item:last-child { border-bottom: none; }
.today__item-meta { color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
.today__item--more { color: var(--color-text-dim); font-style: italic; justify-content: flex-start; }
.today__cta {
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.today__cta:hover { background: var(--color-accent-hover); }

/* Calendar header */
.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}
.cal-toggle {
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.cal-toggle:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

/* Week strip */
.week__title {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
}
.week__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  opacity: 1;
}
.week__day--future { opacity: 0.45; }
.week__label {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.week__circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all var(--t-fast) var(--ease);
}
.week__day--today .week__circle {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-glow);
}
.week__day--done .week__circle {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
}
.week__num {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  line-height: 1;
}
.week__day--today .week__num { color: var(--color-accent); }
.week__dot {
  position: absolute;
  bottom: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

@media (max-width: 480px) {
  .week__circle { width: 2rem; height: 2rem; }
  .week__num { font-size: var(--fs-xs); }
}
</style>
