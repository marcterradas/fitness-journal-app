<script setup>
import { ref, watch } from 'vue'
import { EXERCISE_MEDIA_CREDIT } from '@/mock/exercises'

const props = defineProps({
  exercise: { type: Object, default: null },
})
const emit = defineEmits(['close'])

// ponytail: native <dialog> gives focus trap, Esc and backdrop for free — same as RankInfo
const el = ref(null)
watch(() => props.exercise, e => (e ? el.value?.showModal() : el.value?.close()))
</script>

<template>
  <dialog ref="el" class="ex" @close="emit('close')" @click.self="emit('close')">
    <template v-if="exercise">
      <header class="ex__head">
        <div class="ex__id">
          <h2 class="ex__title">{{ exercise.name }}</h2>
          <span class="ex__sub">{{ exercise.bodyPart }} · {{ exercise.equipment }}</span>
        </div>
        <button type="button" class="ex__close" aria-label="Close" @click="emit('close')">×</button>
      </header>

      <div class="ex__body">
        <!-- ponytail: still frame stands in for the demo clip; swap the box for <video> when clips exist -->
        <div class="ex__video">
          <img :src="exercise.image" :alt="exercise.name" class="ex__frame" width="180" height="180" />
          <button type="button" class="ex__play" aria-label="Play demo (not available yet)" disabled>▶</button>
          <span class="ex__soon">Demo video coming soon</span>
        </div>

        <div class="ex__chips">
          <span class="ex__chip ex__chip--main">🎯 {{ exercise.muscle }}</span>
          <span v-for="m in exercise.secondary" :key="m" class="ex__chip">{{ m }}</span>
        </div>

        <ol class="ex__steps">
          <li v-for="(s, i) in exercise.steps" :key="i" class="ex__step">{{ s }}</li>
        </ol>

        <p class="ex__credit">{{ EXERCISE_MEDIA_CREDIT }}</p>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
.ex {
  width: min(560px, calc(100vw - 2 * var(--space-4)));
  max-height: 85vh;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 16px);
  background: var(--color-bg-elevated);
  color: var(--color-text);
  overflow: hidden;
}
.ex::backdrop { background: rgba(0, 0, 0, 0.6); }

.ex__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.ex__id { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ex__title { margin: 0; font-size: var(--fs-lg); font-weight: var(--fw-bold); }
.ex__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.ex__close {
  border: 0;
  background: none;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 var(--space-1);
}

.ex__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  overflow-y: auto;
  max-height: calc(85vh - 5rem);
}

.ex__video {
  position: relative;
  display: grid;
  place-items: center;
  height: 200px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  overflow: hidden;
}
/* 180x180 source: shown at its own size, blurred copy fills the rest of the frame */
.ex__frame { width: 180px; height: 180px; object-fit: contain; }
.ex__play {
  position: absolute;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.55);
  color: var(--color-text-muted);
  font-size: var(--fs-lg);
  cursor: not-allowed;
}
.ex__soon {
  position: absolute;
  bottom: var(--space-2);
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.ex__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.ex__chip {
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
}
.ex__chip--main { background: var(--color-accent-soft); color: var(--color-accent); }

.ex__steps { margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: var(--space-2); }
.ex__step { font-size: var(--fs-sm); color: var(--color-text-muted); line-height: 1.5; }
.ex__step::marker { color: var(--color-accent); font-weight: var(--fw-bold); }

.ex__credit { margin: 0; font-size: 0.65rem; color: var(--color-text-dim); }
</style>
