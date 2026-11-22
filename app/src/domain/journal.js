// Journal rules: pure functions over plain entry objects. No React, no IO, no '@/' alias
// (relative imports only), so any test runner can import this file directly.
import { addDays, isYmd, mondayOf, parseYmd, ymd } from './dates.js'

/**
 * @typedef {{ id: string, date: string, sport: string, title: string, durationMin?: number,
 *   distanceKm?: number, volumeKg?: number, mood?: string, rpe?: number, notes?: string }} Entry
 */

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEKDAYS_FROM_SUNDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DISTANCE_SPORTS = ['running', 'cycling', 'swimming']

export const sortByDateDesc = entries => [...entries].sort((a, b) => b.date.localeCompare(a.date))

export const totals = entries => ({
  sessions: entries.length,
  minutes: entries.reduce((a, e) => a + (e.durationMin || 0), 0),
  km: entries.reduce((a, e) => a + (e.distanceKm || 0), 0),
})

/** "45 min · 8 km · 4,200 kg" */
export const entryMeta = e => [
  e.durationMin && `${e.durationMin} min`,
  e.distanceKm && `${e.distanceKm} km`,
  e.volumeKg && `${e.volumeKg.toLocaleString()} kg`,
].filter(Boolean).join(' · ')

/** Mon→Sun of the current week, each day with its entry (if any). */
export function weekStrip(entries, today) {
  const todayKey = ymd(today)
  const monday = mondayOf(today)
  return WEEK_LABELS.map((label, i) => {
    const d = addDays(monday, i)
    const key = ymd(d)
    return {
      label, key, day: d.getDate(),
      entry: entries.find(e => e.date === key) || null,
      isToday: key === todayKey,
      isFuture: key > todayKey,
    }
  })
}

/** Sessions, hours and km over the last 30 days (today included). */
export function last30Stats(entries, today) {
  const from = ymd(addDays(today, -29))
  const t = totals(entries.filter(e => e.date >= from))
  return { sessions: t.sessions, hours: Math.round(t.minutes / 6) / 10, km: Math.round(t.km) }
}

/** Month calendar: weekday headers + cells (blanks pad to full weeks). `month` is any date in it. */
export function monthGrid(entries, month, today, weekStartsOn = 1) {
  const todayKey = ymd(today)
  const byDate = new Map()
  for (const e of entries) byDate.set(e.date, [...(byDate.get(e.date) || []), e])
  const year = month.getFullYear(), m = month.getMonth()
  const offset = (new Date(year, m, 1).getDay() - weekStartsOn + 7) % 7
  const last = new Date(year, m + 1, 0).getDate()

  const cells = Array.from({ length: offset }, (_, i) => ({ blank: true, key: `b${i}` }))
  for (let d = 1; d <= last; d++) {
    const key = ymd(new Date(year, m, d))
    cells.push({ blank: false, key, day: d, isToday: key === todayKey, isFuture: key > todayKey, entries: byDate.get(key) || [] })
  }
  while (cells.length % 7) cells.push({ blank: true, key: `t${cells.length}` })

  const start = weekStartsOn % 7
  const prefix = ymd(month).slice(0, 7)
  return {
    weekdays: [...WEEKDAYS_FROM_SUNDAY.slice(start), ...WEEKDAYS_FROM_SUNDAY.slice(0, start)],
    weeks: Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7)),
    summary: totals(entries.filter(e => e.date.startsWith(prefix))),
  }
}

/** First/last/best of a progress series, for the exercise progress chart. */
export function trend(points) {
  const values = points.map(p => p.value)
  const min = Math.min(...values), max = Math.max(...values)
  const diff = Math.round((values.at(-1) - values[0]) * 10) / 10
  return { min, max, span: max - min || 1, diff, pct: Math.round((diff / values[0]) * 100) }
}

// ---- New entry form ---------------------------------------------------------------------

export const needsDistance = sport => DISTANCE_SPORTS.includes(sport)
export const needsVolume = sport => sport === 'strength'

export const blankEntryForm = date => ({
  date, sport: 'strength', title: '', durationMin: '45',
  distanceKm: '', volumeKg: '', mood: 'focused', rpe: 7, notes: '',
})

/** field → message; empty object = valid. */
export function validateEntryForm(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Give the session a title.'
  if (!isYmd(form.date) || isNaN(parseYmd(form.date))) errors.date = 'Use YYYY-MM-DD.'
  return errors
}

/** Form strings → Entry (without id: the repository assigns it). */
export function entryFromForm(form) {
  return {
    date: form.date,
    sport: form.sport,
    title: form.title.trim(),
    durationMin: Number(form.durationMin) || 0,
    ...(needsDistance(form.sport) && form.distanceKm ? { distanceKm: Number(form.distanceKm) } : {}),
    ...(needsVolume(form.sport) && form.volumeKg ? { volumeKg: Number(form.volumeKg) } : {}),
    mood: form.mood,
    rpe: form.rpe,
    notes: form.notes.trim(),
  }
}

/** Everything the Journal screen derives from the raw entries, for a given day. */
export function journalOverview(entries, today) {
  const week = weekStrip(entries, today)
  const done = week.filter(d => d.entry)
  return {
    todayKey: ymd(today),
    entries: sortByDateDesc(entries),
    week,
    weekStats: { sessions: done.length, minutes: done.reduce((a, d) => a + (d.entry.durationMin || 0), 0) },
    last30: last30Stats(entries, today),
  }
}
