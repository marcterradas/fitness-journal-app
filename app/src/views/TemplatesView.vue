<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Badge from '@/components/Badge.vue'
import Chip from '@/components/Chip.vue'
import SportIcon from '@/components/SportIcon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { SPORT_TYPES } from '@/mock/workouts'
import { WEEKDAYS, weeklyTemplates } from '@/mock/templates'

const router = useRouter()

const todayKey = computed(() => {
  const d = new Date().getDay()
  return d === 0 ? 'sun' : WEEKDAYS[d - 1].id
})

const selectedDay = ref(todayKey.value)
const schedule = ref({ ...weeklyTemplates })
const editing = ref(false)
const newName = ref('')

const current = computed(() => schedule.value[selectedDay.value])
const dayMeta = computed(() => WEEKDAYS.find(d => d.id === selectedDay.value))
const totalSessions = computed(() => Object.values(schedule.value).filter(Boolean).length)

function selectDay(id) {
  selectedDay.value = id
  editing.value = false
}

function startWorkout() {
  router.push('/workout')
}

function addExercise() {
  if (!newName.value.trim()) return
  if (!current.value) {
    schedule.value[selectedDay.value] = {
      id: `t_${selectedDay.value}_${Date.now()}`,
      title: 'New session',
      sport: 'strength',
      durationMin: 30,
      exercises: [],
    }
  }
  schedule.value[selectedDay.value].exercises.push({
    id: `ex_${Date.now()}`,
    name: newName.value.trim(),
    sets: 3,
    reps: '8-10',
  })
  newName.value = ''
}

function removeExercise(id) {
  if (!current.value) return
  current.value.exercises = current.value.exercises.filter(e => e.id !== id)
}

function clearDay() {
  schedule.value[selectedDay.value] = null
  editing.value = false
}

function createRestDay() {
  schedule.value[selectedDay.value] = null
}

function setSport(sportId) {
  if (current.value) current.value.sport = sportId
}
</script>

<template>
  <div class="tpl">
    <header class="tpl__head">
      <button class="tpl__back" @click="router.back()" aria-label="Back">←</button>
      <div class="tpl__title-wrap">
        <span class="tpl__eyebrow">Weekly plan</span>
        <h1 class="tpl__title">Templates</h1>
      </div>
      <button
        class="tpl__edit"
        :class="{ 'tpl__edit--on': editing }"
        @click="editing = !editing"
      >
        {{ editing ? 'Done' : 'Edit' }}
      </button>
    </header>

    <Card padding="md" class="tpl__strip-card">
      <div class="tpl__overview">
        <span class="tpl__overview-v">{{ totalSessions }}<span class="tpl__overview-sep">/</span>7</span>
        <span class="tpl__overview-l">days planned</span>
      </div>
      <div class="tpl__strip">
        <button
          v-for="d in WEEKDAYS"
          :key="d.id"
          class="day"
          :class="{
            'day--active': selectedDay === d.id,
            'day--today': todayKey === d.id,
            'day--has': !!schedule[d.id],
          }"
          @click="selectDay(d.id)"
        >
          <span class="day__lbl">{{ d.label }}</span>
          <span v-if="schedule[d.id]" class="day__sport">
            <SportIcon :sport="schedule[d.id].sport" size="sm" />
          </span>
          <span v-else class="day__rest">—</span>
        </button>
      </div>
    </Card>

    <Card v-if="current" padding="lg" class="session">
      <div class="session__head">
        <div class="session__title-wrap">
          <span class="session__day">{{ dayMeta.long }}</span>
          <h2 class="session__title">{{ current.title }}</h2>
        </div>
        <SportIcon :sport="current.sport" size="lg" />
      </div>

      <div class="session__meta">
        <Badge :tone="current.sport" icon="⏱">{{ current.durationMin }} min</Badge>
        <Badge tone="neutral" icon="📋">{{ current.exercises.length }} exercises</Badge>
      </div>

      <div v-if="editing" class="sport-picker">
        <span class="sport-picker__lbl">Sport</span>
        <div class="sport-picker__chips hide-scrollbar">
          <Chip
            v-for="s in SPORT_TYPES"
            :key="s.id"
            size="sm"
            :active="current.sport === s.id"
            @click="setSport(s.id)"
          >
            {{ s.emoji }} {{ s.label }}
          </Chip>
        </div>
      </div>

      <ul class="exercises">
        <li v-for="(ex, i) in current.exercises" :key="ex.id" class="exercise">
          <span class="exercise__num">{{ i + 1 }}</span>
          <div class="exercise__main">
            <span class="exercise__name">{{ ex.name }}</span>
            <span class="exercise__meta">{{ ex.sets }} × {{ ex.reps }}</span>
          </div>
          <button
            v-if="editing"
            class="exercise__remove"
            @click="removeExercise(ex.id)"
            aria-label="Remove"
            title="Remove"
          >×</button>
        </li>
        <li v-if="!current.exercises.length" class="exercise exercise--empty">
          No exercises yet
        </li>
      </ul>

      <div v-if="editing" class="add-row">
        <input
          v-model="newName"
          class="add-row__input"
          placeholder="Add exercise (e.g. Pull ups)..."
          @keyup.enter="addExercise"
        />
        <button class="add-row__btn" @click="addExercise">Add</button>
      </div>

      <div class="session__actions">
        <button class="session__cta" @click="startWorkout">Start session →</button>
        <button v-if="editing" class="session__clear" @click="clearDay">Mark as rest day</button>
      </div>
    </Card>

    <Card v-else padding="lg" class="rest-day">
      <span class="rest-day__icon">💤</span>
      <h2 class="rest-day__title">Rest day</h2>
      <p class="rest-day__sub">No session planned for {{ dayMeta.long }}. Recovery is part of training.</p>
      <button class="rest-day__add" @click="editing = true; addExercise(); editing = true">
        + Plan a session
      </button>
    </Card>

    <section class="all">
      <h3 class="section-h">Full week</h3>
      <ul class="all__list">
        <li
          v-for="d in WEEKDAYS"
          :key="d.id"
          class="all__row"
          :class="{ 'all__row--today': todayKey === d.id }"
          @click="selectDay(d.id)"
        >
          <span class="all__day">{{ d.long }}</span>
          <SportIcon v-if="schedule[d.id]" :sport="schedule[d.id].sport" size="sm" />
          <span v-else class="all__sport-empty">—</span>
          <span class="all__name">
            {{ schedule[d.id] ? schedule[d.id].title : 'Rest' }}
          </span>
          <span class="all__count">
            {{ schedule[d.id] ? `${schedule[d.id].exercises.length} ex` : '' }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tpl { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }

.tpl__head { display: flex; align-items: center; gap: var(--space-3); }
.tpl__back {
  width: 2.5rem; height: 2.5rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.tpl__title-wrap { flex: 1; min-width: 0; }
.tpl__eyebrow {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.tpl__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--color-text);
}
.tpl__edit {
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  transition: all var(--t-fast) var(--ease);
}
.tpl__edit:hover { background: var(--color-surface-hover); }
.tpl__edit--on {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border-color: var(--color-accent);
}

.tpl__strip-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.tpl__overview { display: flex; align-items: baseline; gap: var(--space-2); }
.tpl__overview-v {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-family: var(--font-display);
}
.tpl__overview-sep { color: var(--color-text-dim); margin: 0 0.15em; }
.tpl__overview-l {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tpl__strip {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
}
.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-1);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
  min-height: 4.5rem;
  justify-content: space-between;
}
.day:hover { border-color: var(--color-border-strong); color: var(--color-text); }
.day__lbl {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.day__rest { color: var(--color-text-dim); font-size: var(--fs-md); }
.day--today { border-color: var(--color-secondary); }
.day--has { color: var(--color-text); }
.day--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-ink);
}
.day--active .day__rest { color: var(--color-accent-ink); }

