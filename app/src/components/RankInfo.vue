<script setup>
import { ref, watch } from 'vue'
import { TIERS, PLACEMENT_SESSIONS, REVIEW_TIER } from '@/ranking'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

// ponytail: native <dialog> gives focus trap, Esc and backdrop for free
const el = ref(null)
watch(() => props.open, o => (o ? el.value?.showModal() : el.value?.close()))

const reviewTier = TIERS.find(t => t.id === REVIEW_TIER)
</script>

<template>
  <dialog ref="el" class="info" @close="emit('close')" @click.self="emit('close')">
    <header class="info__head">
      <h2 class="info__title">How ranks work</h2>
      <button type="button" class="info__close" aria-label="Close" @click="emit('close')">×</button>
    </header>

    <div class="info__body">
      <p class="info__lead">
        Your rank measures <strong>strength, not activity</strong>. Logging more sessions does not move it —
        lifting more, relative to your own bodyweight, does. It is a rating you keep: no monthly reset,
        no decay for taking time off. Once earned, it is yours until you beat it.
      </p>

      <section class="step">
        <span class="step__n">1</span>
        <div>
          <h3 class="step__t">Every set becomes an estimated 1RM</h3>
          <p class="step__p">Weight × (1 + reps ÷ 30). Reps above 12 count as 12 — past that the estimate lies.</p>
          <code class="step__c">100 kg × 5 reps → 116.7 kg</code>
        </div>
      </section>

      <section class="step">
        <span class="step__n">2</span>
        <div>
          <h3 class="step__t">Bodyweight moves count your body</h3>
          <p class="step__p">Pull-ups lift 100% of you, dips 95%, push-ups 64%. Added plates stack on top.</p>
          <code class="step__c">Pull-up @ 75 kg bodyweight + 20 kg → 95 kg</code>
        </div>
      </section>

      <section class="step">
        <span class="step__n">3</span>
        <div>
          <h3 class="step__t">Three patterns, best lift of each</h3>
          <p class="step__p">
            Push, pull and legs — your best ever in each, whenever you hit it. A pattern you never train
            counts as zero, so you cannot rank up on bench alone.
          </p>
          <code class="step__c">best push + best pull + best legs = your total</code>
        </div>
      </section>

      <section class="step">
        <span class="step__n">4</span>
        <div>
          <h3 class="step__t">Your total is scaled to your body</h3>
          <p class="step__p">
            We convert it to <strong>DOTS</strong>, the powerlifting standard that adjusts for bodyweight and
            sex. A 60 kg and a 95 kg athlete can hold the same rank — the lighter one just needs less on the bar.
          </p>
        </div>
      </section>

      <h3 class="info__h">Tiers</h3>
      <ul class="tierlist">
        <li v-for="t in TIERS" :key="t.id" class="tierlist__row" :style="{ '--tier-color': t.color }">
          <span class="tierlist__icon">{{ t.icon }}</span>
          <span class="tierlist__label">{{ t.label }}</span>
          <span class="tierlist__min">{{ t.min }}+ DOTS</span>
        </li>
      </ul>
      <p class="info__note">
        Each tier splits into four divisions (IV → I). The bar under your rank is your progress through the
        current division.
      </p>

      <h3 class="info__h">{{ reviewTier.icon }} {{ reviewTier.label }} and above: community review</h3>
      <p class="info__p">
        From {{ reviewTier.label }} up, scores are not taken on trust. Every lift that counts toward your total
        needs a video attached, and the community reviews it:
      </p>
      <ul class="bullets">
        <li>Attach a clip to the set — full lift, plates visible, no cuts.</li>
        <li>Reviewers at your tier or higher vote it <strong>valid</strong> or <strong>invalid</strong>.</li>
        <li>A lift needs a clear majority to keep counting. Rejected lifts drop out of your total and your rank recalculates.</li>
        <li>Unreviewed lifts still show on your profile — they just do not score above {{ reviewTier.label }}.</li>
      </ul>
      <p class="info__note">Below {{ reviewTier.label }} nothing changes: log it and it counts.</p>

      <h3 class="info__h">House rules</h3>
      <ul class="bullets">
        <li><strong>Placement:</strong> {{ PLACEMENT_SESSIONS }} logged sessions before a rank appears.</li>
        <li><strong>No reset, no decay:</strong> seasons do not wipe it and time off does not cost it. Come back after a year and your rank is where you left it.</li>
        <li><strong>It only goes up:</strong> a bad session cannot drop you — the score reads your best lift, not your last one.</li>
        <li><strong>Sanity cap:</strong> a set over 5× your bodyweight is treated as a typo and ignored.</li>
      </ul>
      <p class="info__note">
        Bodyweight is the one thing that moves it both ways: gain weight and the same bar scores fewer
        DOTS, lose weight and it scores more.
      </p>
    </div>
  </dialog>
</template>

<style scoped>
.info {
  width: min(560px, calc(100vw - 2 * var(--space-4)));
  max-height: 85vh;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 16px);
  background: var(--color-bg-elevated);
  color: var(--color-text);
  overflow: hidden;
}
.info::backdrop { background: rgba(0, 0, 0, 0.6); }

.info__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-bg-elevated);
}
.info__title { margin: 0; font-size: var(--fs-lg); font-weight: var(--fw-bold); }
.info__close {
  border: 0;
  background: none;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 var(--space-1);
}

.info__body {
  padding: var(--space-4);
  overflow-y: auto;
  max-height: calc(85vh - 60px);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.info__lead { margin: 0; color: var(--color-text-muted); font-size: var(--fs-sm); }
.info__h {
  margin: var(--space-2) 0 0;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
}
.info__p, .info__note { margin: 0; font-size: var(--fs-sm); color: var(--color-text-muted); }
.info__note { font-size: var(--fs-xs); color: var(--color-text-dim); }

.step { display: flex; gap: var(--space-3); align-items: flex-start; }
.step__n {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
}
.step__t { margin: 0 0 2px; font-size: var(--fs-sm); font-weight: var(--fw-semibold); }
.step__p { margin: 0; font-size: var(--fs-sm); color: var(--color-text-muted); }
.step__c {
  display: inline-block;
  margin-top: var(--space-1);
  padding: 2px 8px;
  border-radius: var(--radius-sm, 8px);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
}

.tierlist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.tierlist__row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-sm, 8px);
  background: color-mix(in srgb, var(--tier-color) 10%, var(--color-surface-2));
  font-size: var(--fs-sm);
}
.tierlist__label { font-weight: var(--fw-semibold); color: var(--tier-color); }
.tierlist__min { margin-left: auto; font-size: var(--fs-xs); color: var(--color-text-dim); }

.bullets { margin: 0; padding-left: var(--space-5); list-style: disc; display: flex; flex-direction: column; gap: var(--space-1); }
.bullets li::marker { color: var(--color-text-dim); }
.bullets li { font-size: var(--fs-sm); color: var(--color-text-muted); }
</style>
