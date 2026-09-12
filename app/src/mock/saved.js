import { reactive } from 'vue'

// Workouts kept for later: copied from another athlete's profile or saved from Explore.
// ponytail: module-level reactive array, same as the journal entries — survives navigation,
// gone on reload. Swap for the API when saving is real.
export const savedWorkouts = reactive([
  {
    id: 's1',
    title: 'Push — chest & triceps',
    sport: 'strength',
    durationMin: 65,
    savedAt: '2 days ago',
    from: { name: 'Lucas Kim', username: 'lucas_lifts' },
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '6-8' },
      { name: 'Dips', sets: 4, reps: '8-10' },
      { name: 'Overhead Press', sets: 3, reps: '8' },
      { name: 'Incline Dumbbell', sets: 3, reps: '10' },
      { name: 'Tricep Pushdown', sets: 3, reps: '12' },
    ],
  },
  {
    id: 's2',
    title: 'Sunrise 10k — negative split',
    sport: 'running',
    durationMin: 50,
    savedAt: 'Last week',
    from: { name: 'Ava Smith', username: 'ava_fit' },
    exercises: [
      { name: '10 min warm-up jog', sets: 1, reps: '—' },
      { name: '8 km building pace', sets: 1, reps: '—' },
      { name: '5 min cool-down', sets: 1, reps: '—' },
    ],
  },
  {
    id: 's3',
    title: 'Mobility flow — hips & t-spine',
    sport: 'yoga',
    durationMin: 25,
    savedAt: 'Last week',
    from: { name: 'Maya Lee', username: 'maya_moves' },
    exercises: [
      { name: 'Hip openers', sets: 1, reps: '5 min' },
      { name: 'T-spine twists', sets: 1, reps: '5 min' },
      { name: 'Pigeon pose', sets: 1, reps: '4 min' },
      { name: 'Couch stretch', sets: 1, reps: '4 min' },
    ],
  },
  {
    id: 's4',
    title: 'Legs — squat focus',
    sport: 'strength',
    durationMin: 70,
    savedAt: '3 weeks ago',
    from: { name: 'Liam Turner', username: 'liam_lifts' },
    exercises: [
      { name: 'Back Squat', sets: 5, reps: '5' },
      { name: 'Romanian Deadlift', sets: 4, reps: '8' },
      { name: 'Walking Lunges', sets: 3, reps: '12' },
      { name: 'Calf Raises', sets: 4, reps: '15' },
    ],
  },
])
