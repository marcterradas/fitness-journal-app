export const WEEKDAYS = [
  { id: 'mon', label: 'Mon', long: 'Monday' },
  { id: 'tue', label: 'Tue', long: 'Tuesday' },
  { id: 'wed', label: 'Wed', long: 'Wednesday' },
  { id: 'thu', label: 'Thu', long: 'Thursday' },
  { id: 'fri', label: 'Fri', long: 'Friday' },
  { id: 'sat', label: 'Sat', long: 'Saturday' },
  { id: 'sun', label: 'Sun', long: 'Sunday' },
]

export const weeklyTemplates = {
  mon: {
    id: 't_mon',
    title: 'Pull — back & biceps',
    sport: 'strength',
    durationMin: 60,
    exercises: [
      { id: 'e1', name: 'Pull Ups',         sets: 4, reps: '8-10' },
      { id: 'e2', name: 'Barbell Row',      sets: 4, reps: '8'    },
      { id: 'e3', name: 'Lat Pulldown',     sets: 3, reps: '10-12'},
      { id: 'e4', name: 'Face Pulls',       sets: 3, reps: '15'   },
      { id: 'e5', name: 'Bicep Curl',       sets: 3, reps: '12'   },
    ],
  },
  tue: {
    id: 't_tue',
    title: 'Run — easy zone 2',
    sport: 'running',
    durationMin: 35,
    exercises: [
      { id: 'r1', name: '10 min warm-up jog', sets: 1, reps: '—' },
      { id: 'r2', name: '20 min Z2 steady',   sets: 1, reps: '—' },
      { id: 'r3', name: '5 min cool-down',    sets: 1, reps: '—' },
    ],
  },
  wed: {
    id: 't_wed',
    title: 'Push — chest & triceps',
    sport: 'strength',
    durationMin: 65,
    exercises: [
      { id: 'p1', name: 'Bench Press',        sets: 4, reps: '6-8'   },
      { id: 'p2', name: 'Dips',               sets: 4, reps: '8-10'  },
      { id: 'p3', name: 'Overhead Press',     sets: 3, reps: '8'     },
      { id: 'p4', name: 'Incline Dumbbell',   sets: 3, reps: '10'    },
      { id: 'p5', name: 'Tricep Pushdown',    sets: 3, reps: '12'    },
    ],
  },
  thu: {
    id: 't_thu',
    title: 'Mobility & recovery',
    sport: 'yoga',
    durationMin: 25,
    exercises: [
      { id: 'm1', name: 'Hip openers',     sets: 1, reps: '5 min' },
      { id: 'm2', name: 'T-spine twists',  sets: 1, reps: '5 min' },
      { id: 'm3', name: 'Pigeon pose',     sets: 1, reps: '4 min' },
      { id: 'm4', name: 'Couch stretch',   sets: 1, reps: '4 min' },
      { id: 'm5', name: 'Cat / cow',       sets: 1, reps: '5 min' },
    ],
  },
  fri: {
    id: 't_fri',
    title: 'Legs — squat focus',
    sport: 'strength',
    durationMin: 70,
    exercises: [
      { id: 'l1', name: 'Back Squat',          sets: 5, reps: '5'   },
      { id: 'l2', name: 'Romanian Deadlift',   sets: 4, reps: '8'   },
      { id: 'l3', name: 'Walking Lunges',      sets: 3, reps: '12'  },
      { id: 'l4', name: 'Calf Raises',         sets: 4, reps: '15'  },
      { id: 'l5', name: 'Hanging Leg Raise',   sets: 3, reps: '10'  },
    ],
  },
  sat: {
    id: 't_sat',
    title: 'Long ride',
    sport: 'cycling',
    durationMin: 90,
    exercises: [
      { id: 'c1', name: 'Coastal route Z2', sets: 1, reps: '60-90 min' },
    ],
  },
  sun: null,
}
