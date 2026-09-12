// ponytail: mock athletes carry no routine of their own — each gets a stable slice of the
// shared template pool so their profile has something real to copy. Real data replaces this.
import { weeklyTemplates } from '@/mock/templates'

const POOL = Object.values(weeklyTemplates).filter(Boolean)

/** Three workouts for a handle, same three every time. */
export function workoutsOf(handle = '') {
  const seed = [...handle].reduce((a, c) => a + c.charCodeAt(0), 0)
  return [0, 1, 2].map(i => POOL[(seed + i) % POOL.length])
}
