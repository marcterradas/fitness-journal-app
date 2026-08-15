<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import SportIcon from '@/components/SportIcon.vue'
import ExerciseCard from '@/components/ExerciseCard.vue'
import { useTimer } from '@/composables/useTimer'
import { WEEKDAYS, weeklyTemplates } from '@/mock/templates'

const REST_OPTIONS = [60, 90, 120, 180]
const router = useRouter()

const sport = ref('strength')
const mode = ref('plan') // 'plan' = whole workout, 'focus' = one exercise at a time

const exercises = ref([
  {
    id: 'bench',
    name: 'Bench Press',
    note: 'Pause 1 sec on chest',
    lastWeek: [
      { weight: 95, reps: 10, rpe: 7 },
      { weight: 95, reps: 9, rpe: 8 },
      { weight: 90, reps: 10, rpe: 8 },
    ],
    sets: [
      { id: 1, weight: 100, reps: 10, rpe: 7, comment: '', completed: false },
      { id: 2, weight: 100, reps: 8,  rpe: 8, comment: '', completed: false },
      { id: 3, weight: 95,  reps: 8,  rpe: 9, comment: '', completed: false },
    ],
  },
  {
    id: 'pullups',
    name: 'Pull Ups',
    note: 'Bodyweight + added weight',
    lastWeek: [
      { weight: 0, reps: 10, rpe: 7 },
      { weight: 0, reps: 9, rpe: 8 },
      { weight: 0, reps: 8, rpe: 9 },
    ],
    sets: [
      { id: 1, weight: 5, reps: 10, rpe: 7, comment: '', completed: false },
      { id: 2, weight: 5, reps: 8,  rpe: 8, comment: '', completed: false },
      { id: 3, weight: 0, reps: 10, rpe: 8, comment: '', completed: false },
    ],
  },
  {
    id: 'row',
    name: 'Bent-over Row',
    note: 'Brace core, pull to belly',
    lastWeek: [
      { weight: 75, reps: 10, rpe: 7 },
      { weight: 75, reps: 10, rpe: 8 },
      { weight: 70, reps: 12, rpe: 8 },
    ],
    sets: [
      { id: 1, weight: 80, reps: 10, rpe: 7, comment: '', completed: false },
      { id: 2, weight: 80, reps: 10, rpe: 8, comment: '', completed: false },
      { id: 3, weight: 75, reps: 12, rpe: 8, comment: '', completed: false },
    ],
  },
  {
    id: 'curl',
    name: 'Bicep Curl',
    note: '',
    lastWeek: [
      { weight: 12, reps: 12, rpe: 7 },
      { weight: 12, reps: 10, rpe: 8 },
    ],
    sets: [
      { id: 1, weight: 14, reps: 12, rpe: 7, comment: '', completed: false },
      { id: 2, weight: 14, reps: 10, rpe: 8, comment: '', completed: false },
      { id: 3, weight: 12, reps: 12, rpe: 8, comment: '', completed: false },
    ],
  },
])

const today = computed(() =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())
)

const totalSets = computed(() => exercises.value.reduce((a, e) => a + e.sets.length, 0))
const completedCount = computed(() =>
  exercises.value.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0)
)
const totalVolume = computed(() =>
  exercises.value.reduce((acc, e) =>
    acc + e.sets
      .filter(s => s.completed)
      .reduce((a, s) => a + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0)
  , 0)
)
const progressPct = computed(() =>
  totalSets.value === 0 ? 0 : Math.round((completedCount.value / totalSets.value) * 100)
)

const toast = ref('')
const pickerOpen = ref(false)

/* ---- Session clock ---- */
const startedAt = ref(null)
const now = ref(Date.now())
let clockId = null

