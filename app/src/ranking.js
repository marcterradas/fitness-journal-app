// Competitive rank from lifted load, normalized for bodyweight and sex.
// Score = DOTS points of a push + pull + legs "total" built from estimated 1RMs.

export const TIERS = [
  { id: 'bronze',   label: 'Bronze',   icon: '🥉', min: 0,   color: '#cd7f32' },
  { id: 'silver',   label: 'Silver',   icon: '🥈', min: 150, color: '#c0c0c0' },
  { id: 'gold',     label: 'Gold',     icon: '🥇', min: 225, color: '#ffd700' },
  { id: 'platinum', label: 'Platinum', icon: '🔷', min: 300, color: '#00bcd4' },
  { id: 'emerald',  label: 'Emerald',  icon: '💚', min: 375, color: '#50c878' },
  { id: 'diamond',  label: 'Diamond',  icon: '💎', min: 450, color: '#b9f2ff' },
  { id: 'master',   label: 'Master',   icon: '👑', min: 525, color: '#a259ff' },
  { id: 'god',      label: 'God Tier', icon: '⚡', min: 600, color: '#ff6b35' },
]

export const UNRANKED = { id: 'unranked', label: 'Unranked', icon: '❔', min: 0, color: '#8a8f98' }

export const DIVISIONS = ['IV', 'III', 'II', 'I']

// From this tier up, a scoring lift needs a video the community votes on.
export const REVIEW_TIER = 'diamond'

// Sessions with a scoring set required before a rank is shown.
export const PLACEMENT_SESSIONS = 5

const TIER_SPAN = 75          // DOTS width of a tier

// Share of bodyweight the movement actually lifts.
const LEVERAGE = {
  'pull up': 1, 'chin up': 1, 'muscle up': 1.3, dip: 0.95, 'push up': 0.64,
  'inverted row': 0.55, 'pistol squat': 0.85, 'bodyweight squat': 0.65, 'hanging leg raise': 0.5,
}

// Checked in order: "leg press" must not match the push list.
const PATTERNS = [
  ['legs', ['squat', 'deadlift', 'rdl', 'romanian', 'lunge', 'leg press', 'hip thrust', 'pistol', 'step up']],
  ['pull', ['pull', 'chin', 'row', 'muscle up']],
  ['push', ['bench', 'press', 'dip', 'push', 'ohp']],
]

// DOTS polynomial coefficients (bw in kg), official IPF-derived values.
const DOTS_COEF = {
  male:   [-0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076],
  female: [-0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288],
}

const norm = s => String(s || '').toLowerCase().replace(/[_-]+/g, ' ').trim()

export function patternOf(exercise) {
  const n = norm(exercise)
  for (const [pattern, keys] of PATTERNS) if (keys.some(k => n.includes(k))) return pattern
  return null
}

/** Epley. Reps are capped at 12 — past that the formula overestimates badly. */
export function e1rm(weightKg, reps) {
  if (!(weightKg > 0) || !(reps > 0)) return 0
  if (reps === 1) return weightKg
  return weightKg * (1 + Math.min(reps, 12) / 30)
}

/** Total load moved by a set: bodyweight moves carry a share of the athlete. */
export function loadOf(set, bodyweightKg) {
  const n = norm(set.exercise)
  const key = Object.keys(LEVERAGE).find(k => n.includes(k))
  const added = set.weightKg || 0
  return key ? bodyweightKg * LEVERAGE[key] + added : added
}

/** DOTS points — the bodyweight + sex normalizer. */
export function dots(totalKg, bodyweightKg, sex = 'male') {
  const bw = Math.min(Math.max(bodyweightKg || 0, 40), 200)
  if (!(totalKg > 0) || !bw) return 0
  const poly = c => c[0] * bw ** 4 + c[1] * bw ** 3 + c[2] * bw ** 2 + c[3] * bw + c[4]
  // ponytail: 'other'/unset sits between the two curves; a dedicated curve does not exist
  const d = sex === 'female' ? poly(DOTS_COEF.female)
    : sex === 'male' ? poly(DOTS_COEF.male)
    : (poly(DOTS_COEF.male) + poly(DOTS_COEF.female)) / 2
  return (500 / d) * totalKg
}

/** DOTS score -> tier, division (IV..I) and 0-100 progress inside the division. */
export function tierFromDots(score) {
  const s = Math.max(0, score || 0)
  const i = Math.max(0, TIERS.findLastIndex(t => s >= t.min))
  const tier = TIERS[i]
  const next = TIERS[i + 1] || null
  const span = (next?.min ?? tier.min + TIER_SPAN) - tier.min
  const p = Math.min(0.9999, (s - tier.min) / span)
  const d = Math.floor(p * 4)
  return {
    ...tier,
    division: DIVISIONS[d],
    lp: Math.round((p * 4 - d) * 100),
    dots: Math.round(s),
    next,
    toNext: next ? Math.round(next.min - s) : 0,
  }
}

/** True once the athlete is high enough that lifts must be community-reviewed. */
export function needsReview(tierId) {
  return TIERS.findIndex(t => t.id === tierId) >= TIERS.findIndex(t => t.id === REVIEW_TIER)
}

/**
 * Rating you keep: every set you have ever logged counts, best one per pattern wins.
 * Nothing resets, nothing decays — the score only moves when you out-lift your own best.
 *
 * @param sets  [{ exercise, weightKg, reps, date: 'YYYY-MM-DD' }]
 * @param opts  { bodyweightKg, sex }
 */
export function rankFromSets(sets, { bodyweightKg, sex = 'male' } = {}) {
  const best = { push: 0, pull: 0, legs: 0 }
  const days = new Set()

  for (const set of sets || []) {
    if (!set?.date) continue
    const pattern = patternOf(set.exercise)
    if (!pattern) continue
    const est = e1rm(loadOf(set, bodyweightKg), set.reps)
    // ponytail: 5x bodyweight beats every world record — treat as a typo, not a rank
    if (est <= 0 || est > bodyweightKg * 5) continue
    best[pattern] = Math.max(best[pattern], est)
    days.add(set.date)
  }

  const sessions = days.size
  const total = best.push + best.pull + best.legs
  const score = dots(total, bodyweightKg, sex)

  if (sessions < PLACEMENT_SESSIONS) {
    return { ...UNRANKED, division: '', lp: 0, dots: 0, next: TIERS[0], toNext: 0,
      best, total: Math.round(total), sessions,
      placement: { done: sessions, required: PLACEMENT_SESSIONS } }
  }
  return { ...tierFromDots(score), best, total: Math.round(total), sessions, placement: null }
}
