<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import SportIcon from '@/components/SportIcon.vue'
import { useTimer } from '@/composables/useTimer'
import { WEEKDAYS, weeklyTemplates } from '@/mock/templates'

const REST_TIME = 3 * 60
const router = useRouter()

const sport = ref('strength')

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

const activeRest = ref(null)
const expandedComment = ref(null)
const collapsed = ref({})
const editingName = ref(null)
const toast = ref('')
const pickerOpen = ref(false)

const {
  formattedTime,
  isActive: isTimerActive,
  start: startTimer,
  stop: stopTimer,
  reset: resetTimer,
  toggle: toggleTimer,
} = useTimer(REST_TIME)

function isCommentOpen(ei, si) { return expandedComment.value === `${ei}-${si}` }
function toggleComment(ei, si) {
  const key = `${ei}-${si}`
  expandedComment.value = expandedComment.value === key ? null : key
}

function isRestVisible(ei, si) {
  return activeRest.value && activeRest.value.exerciseIndex === ei && activeRest.value.setIndex === si
}

function toggleSet(ei, si) {
  const set = exercises.value[ei].sets[si]
  set.completed = !set.completed
  if (set.completed && si < exercises.value[ei].sets.length - 1) {
    activeRest.value = { exerciseIndex: ei, setIndex: si }
    resetTimer(REST_TIME)
    startTimer()
  } else if (!set.completed && isRestVisible(ei, si)) {
    stopTimer()
    activeRest.value = null
  }
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
  if (isRestVisible(ei, si)) { stopTimer(); activeRest.value = null }
}

function copyLastWeek(ei, si) {
  const ref = exercises.value[ei].lastWeek[si]
  if (!ref) return
  const set = exercises.value[ei].sets[si]
  set.weight = ref.weight
  set.reps = ref.reps
  set.rpe = ref.rpe
}

function exerciseDone(ex) { return ex.sets.length > 0 && ex.sets.every(s => s.completed) }
function exerciseProgress(ex) {
  const done = ex.sets.filter(s => s.completed).length
  return ex.sets.length === 0 ? 0 : Math.round((done / ex.sets.length) * 100)
}

function toggleCollapse(id) { collapsed.value[id] = !collapsed.value[id] }

function startEditName(id) { editingName.value = id }
function stopEditName() { editingName.value = null }

function addExercise() {
  const ex = {
    id: `new_${Date.now()}`,
    name: 'New exercise',
    note: '',
    lastWeek: [],
    sets: [
      { id: Date.now() + 1, weight: 0, reps: 0, rpe: 7, comment: '', completed: false },
    ],
  }
  exercises.value.push(ex)
  collapsed.value[ex.id] = false
  editingName.value = ex.id
}

function removeExercise(ei) {
  if (activeRest.value?.exerciseIndex === ei) {
    stopTimer()
    activeRest.value = null
  }
  exercises.value.splice(ei, 1)
}

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
  showToast('Workout saved 💪')
  setTimeout(() => router.push('/journal'), 800)
}
</script>