const sessionRunning = computed(() => startedAt.value !== null)
const elapsed = computed(() => {
  if (!startedAt.value) return '00:00'
  const s = Math.floor((now.value - startedAt.value) / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
})

function startSession() {
  if (!startedAt.value) {
    startedAt.value = Date.now()
    now.value = Date.now()
    clockId = setInterval(() => { now.value = Date.now() }, 1000)
  }
  mode.value = 'focus'
  current.value = firstUnfinished()
}

function stopSession() {
  clearInterval(clockId)
  clockId = null
  startedAt.value = null
}

onUnmounted(stopSession)

/* ---- Rest timer ---- */
const restSeconds = ref(REST_OPTIONS[2])
const restOpen = ref(false)

const {
  formattedTime: restTime,
  timeRemaining: restRemaining,
  isActive: isRestActive,
  start: startRest,
  stop: stopRest,
  reset: resetRest,
  toggle: toggleRest,
} = useTimer(restSeconds.value)

function beginRest() {
  restOpen.value = true
  resetRest(restSeconds.value)
  startRest()
}
function dismissRest() {
  stopRest()
  restOpen.value = false
}
function addRest(sec) {
  const next = Math.max(0, restRemaining.value + sec)
  const wasActive = isRestActive.value
  resetRest(next)
  if (wasActive) startRest()
}

/* ---- Focus navigation ---- */
const current = ref(0)

const currentExercise = computed(() => exercises.value[current.value] || null)
const exerciseDone = (ex) => ex.sets.length > 0 && ex.sets.every(s => s.completed)

function firstUnfinished() {
  const i = exercises.value.findIndex(e => !exerciseDone(e))
  return i === -1 ? 0 : i
}
function go(delta) {
  const next = current.value + delta
  if (next < 0 || next >= exercises.value.length) return
  current.value = next
  dismissRest()
}

/* ---- Set actions ---- */
function toggleSet(ei, si) {
  const set = exercises.value[ei].sets[si]
  set.completed = !set.completed
  if (set.completed && si < exercises.value[ei].sets.length - 1) beginRest()
  else if (!set.completed) dismissRest()
}

function addSet(ei) {
  const sets = exercises.value[ei].sets
  const last = sets[sets.length - 1]
  sets.push({
    id: Date.now(),
    weight: last?.weight || 0,
    reps: last?.reps || 0,
    rpe: last?.rpe || 7,
    comment: '',
    completed: false,
  })
}

function removeSet(ei, si) {
  exercises.value[ei].sets.splice(si, 1)
}

function copyLastWeek(ei, si) {
  const ref = exercises.value[ei].lastWeek[si]
  if (!ref) return
  Object.assign(exercises.value[ei].sets[si], { weight: ref.weight, reps: ref.reps, rpe: ref.rpe })
}

function addExercise() {
  exercises.value.push({
    id: `new_${Date.now()}`,
    name: 'New exercise',
    note: '',
    lastWeek: [],
    sets: [{ id: Date.now() + 1, weight: 0, reps: 0, rpe: 7, comment: '', completed: false }],
  })
}

function removeExercise(ei) {
  exercises.value.splice(ei, 1)
  if (current.value >= exercises.value.length) current.value = Math.max(0, exercises.value.length - 1)
  if (!exercises.value.length) mode.value = 'plan'
}

/* ---- Templates ---- */
function loadTemplate(dayId) {
  const tpl = weeklyTemplates[dayId]
  if (!tpl) return
  sport.value = tpl.sport
  for (const t of tpl.exercises) {
    const setCount = Number(t.sets) || 1
    exercises.value.push({
      id: `${dayId}_${t.id}_${Date.now()}`,
      name: t.name,
      note: t.reps ? `Target: ${setCount} × ${t.reps}` : '',
      lastWeek: [],
      sets: Array.from({ length: setCount }, (_, i) => ({
        id: Date.now() + i,
        weight: 0,
        reps: 0,
        rpe: 7,
        comment: '',
        completed: false,
      })),
    })
  }
  pickerOpen.value = false
  showToast(`${tpl.title} loaded`)
}

function clearAndLoad(dayId) {
  exercises.value = []
  loadTemplate(dayId)
}

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2000)
}

function share() {
  const lines = exercises.value.map(ex => {
    const done = ex.sets.filter(s => s.completed)
    if (!done.length) return null
    return `${ex.name}: ${done.map(s => `${s.weight}kg × ${s.reps} @${s.rpe}`).join(', ')}`
  }).filter(Boolean)
  const summary = lines.join('\n') || 'No sets logged yet'
  if (navigator.share) navigator.share({ title: 'Workout', text: summary }).catch(() => {})
  else showToast('Link copied · share anywhere')
}

function finish() {
  dismissRest()
  stopSession()
  showToast('Workout saved 💪')
  setTimeout(() => router.push('/journal'), 800)
}
</script>

