<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Button from '@/components/Button.vue'
import { reviewSubmission as sub } from '@/mock/leaderboard'
import { tierFromDots } from '@/ranking'

const tier = tierFromDots(sub.athlete.dots)
const vote = ref(null) // null | 'valid' | 'invalid'

const tally = computed(() => ({
  valid: sub.votes.valid + (vote.value === 'valid' ? 1 : 0),
  invalid: sub.votes.invalid + (vote.value === 'invalid' ? 1 : 0),
}))
const progress = computed(() =>
  Math.min(1, (tally.value.valid + tally.value.invalid) / sub.votes.needed)
)
</script>

<template>
  <Card padding="md" class="rev" :style="{ '--tier-color': tier.color }">
    <header class="rev__head">
      <span class="rev__eyebrow">🎥 Community review</span>
      <span class="rev__ago">{{ sub.submittedAgo }}</span>
    </header>

    <div class="rev__who">
      <Avatar :src="sub.athlete.avatar" :alt="sub.athlete.name" size="md" ring="accent" />
      <div class="rev__id">
        <span class="rev__name">{{ sub.athlete.name }}</span>
        <span class="rev__tier">{{ tier.icon }} {{ tier.label }} {{ tier.division }} · {{ tier.dots }} DOTS</span>
      </div>
    </div>

    <div class="rev__lift">
      <span class="rev__weight">{{ sub.weightKg }} kg × {{ sub.reps }}</span>
      <span class="rev__ex">{{ sub.exercise }} · at {{ sub.athlete.bodyweightKg }} kg bodyweight</span>
    </div>

    <div class="rev__video">
      <span class="rev__play">▶</span>
      <span class="rev__dur">0:{{ sub.videoSeconds }}</span>
    </div>

    <p class="rev__ask">
      Full lift, plates visible, no cuts? Your vote decides whether it counts toward his rank.
    </p>

    <div class="rev__actions">
      <Button variant="primary" size="sm" :disabled="vote !== null" @click="vote = 'valid'">👍 Approve</Button>
      <Button variant="danger" size="sm" :disabled="vote !== null" @click="vote = 'invalid'">👎 Deny</Button>
    </div>

    <div class="rev__tally">
      <div class="rev__track"><div class="rev__bar" :style="{ width: progress * 100 + '%' }" /></div>
      <span class="rev__counts">
        {{ tally.valid }} approve · {{ tally.invalid }} deny ·
        {{ Math.max(0, sub.votes.needed - tally.valid - tally.invalid) }} votes to close
      </span>
    </div>

    <p v-if="vote" class="rev__done">
      {{ vote === 'valid' ? '👍 Approved' : '👎 Denied' }} — vote recorded.
    </p>
  </Card>
</template>

<style scoped>
.rev { display: flex; flex-direction: column; gap: var(--space-3); }

.rev__head { display: flex; align-items: center; justify-content: space-between; }
.rev__eyebrow {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tier-color);
}
.rev__ago { font-size: var(--fs-xs); color: var(--color-text-dim); }

.rev__who { display: flex; align-items: center; gap: var(--space-3); }
.rev__id { display: flex; flex-direction: column; }
.rev__name { font-weight: var(--fw-semibold); font-size: var(--fs-sm); }
.rev__tier { font-size: var(--fs-xs); color: var(--tier-color); }

.rev__lift { display: flex; flex-direction: column; gap: 2px; }
.rev__weight { font-size: var(--fs-xl); font-weight: var(--fw-bold); font-variant-numeric: tabular-nums; }
.rev__ex { font-size: var(--fs-xs); color: var(--color-text-muted); }

/* ponytail: placeholder frame — real clips land when uploads exist */
.rev__video {
  position: relative;
  display: grid;
  place-items: center;
  height: 140px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-bg-elevated));
}
.rev__play { font-size: 1.75rem; color: var(--color-text-muted); }
.rev__dur {
  position: absolute;
  right: var(--space-2);
  bottom: var(--space-2);
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.rev__ask { margin: 0; font-size: var(--fs-sm); color: var(--color-text-muted); }
.rev__actions { display: flex; gap: var(--space-2); }
.rev__actions > * { flex: 1; }

.rev__tally { display: flex; flex-direction: column; gap: var(--space-1); }
.rev__track { height: 4px; border-radius: 999px; background: var(--color-surface-2); overflow: hidden; }
.rev__bar { height: 100%; background: var(--tier-color); border-radius: inherit; }
.rev__counts { font-size: var(--fs-xs); color: var(--color-text-dim); }

.rev__done { margin: 0; font-size: var(--fs-sm); font-weight: var(--fw-semibold); color: var(--color-accent); }
</style>