<template>
  <div class="log">
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
        <span class="summary__v">{{ totalVolume.toLocaleString() }}</span>
        <span class="summary__l">kg volume</span>
      </div>
      <div class="summary__bar">
        <div class="summary__fill" :style="{ width: `${progressPct}%` }" />
      </div>
    </Card>

    <section
      v-for="(ex, ei) in exercises"
      :key="ex.id"
      class="exercise"
      :class="{ 'exercise--done': exerciseDone(ex) }"
    >
      <header class="exercise__head">
        <span class="exercise__index">{{ ei + 1 }}</span>
        <div class="exercise__title-wrap" @click="toggleCollapse(ex.id)">
          <input
            v-if="editingName === ex.id"
            v-model="ex.name"
            class="exercise__name-input"
            @blur="stopEditName"
            @keyup.enter="stopEditName"
            @click.stop
            v-focus
          />
          <h2 v-else class="exercise__title" @click.stop="startEditName(ex.id)" :title="'Click to rename'">
            {{ ex.name }}
            <span class="exercise__pencil">✎</span>
          </h2>
          <span v-if="ex.note" class="exercise__note">{{ ex.note }}</span>
        </div>
        <div class="exercise__meta">
          <span class="exercise__progress">{{ exerciseProgress(ex) }}%</span>
          <button
            class="exercise__remove"
            @click.stop="removeExercise(ei)"
            aria-label="Remove exercise"
            title="Remove exercise"
          >×</button>
          <button
            class="exercise__caret"
            @click.stop="toggleCollapse(ex.id)"
            :aria-label="collapsed[ex.id] ? 'Expand' : 'Collapse'"
          >{{ collapsed[ex.id] ? '▾' : '▴' }}</button>
        </div>
      </header>

      <div v-show="!collapsed[ex.id]" class="exercise__body">
        <div class="sets__head">
          <span class="sets__col sets__col--num">#</span>
          <span class="sets__col">Weight</span>
          <span class="sets__col">Reps</span>
          <span class="sets__col sets__col--rpe">@ RPE</span>
          <span class="sets__col sets__col--act"></span>
        </div>

        <template v-for="(set, si) in ex.sets" :key="set.id">
          <div class="set" :class="{ 'set--done': set.completed }">
            <button
              class="set__num"
              :class="{ 'set__num--done': set.completed }"
              @click="toggleSet(ei, si)"
            >
              <span v-if="set.completed">✓</span>
              <span v-else>{{ si + 1 }}</span>
            </button>

            <div class="set__field">
              <input v-model.number="set.weight" type="number" inputmode="decimal" step="0.5" class="set__input" :disabled="set.completed" />
              <span class="set__unit">kg</span>
            </div>
            <div class="set__field">
              <input v-model.number="set.reps" type="number" inputmode="numeric" min="0" class="set__input" :disabled="set.completed" />
            </div>
            <div class="set__field set__field--rpe">
              <span class="set__at">@</span>
              <input v-model.number="set.rpe" type="number" inputmode="decimal" step="0.5" min="1" max="10" class="set__input set__input--rpe" :disabled="set.completed" />
            </div>

            <div class="set__act">
              <button class="set__icon-btn" :class="{ 'set__icon-btn--active': set.comment }" @click="toggleComment(ei, si)" title="Add note">💬</button>
              <button class="set__icon-btn set__icon-btn--remove" @click="removeSet(ei, si)" title="Remove set">×</button>
            </div>
          </div>

          <div v-if="ex.lastWeek[si]" class="lastweek">
            <span class="lastweek__lbl">Last week</span>
            <span class="lastweek__data">
              {{ ex.lastWeek[si].weight }}kg × {{ ex.lastWeek[si].reps }}
              <span class="lastweek__rpe">@{{ ex.lastWeek[si].rpe }}</span>
            </span>
            <button class="lastweek__copy" @click="copyLastWeek(ei, si)">Copy ↺</button>
          </div>

          <div v-if="isCommentOpen(ei, si)" class="comment">
            <textarea v-model="set.comment" rows="2" placeholder="How did it feel? Any cues?" class="comment__input" />
          </div>

          <div v-if="isRestVisible(ei, si)" class="rest">
            <span class="rest__icon">⏱</span>
            <span class="rest__time">{{ formattedTime }}</span>
            <div class="rest__actions">
              <button class="rest__btn" @click="toggleTimer">{{ isTimerActive ? 'Pause' : 'Resume' }}</button>
              <button class="rest__btn" @click="resetTimer(REST_TIME)">Reset</button>
            </div>
          </div>
        </template>

        <button class="sets__add" @click="addSet(ei)">
          <span>+</span> Add set
        </button>
      </div>
    </section>

    <button class="add-exercise" @click="addExercise">
      <span>+</span> Add exercise
    </button>

    <button class="log__finish" @click="finish">Finish workout</button>

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

<script>
export default {
  directives: {
    focus: {
      mounted(el) { el.focus(); el.select?.() },
    },
  },
}
</script>

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

/* Exercise card */
.exercise {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--t-fast) var(--ease);
}
.exercise--done {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 4%, var(--color-surface));
}

.exercise__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.exercise__title-wrap {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.exercise__index {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  flex-shrink: 0;
}
.exercise--done .exercise__index { background: var(--color-accent); color: var(--color-accent-ink); }
.exercise__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.exercise__pencil {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  opacity: 0;
  transition: opacity var(--t-fast) var(--ease);
}
.exercise__title:hover .exercise__pencil { opacity: 1; }
.exercise__name-input {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-accent);
  color: var(--color-text);
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  outline: none;
  width: 100%;
  font-family: inherit;
}
.exercise__note {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  display: block;
  margin-top: 2px;
}

