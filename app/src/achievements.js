// Achievements are derived, never stored: every one reads a number the app already tracks
// and compares it to a ladder of goals. Add a rung, not a migration.
import { e1rm, loadOf, TIERS } from '@/ranking'
import { REVIEWER_BADGES } from '@/reviews'

const norm = s => String(s || '').toLowerCase().replace(/[_-]+/g, ' ')

/** Best estimated 1RM among the sets whose exercise name matches `key`. */
function bestLift(sets, key, bodyweightKg) {
  return (sets || [])
    .filter(s => norm(s.exercise).includes(key))
    .reduce((max, s) => Math.max(max, e1rm(loadOf(s, bodyweightKg), s.reps)), 0)
}

// value: read from the stats bundle. goals: the ladder, ascending. unit: appended to the goal in the label.
const LADDERS = [
  { id: 'workouts', icon: '✅', title: 'workouts', group: 'Consistency',
    goals: [10, 50, 100, 500, 1000], value: s => s.workouts },
  { id: 'streak', icon: '🔥', title: 'day streak', group: 'Consistency',
    goals: [7, 30, 100, 365], value: s => s.streakDays },
  { id: 'sports', icon: '🌈', title: 'sports logged', group: 'Consistency',
    goals: [2, 3, 5], value: s => s.sports },

  { id: 'bench', icon: '🏋️', title: 'bench press', unit: ' kg', group: 'Strength',
    goals: [60, 80, 100, 140], value: s => bestLift(s.sets, 'bench', s.bodyweightKg) },
  { id: 'squat', icon: '🦵', title: 'squat', unit: ' kg', group: 'Strength',
    goals: [80, 120, 160, 200], value: s => bestLift(s.sets, 'squat', s.bodyweightKg) },
  { id: 'deadlift', icon: '🪝', title: 'deadlift', unit: ' kg', group: 'Strength',
    goals: [100, 140, 180, 220], value: s => bestLift(s.sets, 'deadlift', s.bodyweightKg) },
  { id: 'pullup', icon: '🧲', title: 'pull-up (bodyweight in)', unit: ' kg', group: 'Strength',
    goals: [70, 90, 110, 140], value: s => bestLift(s.sets, 'pull up', s.bodyweightKg) },

  { id: 'run', icon: '🏃', title: 'in one run', unit: ' km', group: 'Endurance',
    goals: [5, 10, 21.1, 42.2], names: [null, null, 'Half marathon', 'Marathon'],
    value: s => s.longestRunKm, decimals: 1 },
  { id: 'ride', icon: '🚴', title: 'in one ride', unit: ' km', group: 'Endurance',
    goals: [20, 50, 100, 160], names: [null, null, 'Century ride (100 km)', null],
    value: s => s.longestRideKm, decimals: 1 },

  { id: 'rank', icon: '💎', title: 'DOTS rank', group: 'Rank',
    goals: TIERS.filter(t => ['gold', 'diamond', 'master', 'god'].includes(t.id)).map(t => t.min),
    names: ['Gold tier', 'Diamond tier', 'Master tier', 'God tier'], value: s => s.dots },

  // Same ladder the Explore review queue awards — one source, two places it shows up.
  { id: 'reviews', icon: '🎥', title: 'lifts reviewed', group: 'Community',
    goals: REVIEWER_BADGES.map(b => b.min),
    names: REVIEWER_BADGES.map(b => `${b.icon} ${b.label}`), value: s => s.reviewed },
  { id: 'followers', icon: '👥', title: 'followers', group: 'Community',
    goals: [50, 250, 1000], value: s => s.followers },
]

/** Where a value sits on a ladder: how many rungs cleared, and how far to the next one. */
export function progressOf(value, goals) {
  const v = Math.max(0, value || 0)
  const level = goals.filter(g => v >= g).length
  const goal = goals[Math.min(level, goals.length - 1)]
  const done = level === goals.length
  const from = level ? goals[level - 1] : 0
  return { level, goal, done, next: done ? null : goal, progress: done ? 1 : (v - from) / (goal - from) }
}

const fmt = (n, d = 0) => Number(n).toFixed(d).replace(/\.0$/, '')

const longest = (entries, sport) =>
  entries.reduce((m, e) => (e.sport === sport ? Math.max(m, e.distanceKm || 0) : m), 0)

/** The stats bundle every achievement reads. Everything else in the app feeds this one shape. */
export function achievementStats({ user, entries = [], reviewed = 0, dots = 0 }) {
  return {
    workouts: user.stats.workouts,
    streakDays: user.stats.streakDays,
    followers: user.stats.followers,
    sports: new Set(entries.map(e => e.sport)).size,
    longestRunKm: longest(entries, 'running'),
    longestRideKm: longest(entries, 'cycling'),
    sets: user.bestSets,
    bodyweightKg: user.weightKg,
    reviewed,
    dots,
  }
}

/** Every achievement with its live progress, hardest-earned first when earned, closest first when not. */
export function achievementsFrom(stats) {
  return LADDERS.map(def => {
    const value = def.value(stats)
    const p = progressOf(value, def.goals)
    const idx = Math.min(p.level, def.goals.length - 1)
    const shown = p.done ? def.goals[def.goals.length - 1] : def.goals[idx]
    // The rung you are working on vs the last one you cleared — badges must show the latter.
    const rung = (i) => def.names?.[i] ?? `${fmt(def.goals[i], def.decimals)}${def.unit ?? ''} ${def.title}`
    return {
      ...def,
      value,
      ...p,
      // "100 kg bench press", or a named rung like "Marathon"
      label: rung(p.done ? def.goals.length - 1 : idx),
      earnedLabel: p.level ? rung(p.level - 1) : null,
      valueLabel: `${fmt(value, def.decimals)}${def.unit ?? ''} / ${fmt(shown, def.decimals)}${def.unit ?? ''}`,
      earned: p.level > 0,
      levels: def.goals.length,
    }
  })
}

// Other athletes only expose a few numbers (a board row, a feed author). Everything unknown reads
// as zero, so their locked ladders drop out and only what they actually earned shows.
const EMPTY = {
  workouts: 0, streakDays: 0, followers: 0, sports: 0, longestRunKm: 0, longestRideKm: 0,
  sets: [], bodyweightKg: 0, reviewed: 0, dots: 0,
}

/** Best few achievements a person has actually earned, hardest first. */
export function topAchievements(person, n = 3) {
  if (!person) return []
  return achievementsFrom({
    ...EMPTY,
    workouts: person.workouts ?? person.stats?.workouts ?? 0,
    streakDays: person.streak ?? person.stats?.streakDays ?? 0,
    followers: person.stats?.followers ?? 0,
    sets: person.bestSets ?? [],
    bodyweightKg: person.bodyweightKg ?? person.weightKg ?? 0,
    dots: person.dots ?? 0,
  })
    .filter(a => a.earned)
    .sort((a, b) => b.level - a.level || b.progress - a.progress)
    .slice(0, n)
}