/* Session */
.session { display: flex; flex-direction: column; gap: var(--space-4); }
.session__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.session__title-wrap { flex: 1; min-width: 0; }
.session__day {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  margin-bottom: var(--space-1);
}
.session__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
}
.session__meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }

.sport-picker {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}
.sport-picker__lbl {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.sport-picker__chips { display: flex; gap: var(--space-1); overflow-x: auto; padding-bottom: var(--space-1); }

.exercises { display: flex; flex-direction: column; gap: var(--space-2); }
.exercise {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.exercise__num {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.exercise__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.exercise__name { color: var(--color-text); font-weight: var(--fw-medium); }
.exercise__meta { color: var(--color-text-dim); font-size: var(--fs-xs); font-variant-numeric: tabular-nums; }
.exercise__remove {
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-dim);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}
.exercise__remove:hover { color: var(--color-danger); border-color: var(--color-danger); }
.exercise--empty {
  justify-content: center;
  color: var(--color-text-dim);
  font-style: italic;
  padding: var(--space-4);
}

.add-row { display: flex; gap: var(--space-2); }
.add-row__input {
  flex: 1;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  outline: none;
  transition: border-color var(--t-fast) var(--ease);
}
.add-row__input:focus { border-color: var(--color-accent); }
.add-row__btn {
  padding: var(--space-3) var(--space-4);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  cursor: pointer;
}

.session__actions { display: flex; gap: var(--space-2); }
.session__cta {
  flex: 1;
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
.session__cta:hover { background: var(--color-accent-hover); }
.session__clear {
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  cursor: pointer;
}
.session__clear:hover { color: var(--color-danger); border-color: var(--color-danger); }

/* Rest day */
.rest-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-2);
}
.rest-day__icon { font-size: 2.5rem; }
.rest-day__title { font-size: var(--fs-xl); font-weight: var(--fw-bold); color: var(--color-text); }
.rest-day__sub { color: var(--color-text-muted); max-width: 30rem; }
.rest-day__add {
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  cursor: pointer;
}

/* Full week list */
.section-h {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
}
.all__list {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.all__row {
  display: grid;
  grid-template-columns: 5rem auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.all__row:last-child { border-bottom: none; }
.all__row:hover { background: var(--color-surface-2); }
.all__row--today { background: var(--color-secondary-soft); }
.all__day {
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  font-size: var(--fs-sm);
}
.all__sport-empty { color: var(--color-text-dim); font-size: var(--fs-md); width: 1.75rem; text-align: center; }
.all__name { color: var(--color-text-muted); font-size: var(--fs-sm); }
.all__count { color: var(--color-text-dim); font-size: var(--fs-xs); font-variant-numeric: tabular-nums; }

@media (max-width: 600px) {
  .all__row { grid-template-columns: 4rem auto 1fr auto; gap: var(--space-2); }
  .all__name { font-size: var(--fs-xs); }
}
</style>
