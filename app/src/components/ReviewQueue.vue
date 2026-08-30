<script setup>
import { computed, ref } from 'vue'
import Card from '@/components/Card.vue'
import Chip from '@/components/Chip.vue'
import ReviewCard from '@/components/ReviewCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { REVIEW_TIER, TIERS } from '@/ranking'
import { reviewerStats } from '@/mock/leaderboard'
import { pendingReviews, reviewedCount, reviewerBadge } from '@/reviews'

const filter = ref('all')
const reviewTier = TIERS.find(t => t.id === REVIEW_TIER)

const queue = computed(() =>
  filter.value === 'following' ? pendingReviews.value.filter(s => s.athlete.followed) : pendingReviews.value
)
const followingCount = computed(() => pendingReviews.value.filter(s => s.athlete.followed).length)
</script>

<template>
  <div class="rq">
    <!-- Reward for contributing: the badge ladder, driven by lifetime reviews. -->
    <Card padding="md" class="rq__me">
      <div class="rq__head">
        <span class="rq__icon">{{ reviewerBadge.earned?.icon ?? '🔍' }}</span>
        <div class="rq__id">
          <span class="rq__label">{{ reviewerBadge.earned?.label ?? 'Not a reviewer yet' }}</span>
          <span class="rq__sub">{{ reviewedCount.toLocaleString() }} lifts reviewed · {{ Math.round(reviewerStats.agreementRate * 100) }}% agreement</span>
        </div>
        <span class="rq__rank">#{{ reviewerStats.rank.toLocaleString() }}<small> of {{ reviewerStats.totalReviewers.toLocaleString() }}</small></span>
      </div>

      <div v-if="reviewerBadge.next" class="rq__next">
        <div class="rq__track"><div class="rq__bar" :style="{ width: reviewerBadge.progress * 100 + '%' }" /></div>
        <span class="rq__sub">{{ reviewerBadge.toNext }} more to {{ reviewerBadge.next.icon }} {{ reviewerBadge.next.label }}</span>
      </div>

      <div class="rq__badges">
        <span
          v-for="b in reviewerBadge.all"
          :key="b.id"
          class="rq__badge"
          :class="{ 'rq__badge--on': b.earned }"
          :title="`${b.label} — ${b.min} reviews`"
        >{{ b.icon }} {{ b.label }}</span>
      </div>
    </Card>

    <p class="rq__why">
      {{ reviewTier.icon }} {{ reviewTier.label }} and above must film their scoring lifts. The community votes;
      a lift only counts toward a rank once it passes.
    </p>

    <div class="rq__tabs">
      <Chip :active="filter === 'all'" @click="filter = 'all'">🌍 All ({{ pendingReviews.length }})</Chip>
      <Chip :active="filter === 'following'" @click="filter = 'following'">👥 Following ({{ followingCount }})</Chip>
    </div>

    <div v-if="queue.length" class="rq__list">
      <ReviewCard
        v-for="s in queue"
        :key="s.id"
        :sub="s"
        :reason="s.athlete.followed ? `You follow ${s.athlete.name}` : ''"
      />
    </div>

    <EmptyState
      v-else
      icon="✅"
      title="Queue clear"
      description="No lifts waiting on your vote. New submissions land here as they come in."
    />
  </div>
</template>

<style scoped>
.rq { display: flex; flex-direction: column; gap: var(--space-4); }

.rq__me { display: flex; flex-direction: column; gap: var(--space-3); }
.rq__head { display: flex; align-items: center; gap: var(--space-3); }
.rq__icon { font-size: 1.75rem; }
.rq__id { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.rq__label { font-weight: var(--fw-semibold); }
.rq__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.rq__rank { font-weight: var(--fw-bold); font-variant-numeric: tabular-nums; }
.rq__rank small { font-size: var(--fs-xs); font-weight: var(--fw-medium); color: var(--color-text-dim); }

.rq__next { display: flex; flex-direction: column; gap: var(--space-1); }
.rq__track { height: 4px; border-radius: 999px; background: var(--color-surface-2); overflow: hidden; }
.rq__bar { height: 100%; background: var(--color-accent); border-radius: inherit; }

.rq__badges { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.rq__badge {
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  background: var(--color-surface-2);
  color: var(--color-text-dim);
  opacity: 0.55;
}
.rq__badge--on { background: var(--color-accent-soft); color: var(--color-accent); opacity: 1; }

.rq__why { margin: 0; font-size: var(--fs-sm); color: var(--color-text-muted); }
.rq__tabs { display: flex; gap: var(--space-2); }
.rq__list { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
