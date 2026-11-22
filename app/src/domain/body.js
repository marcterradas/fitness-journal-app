// Body metrics: pure helpers.

export const SEXES = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'other', label: 'Other' },
  { id: 'unset', label: 'Rather not say' },
]

export function bmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null
  return weightKg / (heightCm / 100) ** 2
}

export function bmiLabel(value) {
  if (value === null) return '—'
  if (value < 18.5) return 'Underweight'
  if (value < 25) return 'Healthy'
  if (value < 30) return 'Overweight'
  return 'Obese'
}

export function ageFrom(birthDate, now = new Date()) {
  if (!birthDate) return null
  const b = new Date(birthDate)
  let age = now.getFullYear() - b.getFullYear()
  const before = now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  return before ? age - 1 : age
}
