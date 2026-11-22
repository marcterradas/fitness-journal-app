// Dates travel as 'YYYY-MM-DD' strings (local day). Always parse at local midnight.
export const ymd = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseYmd = s => new Date(`${s}T00:00`)

export function addDays(d, n) {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

/** Monday of the week containing `d`. */
export const mondayOf = d => addDays(d, -((d.getDay() + 6) % 7))

export const isYmd = s => /^\d{4}-\d{2}-\d{2}$/.test(s)
