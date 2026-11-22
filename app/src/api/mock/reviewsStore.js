// LEGACY: sync vote store still used by Home/Explore components. Replaced by api.reviews
// (api/mock/reviews.js) once those screens are wired to the API. Delete then.
import { reviewQueue, reviewerStats } from './data/leaderboard.js'
import { REVIEWER_BADGES, tally, reviewerBadgeFor } from '../../domain/reviews.js'

export { REVIEWER_BADGES }

const state = {
  votes: {},                        // submissionId -> 'valid' | 'invalid'
  reviewed: reviewerStats.reviewed, // lifetime count, seeded from the server-side total
}

export const myVote = id => state.votes[id] ?? null

export function vote(id, verdict) {
  if (state.votes[id]) return
  state.votes[id] = verdict
  state.reviewed += 1
}

export const tallyOf = sub => tally(sub, myVote(sub.id))
export const reviewedCount = () => state.reviewed
export const reviewerBadge = () => reviewerBadgeFor(state.reviewed)
export const pendingReviews = () => reviewQueue.filter(s => !myVote(s.id))
export const followedReviews = () => pendingReviews().filter(s => s.athlete.followed)