<template>
  <div class="log">
    <!-- ============ PLAN MODE: the whole workout ============ -->
    <template v-if="mode === 'plan'">
      <header class="log__head">
        <button class="log__back" @click="router.back()" aria-label="Back">←</button>
        <div class="log__title-wrap">
          <span class="log__date">{{ today }}</span>
          <h1 class="log__title">Today's workout</h1>
        </div>
        <button class="log__icon-btn" @click="pickerOpen = true" aria-label="Templates" title="Use a template">
          <span class="log__icon-glyph">🗓</span>
          <span class="log__icon-lbl">Templates</span>
        </button>
        <button class="log__icon-btn" @click="share" aria-label="Share workout" title="Share">
          <span class="log__icon-glyph">↗</span>
          <span class="log__icon-lbl">Share</span>
        </button>
      </header>

      <Card padding="md" class="summary">
        <SportIcon :sport="sport" size="md" />
        <div class="summary__item">
          <span class="summary__v">{{ completedCount }}<span class="summary__sep">/</span>{{ totalSets }}</span>
          <span class="summary__l">sets</span>
        </div>
        <div class="summary__item">
          <span class="summary__v">{{ exercises.length }}</span>
          <span class="summary__l">exercises</span>
        </div>
        <div class="summary__item">
          <span class="summary__v">{{ sessionRunning ? elapsed : totalVolume.toLocaleString() }}</span>
          <span class="summary__l">{{ sessionRunning ? 'elapsed' : 'kg volume' }}</span>
        </div>
        <div class="summary__bar">
          <div class="summary__fill" :style="{ width: `${progressPct}%` }" />
        </div>
      </Card>

      <button v-if="exercises.length" class="log__start" @click="startSession">
        {{ sessionRunning ? `Back to session · ${elapsed}` : 'Start workout →' }}
      </button>

      <ExerciseCard
        v-for="(ex, ei) in exercises"
        :key="ex.id"
        :exercise="ex"
        :index="ei"
        @toggle-set="si => toggleSet(ei, si)"
        @add-set="addSet(ei)"
        @remove-set="si => removeSet(ei, si)"
        @copy-last="si => copyLastWeek(ei, si)"
        @remove="removeExercise(ei)"
      />

      <button class="add-exercise" @click="addExercise">
        <span>+</span> Add exercise
      </button>

      <button v-if="sessionRunning" class="log__finish" @click="finish">Finish workout</button>
    </template>

    <!-- ============ FOCUS MODE: one exercise at a time ============ -->
    <template v-else>
      <header class="focus__bar">
        <button class="log__back" @click="mode = 'plan'" aria-label="Back to full workout" title="Full workout">☰</button>
        <div class="focus__clock">
          <span class="focus__time">{{ elapsed }}</span>
          <span class="focus__clock-lbl">elapsed</span>
        </div>
        <div class="focus__stats">
          <span class="focus__stat">{{ completedCount }}/{{ totalSets }} sets</span>
          <span class="focus__stat">{{ totalVolume.toLocaleString() }} kg</span>
        </div>
        <div class="focus__bar-progress">
          <div class="focus__bar-fill" :style="{ width: `${progressPct}%` }" />
        </div>
      </header>

      <nav class="focus__nav">
        <button class="focus__nav-btn" :disabled="current === 0" @click="go(-1)">← Prev</button>
        <span class="focus__nav-label">Exercise {{ current + 1 }} of {{ exercises.length }}</span>
        <button class="focus__nav-btn" :disabled="current >= exercises.length - 1" @click="go(1)">Next →</button>
      </nav>

      <ExerciseCard
        v-if="currentExercise"
        :key="currentExercise.id"
        :exercise="currentExercise"
        :index="current"
        focus
        @toggle-set="si => toggleSet(current, si)"
        @add-set="addSet(current)"
        @remove-set="si => removeSet(current, si)"
        @copy-last="si => copyLastWeek(current, si)"
        @remove="removeExercise(current)"
      />

      <div class="focus__dots">
        <button
          v-for="(ex, ei) in exercises"
          :key="ex.id"
          class="focus__dot"
          :class="{
            'focus__dot--active': ei === current,
            'focus__dot--done': exerciseDone(ex),
          }"
          :title="ex.name"
          @click="current = ei; dismissRest()"
        />
      </div>

      <button
        v-if="currentExercise && exerciseDone(currentExercise) && current < exercises.length - 1"
        class="focus__next-cta"
        @click="go(1)"
      >
        Next: {{ exercises[current + 1].name }} →
      </button>

      <button class="log__finish" @click="finish">Finish workout</button>
    </template>

    <!-- Rest timer bar -->
    <Transition name="toast">
      <div v-if="restOpen" class="rest">
        <span class="rest__icon">⏱</span>
        <div class="rest__main">
          <span class="rest__time">{{ restTime }}</span>
          <span class="rest__lbl">{{ restRemaining === 0 ? 'Rest over — go' : 'Rest' }}</span>
        </div>
        <div class="rest__actions">
          <button class="rest__btn" @click="addRest(-30)">−30s</button>
          <button class="rest__btn" @click="addRest(30)">+30s</button>
          <button class="rest__btn" @click="toggleRest">{{ isRestActive ? 'Pause' : 'Resume' }}</button>
          <button class="rest__btn rest__btn--skip" @click="dismissRest">Skip</button>
        </div>
      </div>
    </Transition>

    <!-- Rest length picker -->
    <div v-if="mode === 'focus'" class="rest-pref">
      <span class="rest-pref__lbl">Rest</span>
      <button
        v-for="o in REST_OPTIONS"
        :key="o"
        class="rest-pref__opt"
        :class="{ 'rest-pref__opt--active': restSeconds === o }"
        @click="restSeconds = o"
      >{{ o >= 60 ? `${o / 60}m` : `${o}s` }}</button>
    </div>

    <!-- Template picker drawer -->
    <Transition name="picker">
      <div v-if="pickerOpen" class="picker" @click.self="pickerOpen = false">
        <div class="picker__sheet" role="dialog" aria-label="Choose template">
          <div class="picker__handle" />
          <header class="picker__head">
            <div>
              <span class="picker__eyebrow">Templates</span>
              <h2 class="picker__title">Use a weekly plan</h2>
            </div>
            <button class="picker__close" @click="pickerOpen = false" aria-label="Close">×</button>
          </header>

          <p class="picker__hint">Tap a day to append its exercises. "Replace" clears your current list first.</p>

          <ul class="picker__list">
            <li v-for="d in WEEKDAYS" :key="d.id" class="tpl">
              <div class="tpl__main">
                <span class="tpl__day">{{ d.label }}</span>
                <SportIcon v-if="weeklyTemplates[d.id]" :sport="weeklyTemplates[d.id].sport" size="sm" />
                <span v-else class="tpl__sport-rest">—</span>
                <div class="tpl__info">
                  <span class="tpl__name">
                    {{ weeklyTemplates[d.id]?.title || 'Rest day' }}
                  </span>
                  <span v-if="weeklyTemplates[d.id]" class="tpl__meta">
                    {{ weeklyTemplates[d.id].exercises.length }} exercises ·
                    {{ weeklyTemplates[d.id].durationMin }} min
                  </span>
                </div>
              </div>
              <div v-if="weeklyTemplates[d.id]" class="tpl__actions">
                <button class="tpl__btn" @click="clearAndLoad(d.id)" title="Replace">Replace</button>
                <button class="tpl__btn tpl__btn--primary" @click="loadTemplate(d.id)" title="Append">Use</button>
              </div>
            </li>
          </ul>

          <button class="picker__manage" @click="router.push('/templates')">
            Edit weekly templates →
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.log { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }

