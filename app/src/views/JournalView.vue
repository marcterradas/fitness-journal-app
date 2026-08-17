<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import WorkoutCalendar from '@/components/WorkoutCalendar.vue'
import JournalEntry from '@/components/JournalEntry.vue'
import Card from '@/components/Card.vue'
import Badge from '@/components/Badge.vue'
import Chip from '@/components/Chip.vue'
import SportIcon from '@/components/SportIcon.vue'
import EmptyState from '@/components/EmptyState.vue'
import ExerciseProgress from '@/components/ExerciseProgress.vue'
import { journalEntries, SPORT_TYPES, MOODS, todayWorkout, ymd } from '@/mock/workouts'
import { currentUser, getUserRank, RANKS } from '@/mock/user'

const router = useRouter()

// ponytail: same array instance as the mock, so entries added here survive navigation
const entries = ref(journalEntries)

const tab = ref('log')
const showMonth = ref(false)
const showAll = ref(false)
const openId = ref(null)
const weekSelected = ref(null)
const toast = ref('')

const rank = getUserRank(currentUser.stats.workouts)
const nextRank = RANKS[RANKS.findIndex(r => r.id === rank.id) + 1] || null

const today = new Date()
const todayKey = ymd(today)

const sortedEntries = computed(() =>
  [...entries.value].sort((a, b) => b.date.localeCompare(a.date))
)
const visibleEntries = computed(() =>
  showAll.value ? sortedEntries.value : sortedEntries.value.slice(0, 3)
)

const weekDays = computed(() => {
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = ymd(d)
    return {
      label: labels[i],
      day: d.getDate(),
      key,
      entry: entries.value.find(e => e.date === key) || null,
      isToday: key === todayKey,
      isFuture: key > todayKey,
    }
  })
})

const weekStats = computed(() => {
  const days = weekDays.value.filter(d => d.entry)
  return {
    sessions: days.length,
    minutes: days.reduce((a, d) => a + (d.entry.durationMin || 0), 0),
  }
})

const monthStats = computed(() => {
  const from = ymd(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29))
  const last30 = entries.value.filter(e => e.date >= from)
  return {
    sessions: last30.length,
    hours: Math.round(last30.reduce((a, e) => a + (e.durationMin || 0), 0) / 6) / 10,
    km: Math.round(last30.reduce((a, e) => a + (e.distanceKm || 0), 0)),
  }
})

const sportMeta = (sport) => SPORT_TYPES.find(s => s.id === sport) || null

function toggleEntry(id) {
  openId.value = openId.value === id ? null : id
}

function pickDay(d) {
  if (d.entry) {
    weekSelected.value = weekSelected.value?.id === d.entry.id ? null : d.entry
  } else {
    openForm(d.key)
  }
}

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2000)
}

/* ---- New entry form ---- */
const formOpen = ref(false)
const blankForm = () => ({
  date: todayKey,
  sport: 'strength',
  title: '',
  durationMin: 45,
  distanceKm: '',
  volumeKg: '',
  mood: 'focused',
  rpe: 7,
  notes: '',
})
const form = reactive(blankForm())

const needsDistance = computed(() => ['running', 'cycling', 'swimming'].includes(form.sport))
const needsVolume = computed(() => form.sport === 'strength')
const canSave = computed(() => form.title.trim().length > 0 && form.date)

function openForm(date = todayKey) {
  Object.assign(form, blankForm(), { date })
  formOpen.value = true
}

function saveEntry() {
  if (!canSave.value) return
  entries.value.unshift({
    id: `j_${entries.value.length + 1}_${form.date}`,
    date: form.date,
    sport: form.sport,
    title: form.title.trim(),
    durationMin: Number(form.durationMin) || 0,
    ...(needsDistance.value && form.distanceKm ? { distanceKm: Number(form.distanceKm) } : {}),
    ...(needsVolume.value && form.volumeKg ? { volumeKg: Number(form.volumeKg) } : {}),
    mood: form.mood,
    notes: form.notes.trim(),
    rpe: Number(form.rpe),
  })
  formOpen.value = false
  showToast('Entry saved 💪')
}
</script>

