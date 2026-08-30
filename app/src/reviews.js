// Community review of high-tier lifts: Diamond+ only scores once the crowd validates the video.
// ponytail: module-level reactive state, no store lib — swap for API calls when a backend exists.
import { reactive, computed } from 'vue'
import { reviewQueue, reviewerStats } from '@/mock/leaderboard'

// Reviewing is the contribution: badges are the reward for doing it.
export const REVIEWER_BADGES = [
  { id: 'scout',      label: 'Scout',      icon: '🔍', min: 10 },
  { id: 'spotter',    label: 'Spotter',    icon: '👀', min: 50 },
  { id: 'judge',      label: 'Judge',      icon: '⚖️', min: 250 },
  { id: 'head_judge', label: 'Head Judge', icon: '🏛️', min: 1000 },
]

const state = reactive({
  votes: {},                        // submissionId -> 'valid' | 'invalid'
  reviewed: reviewerStats.reviewed, // lifetime count, seeded from the server-side total
})

export const myVote = id => state.votes[id] ?? null

export function vote(id, verdict) {
  if (state.votes[id]) return
  state.votes[id] = verdict
  state.reviewed += 1
}

/** Live tally for a submission: server counts plus my own vote. */
export function tallyOf(sub) {
  const mine = myVote(sub.id)
  const valid = sub.votes.valid + (mine === 'valid' ? 1 : 0)
  const invalid = sub.votes.invalid + (mine === 'invalid' ? 1 : 0)
  return { valid, invalid, cast: valid + invalid, progress: Math.min(1, (valid + invalid) / sub.votes.needed) }
}

export const reviewedCount = computed(() => state.reviewed)

/** Highest badge earned, and the next one with progress toward it. */
export const reviewerBadge = computed(() => {
  const n = state.reviewed
  const i = REVIEWER_BADGES.findLastIndex(b => n >= b.min)
  const earned = REVIEWER_BADGES[i] || null
  const next = REVIEWER_BADGES[i + 1] || null
  const from = earned?.min ?? 0
  return {
    earned,
    next,
    toNext: next ? next.min - n : 0,
    progress: next ? (n - from) / (next.min - from) : 1,
    all: REVIEWER_BADGES.map(b => ({ ...b, earned: n >= b.min })),
  }
})

/** Everything still open — the Explore review queue. */
export const pendingReviews = computed(() => reviewQueue.filter(s => !myVote(s.id)))

/** Only athletes you follow — these are the ones worth interrupting the Home feed for. */
export const followedReviews = computed(() => pendingReviews.value.filter(s => s.athlete.followed))
