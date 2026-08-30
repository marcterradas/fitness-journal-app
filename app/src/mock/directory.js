// Every place a person shows up holds a slice of them: the feed knows their avatar, the board
// knows their workouts, the queue knows their bodyweight. Merge once, look up by id or handle.
import { currentUser, friends } from '@/mock/user'
import { friendsBoard, globalBoard, reviewQueue } from '@/mock/leaderboard'
import { feedPosts } from '@/mock/social'

const SLICES = [
  [currentUser, ...friends],
  friendsBoard,
  globalBoard.top,
  [globalBoard.me],
  reviewQueue.map(s => s.athlete),
  feedPosts.map(p => p.user),
]

const people = new Map()
for (const slice of SLICES) {
  for (const p of slice) {
    if (!p?.username) continue
    // First slice wins per field; later ones only fill the gaps.
    people.set(p.username, { ...p, ...people.get(p.username) })
  }
}

// ponytail: two tiny indexes beat a query layer for a few dozen mock users
const byId = new Map([...people.values()].filter(p => p.id).map(p => [p.id, p]))

/** Full record for a person, from an id, a @handle, or a partial object carrying either. */
export function personOf(ref) {
  if (!ref) return null
  const key = typeof ref === 'string' ? ref.replace(/^@/, '') : ref.username || ref.id
  const found = people.get(key) || byId.get(key) || null
  return typeof ref === 'object' ? { ...ref, ...found } : found
}

export const isMe = p => p?.id === currentUser.id