<template>
  <div class="journal">
    <header class="journal__head">
      <div>
        <h1 class="journal__title">Training journal</h1>
        <p class="journal__sub">Your story, one session at a time.</p>
      </div>
      <button class="journal__new" @click="openForm()">+ New entry</button>
    </header>

    <!-- Tabs -->
    <div class="tabs" role="tablist">
      <button
        v-for="t in [{ id: 'log', label: 'Log' }, { id: 'progress', label: 'Progress' }]"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        class="tabs__btn"
        :class="{ 'tabs__btn--active': tab === t.id }"
        @click="tab = t.id"
      >{{ t.label }}</button>
    </div>

    <template v-if="tab === 'log'">
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
      <button class="today__cta" @click="router.push('/workout')">Start workout →</button>
    </Card>

    <!-- Week / Month toggle -->
    <Card padding="lg">
      <div class="cal-header">
        <div class="cal-header__main">
          <h3 class="week__title">{{ showMonth ? 'This month' : 'This week' }}</h3>
          <span v-if="!showMonth" class="week__stats">
            {{ weekStats.sessions }} sessions · {{ weekStats.minutes }} min
          </span>
        </div>
        <button class="cal-toggle" @click="showMonth = !showMonth; weekSelected = null">
          {{ showMonth ? 'Week' : 'Month' }}
        </button>
      </div>

      <div v-if="!showMonth" class="week">
        <button
          v-for="d in weekDays"
          :key="d.key"
          type="button"
          class="week__day"
          :class="{
            'week__day--today': d.isToday,
            'week__day--done': d.entry,
            'week__day--future': d.isFuture,
            'week__day--active': weekSelected && weekSelected.id === d.entry?.id,
          }"
          :title="d.entry ? d.entry.title : 'Log a session'"
          @click="pickDay(d)"
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
        </button>
      </div>

      <JournalEntry v-if="!showMonth && weekSelected" :entry="weekSelected" class="week__detail" />

      <WorkoutCalendar v-if="showMonth" :entries="entries" />
    </Card>

    <!-- Recent sessions -->
    <Card padding="none">
      <div class="recent__head">
        <span class="section-h" style="margin:0">
          {{ showAll ? `All sessions (${sortedEntries.length})` : 'Recent sessions' }}
        </span>
        <button v-if="sortedEntries.length > 3" class="recent__all" @click="showAll = !showAll">
          {{ showAll ? 'Show less' : 'See all →' }}
        </button>
      </div>

      <EmptyState
        v-if="!sortedEntries.length"
        icon="📓"
        title="No sessions yet"
        description="Log your first training session to start the journal."
      >
        <button class="journal__new" @click="openForm()">+ New entry</button>
      </EmptyState>

      <ul v-else class="recent__list">
        <li v-for="e in visibleEntries" :key="e.id">
          <button type="button" class="recent__item" @click="toggleEntry(e.id)">
            <SportIcon :sport="e.sport" size="sm" />
            <div class="recent__info">
              <span class="recent__title">{{ e.title }}</span>
              <span class="recent__meta">
                <span v-if="e.durationMin">{{ e.durationMin }} min</span>
                <span v-if="e.distanceKm"> · {{ e.distanceKm }} km</span>
                <span v-if="e.volumeKg"> · {{ e.volumeKg.toLocaleString() }} kg</span>
              </span>
            </div>
            <span class="recent__date">
              {{ new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </span>
            <span class="recent__caret">{{ openId === e.id ? '▴' : '▾' }}</span>
          </button>
          <div v-if="openId === e.id" class="recent__detail">
            <JournalEntry :entry="e" />
          </div>
        </li>
      </ul>
    </Card>
    </template>

    <template v-else>
      <!-- Last 30 days -->
      <Card padding="md" class="summary">
        <div class="summary__cell">
          <span class="summary__value">{{ monthStats.sessions }}</span>
          <span class="summary__label">Sessions</span>
        </div>
        <div class="summary__cell">
          <span class="summary__value">{{ monthStats.hours }}h</span>
          <span class="summary__label">Time</span>
        </div>
        <div class="summary__cell">
          <span class="summary__value">{{ monthStats.km }}km</span>
          <span class="summary__label">Distance</span>
        </div>
        <span class="summary__period">Last 30 days</span>
      </Card>

      <!-- Exercise progress -->
      <Card padding="lg">
        <h3 class="section-h">Exercise progress</h3>
        <ExerciseProgress />
      </Card>

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
    </template>

    <!-- New entry sheet -->
    <Transition name="sheet">
      <div v-if="formOpen" class="sheet" @click.self="formOpen = false">
        <form class="sheet__panel" role="dialog" aria-label="New journal entry" @submit.prevent="saveEntry">
          <div class="sheet__handle" />
          <header class="sheet__head">
            <div>
              <span class="sheet__eyebrow">Journal</span>
              <h2 class="sheet__title">New entry</h2>
            </div>
            <button type="button" class="sheet__close" @click="formOpen = false" aria-label="Close">×</button>
          </header>

          <label class="field">
            <span class="field__label">Date</span>
            <input v-model="form.date" type="date" :max="todayKey" class="field__input" required />
          </label>

          <div class="field">
            <span class="field__label">Sport</span>
            <div class="field__chips">
              <Chip
                v-for="s in SPORT_TYPES"
                :key="s.id"
                size="sm"
                :active="form.sport === s.id"
                @click="form.sport = s.id"
              >{{ s.emoji }} {{ s.label }}</Chip>
            </div>
          </div>

          <label class="field">
            <span class="field__label">Title</span>
            <input v-model="form.title" class="field__input" placeholder="Push day — felt strong" required />
          </label>

          <div class="field__row">
            <label class="field">
              <span class="field__label">Duration (min)</span>
              <input v-model.number="form.durationMin" type="number" min="0" class="field__input" />
            </label>
            <label v-if="needsDistance" class="field">
              <span class="field__label">Distance (km)</span>
              <input v-model.number="form.distanceKm" type="number" min="0" step="0.1" class="field__input" />
            </label>
            <label v-if="needsVolume" class="field">
              <span class="field__label">Volume (kg)</span>
              <input v-model.number="form.volumeKg" type="number" min="0" step="10" class="field__input" />
            </label>
          </div>

          <div class="field">
            <span class="field__label">Mood</span>
            <div class="field__chips">
              <Chip
                v-for="m in MOODS"
                :key="m.id"
                size="sm"
                :active="form.mood === m.id"
                @click="form.mood = m.id"
              >{{ m.emoji }} {{ m.label }}</Chip>
            </div>
          </div>

          <label class="field">
            <span class="field__label">Effort (RPE) — {{ form.rpe }}/10</span>
            <input v-model.number="form.rpe" type="range" min="1" max="10" step="1" class="field__range" />
          </label>

          <label class="field">
            <span class="field__label">Notes</span>
            <textarea v-model="form.notes" rows="3" class="field__input" placeholder="How did it go?" />
          </label>

          <div class="sheet__actions">
            <button type="button" class="sheet__btn" @click="formOpen = false">Cancel</button>
            <button type="submit" class="sheet__btn sheet__btn--primary" :disabled="!canSave">Save entry</button>
          </div>
        </form>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
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

/* Tabs */
.tabs {
  display: flex;
  gap: var(--space-1);
  padding: 4px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
}
.tabs__btn {
  flex: 1;
  padding: var(--space-2);
  background: transparent;
  border: none;
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.tabs__btn--active { background: var(--color-accent); color: var(--color-accent-ink); }

/* 30-day summary */
.summary { display: flex; align-items: center; gap: var(--space-3); position: relative; }
.summary__cell { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.summary__value {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
.summary__label {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.summary__period {
  position: absolute;
  top: var(--space-3);
  right: var(--space-4);
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
}

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
.recent__list > li { border-bottom: 1px solid var(--color-border); }
.recent__list > li:last-child { border-bottom: none; }
.recent__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: background var(--t-fast) var(--ease);
}
.recent__item:hover { background: var(--color-surface-hover); }
.recent__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.recent__title { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--color-text); }
.recent__meta { font-size: var(--fs-xs); color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
.recent__date { font-size: var(--fs-xs); color: var(--color-text-dim); white-space: nowrap; }
.recent__caret { font-size: var(--fs-xs); color: var(--color-text-dim); }
.recent__detail { padding: 0 var(--space-3) var(--space-3); }

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
  gap: var(--space-3);
}
.cal-header__main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.week__stats { font-size: var(--fs-xs); color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
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
  flex-shrink: 0;
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
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
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
.week__day:hover .week__circle { border-color: var(--color-border-strong); }
.week__day--today .week__circle {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-glow);
}
.week__day--done .week__circle {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
}
.week__day--active .week__circle {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.week__day--active .week__num { color: var(--color-accent-ink); }
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
.week__detail { margin-top: var(--space-4); }

/* New entry sheet */
.sheet {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sheet__panel {
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%;
  max-width: 36rem;
  max-height: 88vh;
  overflow-y: auto;
  padding: var(--space-4) var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: var(--shadow-lg);
}
.sheet__handle {
  width: 2.5rem;
  height: 4px;
  background: var(--color-border-strong);
  border-radius: var(--radius-pill);
  margin: 0 auto var(--space-2);
}
.sheet__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.sheet__eyebrow {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.sheet__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  margin-top: 2px;
}
.sheet__close {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: var(--fs-lg);
  cursor: pointer;
  line-height: 1;
}

.field { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 0; }
.field__row { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.field__label {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--fw-medium);
}
.field__input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: var(--space-3);
  font-family: inherit;
  font-size: var(--fs-sm);
  outline: none;
  resize: vertical;
  transition: border-color var(--t-fast) var(--ease);
  width: 100%;
}
.field__input:focus { border-color: var(--color-accent); }
.field__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.field__range { accent-color: var(--color-accent); width: 100%; }

.sheet__actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
.sheet__btn {
  flex: 1;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.sheet__btn:hover { color: var(--color-text); border-color: var(--color-border-strong); }
.sheet__btn--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-ink);
}
.sheet__btn--primary:hover { background: var(--color-accent-hover); border-color: var(--color-accent-hover); }
.sheet__btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }

.sheet-enter-active, .sheet-leave-active { transition: opacity var(--t-med) var(--ease); }
.sheet-enter-active .sheet__panel, .sheet-leave-active .sheet__panel {
  transition: transform var(--t-med) var(--ease);
}
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet__panel, .sheet-leave-to .sheet__panel { transform: translateY(100%); }

/* Toast */
.toast {
  position: fixed;
  bottom: calc(var(--footer-h) + var(--space-3));
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: var(--color-bg);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}
.toast-enter-active, .toast-leave-active { transition: all var(--t-med) var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (max-width: 480px) {
  .week__circle { width: 2rem; height: 2rem; }
  .week__num { font-size: var(--fs-xs); }
}
</style>