.exercise__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
.exercise__progress {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  min-width: 2.5rem;
  text-align: right;
}
.exercise--done .exercise__progress { color: var(--color-accent); }
.exercise__remove,
.exercise__caret {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-dim);
  cursor: pointer;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--t-fast) var(--ease);
}
.exercise__remove:hover { color: var(--color-danger); border-color: var(--color-danger); }
.exercise__caret:hover { background: var(--color-surface-2); color: var(--color-text); }

.exercise__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: 0 var(--space-3) var(--space-4);
}

.sets__head {
  display: grid;
  grid-template-columns: 2.5rem 1fr 1fr 5rem auto;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  align-items: center;
}
.sets__col {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--fw-medium);
}
.sets__col--num { text-align: center; }
.sets__col--rpe { text-align: center; }

.set {
  display: grid;
  grid-template-columns: 2.5rem 1fr 1fr 5rem auto;
  gap: var(--space-2);
  align-items: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  transition: all var(--t-fast) var(--ease);
}
.set--done {
  background: color-mix(in srgb, var(--color-accent) 10%, var(--color-bg-elevated));
  border-color: var(--color-accent);
}

.set__num {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-weight: var(--fw-bold);
  font-size: var(--fs-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--t-fast) var(--ease);
}
.set__num:hover { border-color: var(--color-accent); }
.set__num--done { background: var(--color-accent); color: var(--color-accent-ink); border-color: var(--color-accent); }

.set__field {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-2);
  transition: border-color var(--t-fast) var(--ease);
}
.set__field:focus-within { border-color: var(--color-accent); }
.set__field--rpe { justify-content: center; }

.set__input {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  font-variant-numeric: tabular-nums;
  width: 100%;
  padding: var(--space-2) 0;
  outline: none;
  text-align: center;
}
.set__input:disabled { color: var(--color-text-muted); cursor: not-allowed; }
.set__input--rpe { width: 2.5rem; }

.set__at, .set__unit {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}

.set__act { display: flex; gap: 2px; }
.set__icon-btn {
  width: 2rem; height: 2rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--color-text-dim);
  cursor: pointer;
  font-size: var(--fs-sm);
  transition: all var(--t-fast) var(--ease);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.set__icon-btn:hover { background: var(--color-surface-2); color: var(--color-text); }
.set__icon-btn--active { color: var(--color-accent); }
.set__icon-btn--remove:hover { color: var(--color-danger); }

.lastweek {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3) var(--space-2) calc(2.5rem + var(--space-3));
  font-size: var(--fs-xs);
}
.lastweek__lbl {
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--fw-medium);
}
.lastweek__data { color: var(--color-text-muted); font-variant-numeric: tabular-nums; font-weight: var(--fw-medium); }
.lastweek__rpe { color: var(--color-text-dim); }
.lastweek__copy {
  margin-left: auto;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  border-radius: var(--radius-pill);
  padding: 2px var(--space-2);
  font-size: var(--fs-xs);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.lastweek__copy:hover { border-color: var(--color-accent); color: var(--color-accent); }

.comment { padding: 0 var(--space-3); }
.comment__input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  padding: var(--space-2) var(--space-3);
  font-family: inherit;
  font-size: var(--fs-sm);
  resize: vertical;
  outline: none;
  transition: border-color var(--t-fast) var(--ease);
}
.comment__input:focus { border-color: var(--color-accent); }

.rest {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-secondary-soft);
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin: var(--space-1) var(--space-2);
}
.rest__icon { font-size: 1.25rem; }
.rest__time {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-secondary);
  font-variant-numeric: tabular-nums;
  flex: 1;
}
.rest__actions { display: flex; gap: var(--space-1); }
.rest__btn {
  padding: var(--space-1) var(--space-3);
  background: transparent;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.rest__btn:hover { background: var(--color-secondary); color: white; }

.sets__add {
  margin-top: var(--space-1);
  background: transparent;
  border: 1px dashed var(--color-border-strong);
  color: var(--color-text-muted);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.sets__add:hover { border-color: var(--color-accent); color: var(--color-accent); }

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
  .sets__head, .set { grid-template-columns: 2.5rem 1fr 1fr 4rem auto; gap: var(--space-1); }
  .log__icon-lbl { display: none; }
  .lastweek { padding-left: calc(2.5rem + var(--space-2)); }
  .tpl__actions { flex-direction: column; }
}
</style>