/* Header */
.log__head { display: flex; align-items: center; gap: var(--space-2); }
.log__back {
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
.log__back:hover { background: var(--color-surface-hover); }

.log__title-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.log__date {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--fw-medium);
}
.log__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.log__icon-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  transition: background var(--t-fast) var(--ease);
  flex-shrink: 0;
}
.log__icon-btn:hover { background: var(--color-surface-hover); }
.log__icon-glyph { font-size: var(--fs-md); }

/* Summary */
.summary {
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr;
  align-items: center;
  gap: var(--space-4);
  position: relative;
  overflow: hidden;
}
.summary__item { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
.summary__v {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-family: var(--font-display);
  font-variant-numeric: tabular-nums;
}
.summary__sep { color: var(--color-text-dim); margin: 0 0.15em; }
.summary__l {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.summary__bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--color-surface-2); }
.summary__fill { height: 100%; background: var(--color-accent); transition: width var(--t-med) var(--ease); }

/* Start / finish */
.log__start {
  padding: var(--space-4);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.log__start:hover { background: var(--color-accent-hover); }

/* Focus mode */
.focus__bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  overflow: hidden;
}
.focus__clock { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.focus__time {
  font-family: var(--font-display);
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.focus__clock-lbl {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.focus__stats { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; }
.focus__stat { font-size: var(--fs-xs); color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
.focus__bar-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--color-surface-2); }
.focus__bar-fill { height: 100%; background: var(--color-accent); transition: width var(--t-med) var(--ease); }

.focus__nav { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.focus__nav-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.focus__nav-btn:hover:not(:disabled) { background: var(--color-surface-hover); }
.focus__nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.focus__nav-label {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--fw-medium);
}

.focus__dots { display: flex; justify-content: center; gap: var(--space-2); }
.focus__dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  padding: 0;
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.focus__dot--done { background: var(--color-accent); border-color: var(--color-accent); }
.focus__dot--active { transform: scale(1.5); border-color: var(--color-text); }

.focus__next-cta {
  padding: var(--space-3) var(--space-4);
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
}

/* Rest length preference */
.rest-pref {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}
.rest-pref__lbl {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.rest-pref__opt {
  padding: 0.2rem var(--space-3);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.rest-pref__opt--active {
  background: var(--color-secondary-soft);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

/* Rest bar */
.rest {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(var(--footer-h) + var(--space-3));
  width: min(36rem, calc(100% - 2 * var(--space-4)));
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-secondary-soft);
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-lg);
  z-index: 90;
}
.rest__icon { font-size: 1.25rem; }
.rest__main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.rest__time {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-secondary);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.rest__lbl { font-size: var(--fs-xs); color: var(--color-text-muted); }
.rest__actions { display: flex; gap: var(--space-1); flex-wrap: wrap; justify-content: flex-end; }
.rest__btn {
  padding: var(--space-1) var(--space-3);
  background: transparent;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.rest__btn:hover { background: var(--color-secondary); color: white; }
.rest__btn--skip { border-color: var(--color-border-strong); color: var(--color-text-muted); }
.rest__btn--skip:hover { background: var(--color-surface-2); color: var(--color-text); }

.add-exercise {
  background: var(--color-bg-elevated);
  border: 1px dashed var(--color-border-strong);
  color: var(--color-text-muted);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.add-exercise:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.log__finish {
  margin-top: var(--space-3);
  padding: var(--space-4);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.log__finish:hover { background: var(--color-accent-hover); }

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

/* Picker drawer */
.picker {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.picker__sheet {
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
.picker__handle {
  width: 2.5rem;
  height: 4px;
  background: var(--color-border-strong);
  border-radius: var(--radius-pill);
  margin: 0 auto var(--space-2);
}
.picker__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.picker__eyebrow {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.picker__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  margin-top: 2px;
}
.picker__close {
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
.picker__hint {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  background: var(--color-surface);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
}

.picker__list { display: flex; flex-direction: column; gap: var(--space-2); }
.tpl {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
}
.tpl__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.tpl__day {
  width: 2.5rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  text-align: center;
}
.tpl__sport-rest {
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-dim);
}
.tpl__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.tpl__name { color: var(--color-text); font-weight: var(--fw-semibold); font-size: var(--fs-sm); }
.tpl__meta { color: var(--color-text-dim); font-size: var(--fs-xs); }
.tpl__actions { display: flex; gap: var(--space-1); flex-shrink: 0; }
.tpl__btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.tpl__btn:hover { color: var(--color-text); border-color: var(--color-border-strong); }
.tpl__btn--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-ink);
}
.tpl__btn--primary:hover { background: var(--color-accent-hover); border-color: var(--color-accent-hover); }

.picker__manage {
  margin-top: var(--space-2);
  padding: var(--space-3);
  background: transparent;
  border: 1px dashed var(--color-border-strong);
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.picker__manage:hover { color: var(--color-accent); border-color: var(--color-accent); }

.picker-enter-active, .picker-leave-active { transition: opacity var(--t-med) var(--ease); }
.picker-enter-active .picker__sheet, .picker-leave-active .picker__sheet {
  transition: transform var(--t-med) var(--ease);
}
.picker-enter-from, .picker-leave-to { opacity: 0; }
.picker-enter-from .picker__sheet, .picker-leave-to .picker__sheet { transform: translateY(100%); }

@media (max-width: 480px) {
  .summary { grid-template-columns: auto 1fr 1fr; }
  .summary__item:nth-child(4) { display: none; }
  .log__icon-lbl { display: none; }
  .rest { flex-wrap: wrap; }
  .tpl__actions { flex-direction: column; }
}
</style>
