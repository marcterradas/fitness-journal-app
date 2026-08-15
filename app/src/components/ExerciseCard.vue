<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  exercise: { type: Object, required: true },
  index: { type: Number, required: true },
  focus: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-set', 'add-set', 'remove-set', 'copy-last', 'remove'])

const collapsed = ref(false)
const editingName = ref(false)
const openComment = ref(null)

const done = computed(() => props.exercise.sets.length > 0 && props.exercise.sets.every(s => s.completed))
const progress = computed(() => {
  const sets = props.exercise.sets
  if (!sets.length) return 0
  return Math.round((sets.filter(s => s.completed).length / sets.length) * 100)
})
const body = computed(() => props.focus || !collapsed.value)

function toggleComment(si) {
  openComment.value = openComment.value === si ? null : si
}
</script>

<template>
  <section class="exercise" :class="{ 'exercise--done': done, 'exercise--focus': focus }">
    <header class="exercise__head">
      <span class="exercise__index">{{ index + 1 }}</span>
      <div class="exercise__title-wrap" @click="!focus && (collapsed = !collapsed)">
        <input
          v-if="editingName"
          v-model="exercise.name"
          class="exercise__name-input"
          @blur="editingName = false"
          @keyup.enter="editingName = false"
          @click.stop
          v-focus
        />
        <h2 v-else class="exercise__title" title="Click to rename" @click.stop="editingName = true">
          {{ exercise.name }}
          <span class="exercise__pencil">✎</span>
        </h2>
        <span v-if="exercise.note" class="exercise__note">{{ exercise.note }}</span>
      </div>
      <div class="exercise__meta">
        <span class="exercise__progress">{{ progress }}%</span>
        <button
          class="exercise__remove"
          title="Remove exercise"
          aria-label="Remove exercise"
          @click.stop="emit('remove')"
        >×</button>
        <button
          v-if="!focus"
          class="exercise__caret"
          :aria-label="collapsed ? 'Expand' : 'Collapse'"
          @click.stop="collapsed = !collapsed"
        >{{ collapsed ? '▾' : '▴' }}</button>
      </div>
    </header>

    <div v-show="body" class="exercise__body">
      <div class="sets__head">
        <span class="sets__col sets__col--num">#</span>
        <span class="sets__col">Weight</span>
        <span class="sets__col">Reps</span>
        <span class="sets__col sets__col--rpe">@ RPE</span>
        <span class="sets__col sets__col--act"></span>
      </div>

      <template v-for="(set, si) in exercise.sets" :key="set.id">
        <div class="set" :class="{ 'set--done': set.completed }">
          <button
            class="set__num"
            :class="{ 'set__num--done': set.completed }"
            @click="emit('toggle-set', si)"
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
            <button class="set__icon-btn" :class="{ 'set__icon-btn--active': set.comment }" title="Add note" @click="toggleComment(si)">💬</button>
            <button class="set__icon-btn set__icon-btn--remove" title="Remove set" @click="emit('remove-set', si)">×</button>
          </div>
        </div>

        <div v-if="exercise.lastWeek[si]" class="lastweek">
          <span class="lastweek__lbl">Last week</span>
          <span class="lastweek__data">
            {{ exercise.lastWeek[si].weight }}kg × {{ exercise.lastWeek[si].reps }}
            <span class="lastweek__rpe">@{{ exercise.lastWeek[si].rpe }}</span>
          </span>
          <button class="lastweek__copy" @click="emit('copy-last', si)">Copy ↺</button>
        </div>

        <div v-if="openComment === si" class="comment">
          <textarea v-model="set.comment" rows="2" placeholder="How did it feel? Any cues?" class="comment__input" />
        </div>
      </template>

      <button class="sets__add" @click="emit('add-set')">
        <span>+</span> Add set
      </button>
    </div>
  </section>
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
.exercise--focus { background: var(--color-bg-elevated); }

.exercise__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}
.exercise__title-wrap { flex: 1; min-width: 0; cursor: pointer; }
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
.exercise--focus .exercise__title { font-size: var(--fs-xl); }
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

.exercise__meta { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
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
.sets__col--num, .sets__col--rpe { text-align: center; }

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
.exercise--focus .set { background: var(--color-surface); }
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
.exercise--focus .set__field { background: var(--color-bg-elevated); }
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

@media (max-width: 480px) {
  .sets__head, .set { grid-template-columns: 2.5rem 1fr 1fr 4rem auto; gap: var(--space-1); }
  .lastweek { padding-left: calc(2.5rem + var(--space-2)); }
}
</style>
