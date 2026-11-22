// Fixed catalogs the whole app shares. Colors are presentation: see ui/theme.js `sport`.
export const SPORT_TYPES = [
  { id: 'strength', label: 'Strength', emoji: '🏋️' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'cycling', label: 'Cycling', emoji: '🚴' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊' },
  { id: 'cardio', label: 'Cardio', emoji: '🔥' },
]

export const MOODS = [
  { id: 'energized', label: 'Energized', emoji: '⚡' },
  { id: 'focused', label: 'Focused', emoji: '🎯' },
  { id: 'tired', label: 'Tired', emoji: '😮‍💨' },
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'sore', label: 'Sore', emoji: '🥵' },
  { id: 'proud', label: 'Proud', emoji: '🏆' },
]

export const sportOf = id => SPORT_TYPES.find(s => s.id === id) || null

export const WEEKDAYS = [
  { id: 'mon', label: 'Mon', long: 'Monday' },
  { id: 'tue', label: 'Tue', long: 'Tuesday' },
  { id: 'wed', label: 'Wed', long: 'Wednesday' },
  { id: 'thu', label: 'Thu', long: 'Thursday' },
  { id: 'fri', label: 'Fri', long: 'Friday' },
  { id: 'sat', label: 'Sat', long: 'Saturday' },
  { id: 'sun', label: 'Sun', long: 'Sunday' },
]
