<script setup>
import { computed } from 'vue'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Button from '@/components/Button.vue'
import UserHoverCard from '@/components/UserHoverCard.vue'
import { tierFromDots } from '@/ranking'
import { myVote, tallyOf, vote } from '@/reviews'

const props = defineProps({
  sub: { type: Object, required: true },
  // Home shows it because you follow the athlete; Explore shows the whole queue.
  reason: { type: String, default: '' },
})

const tier = computed(() => tierFromDots(props.sub.athlete.dots))
const cast = computed(() => myVote(props.sub.id))
const tally = computed(() => tallyOf(props.sub))
</script>

<template>
  <Card padding="md" class="rev" :style="{ '--tier-color': tier.color }">
    <header class="rev__head">
      <span class="rev__eyebrow">🎥 Community review</span>
      <span class="rev__ago">{{ sub.submittedAgo }}</span>
    </header>

    <p v-if="reason" class="rev__reason">{{ reason }}</p>

    <div class="rev__who">
      <UserHoverCard :user="sub.athlete">
        <Avatar :src="sub.athlete.avatar" :alt="sub.athlete.name" size="md" ring="accent" />
      </UserHoverCard>
      <div class="rev__id">
        <UserHoverCard :user="sub.athlete">
          <span class="rev__name" tabindex="0">{{ sub.athlete.name }}</span>
        </UserHoverCard>
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
      Full lift, plates visible, no cuts? Your vote decides whether it counts toward their rank.
    </p>

    <div class="rev__actions">
      <Button variant="primary" size="sm" :disabled="!!cast" @click="vote(sub.id, 'valid')">👍 Approve</Button>
      <Button variant="danger" size="sm" :disabled="!!cast" @click="vote(sub.id, 'invalid')">👎 Deny</Button>
    </div>

    <div class="rev__tally">
      <div class="rev__track"><div class="rev__bar" :style="{ width: tally.progress * 100 + '%' }" /></div>
      <span class="rev__counts">
        {{ tally.valid }} approve · {{ tally.invalid }} deny ·
        {{ Math.max(0, sub.votes.needed - tally.cast) }} votes to close
      </span>
    </div>

    <p v-if="cast" class="rev__done">
      {{ cast === 'valid' ? '👍 Approved' : '👎 Denied' }} — vote recorded, +1 review.
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
.rev__reason { margin: 0; font-size: var(--fs-xs); color: var(--color-text-dim); }

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
