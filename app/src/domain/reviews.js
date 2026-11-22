// Community review of high-tier lifts: Diamond+ only scores once the crowd validates the video.
// Pure rules only. Vote state lives behind the reviews port (adapters/mock/reviewsStore.js for now).

// Reviewing is the contribution: badges are the reward for doing it.
export const REVIEWER_BADGES = [
  { id: 'scout',      label: 'Scout',      icon: '🔍', min: 10 },
  { id: 'spotter',    label: 'Spotter',    icon: '👀', min: 50 },
  { id: 'judge',      label: 'Judge',      icon: '⚖️', min: 250 },
  { id: 'head_judge', label: 'Head Judge', icon: '🏛️', min: 1000 },
]

/** Live tally for a submission: server counts plus my own vote ('valid' | 'invalid' | null). */
export function tally(sub, mine) {
  const valid = sub.votes.valid + (mine === 'valid' ? 1 : 0)
  const invalid = sub.votes.invalid + (mine === 'invalid' ? 1 : 0)
  return { valid, invalid, cast: valid + invalid, progress: Math.min(1, (valid + invalid) / sub.votes.needed) }
}

/** Highest badge earned for `n` reviews, and the next one with progress toward it. */
export function reviewerBadgeFor(n) {
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
}
