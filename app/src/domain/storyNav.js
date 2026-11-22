// Advance/rewind through a list of users each holding a list of story items.
// Returns the next position, or null when the run is over (viewer should close).
// Rewinding past the very first item stays put.
export function step(stories, userIdx, itemIdx, dir) {
  if (dir > 0) {
    if (itemIdx < stories[userIdx].items.length - 1) return { userIdx, itemIdx: itemIdx + 1 }
    if (userIdx < stories.length - 1) return { userIdx: userIdx + 1, itemIdx: 0 }
    return null
  }
  if (itemIdx > 0) return { userIdx, itemIdx: itemIdx - 1 }
  if (userIdx > 0) return { userIdx: userIdx - 1, itemIdx: stories[userIdx - 1].items.length - 1 }
  return { userIdx, itemIdx }
}
