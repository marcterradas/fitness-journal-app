import { ymd } from '@/mock/workouts'

// ponytail: mock lifts stay inside the 90-day scoring window as time passes
function setDay(n) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return ymd(d)
}

export const currentUser = {
  id: 'u_marc',
  name: 'Marc Terradas',
  username: 'marc_fitness',
  avatar: 'https://i.pravatar.cc/300?u=marc',
  bio: 'Calisthenics + climbing. Building habits, not streaks.',
  location: 'Barcelona',
  joinedAt: '2024-08-12',
  birthDate: '1994-03-22',
  sex: 'male',
  heightCm: 178,
  weightKg: 74.5,
  primarySport: 'strength',
  stats: {
    workouts: 142,
    followers: 384,
    following: 211,
    streakDays: 18,
    weeklyGoal: 5,
    weeklyDone: 4,
    minutesThisWeek: 312,
  },
  // ponytail: top set per exercise, the only thing the rank formula reads
  bestSets: [
    { exercise: 'Bench Press', weightKg: 100, reps: 5, date: setDay(1) },
    { exercise: 'Overhead Press', weightKg: 60, reps: 5, date: setDay(1) },
    { exercise: 'Pull Ups', weightKg: 20, reps: 5, date: setDay(3) },
    { exercise: 'Barbell Row', weightKg: 85, reps: 8, date: setDay(3) },
    { exercise: 'Squat', weightKg: 120, reps: 5, date: setDay(6) },
    { exercise: 'Deadlift', weightKg: 150, reps: 3, date: setDay(6) },
    { exercise: 'Dips', weightKg: 15, reps: 8, date: setDay(9) },
    { exercise: 'Romanian Deadlift', weightKg: 110, reps: 8, date: setDay(13) },
  ],
  goals: [
    { id: 'g1', label: 'Pull-ups @ bw +20kg × 5', progress: 0.6 },
    { id: 'g2', label: 'Run 5k under 22:00', progress: 0.45 },
    { id: 'g3', label: '4 sessions / week', progress: 0.8 },
  ],
};

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

export function ageFrom(birthDate) {
  if (!birthDate) return null
  const b = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const before = now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  return before ? age - 1 : age
}

// dots = precomputed rank score; server-side later
export const friends = [
  { id: 'u1', name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava', sport: 'Running', dots: 318 },
  { id: 'u2', name: 'Liam Turner', username: 'liam_lifts', avatar: 'https://i.pravatar.cc/150?u=liam', sport: 'Strength', dots: 402 },
  { id: 'u3', name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya', sport: 'Yoga', dots: 196 },
  { id: 'u4', name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah', sport: 'Cycling', dots: 241 },
  { id: 'u5', name: 'Isabella Cruz', username: 'isabella_cycle', avatar: 'https://i.pravatar.cc/150?u=isabella', sport: 'Cycling', dots: 289 },
  { id: 'u6', name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas', sport: 'Strength', dots: 465 },
  { id: 'u7', name: 'Charlotte Young', username: 'charlotte_y', avatar: 'https://i.pravatar.cc/150?u=charlotte', sport: 'Swimming', dots: 173 },
  { id: 'u8', name: 'Benjamin Hall', username: 'benji_balance', avatar: 'https://i.pravatar.cc/150?u=benjamin', sport: 'Yoga', dots: 128 },
];
