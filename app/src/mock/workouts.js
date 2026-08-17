export const SPORT_TYPES = [
  { id: 'strength', label: 'Strength', emoji: '🏋️', color: 'var(--sport-strength)' },
  { id: 'running', label: 'Running', emoji: '🏃', color: 'var(--sport-running)' },
  { id: 'cycling', label: 'Cycling', emoji: '🚴', color: 'var(--sport-cycling)' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘', color: 'var(--sport-yoga)' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊', color: 'var(--sport-swimming)' },
  { id: 'cardio', label: 'Cardio', emoji: '🔥', color: 'var(--sport-cardio)' },
];

export const MOODS = [
  { id: 'energized', label: 'Energized', emoji: '⚡' },
  { id: 'focused', label: 'Focused', emoji: '🎯' },
  { id: 'tired', label: 'Tired', emoji: '😮‍💨' },
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'sore', label: 'Sore', emoji: '🥵' },
  { id: 'proud', label: 'Proud', emoji: '🏆' },
];

export const todayWorkout = {
  id: 'w_today',
  title: 'Upper Body — Pull Focus',
  sport: 'strength',
  scheduledFor: 'today',
  durationMin: 55,
  exerciseCount: 6,
  exercises: [
    { name: 'Pull ups', sets: 4, reps: '8-10' },
    { name: 'Barbell row', sets: 4, reps: '8' },
    { name: 'Lat pulldown', sets: 3, reps: '10-12' },
    { name: 'Face pulls', sets: 3, reps: '15' },
    { name: 'Bicep curl', sets: 3, reps: '12' },
    { name: 'Hanging leg raise', sets: 3, reps: '10' },
  ],
};

export function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ponytail: mock dates are relative to today so the calendar/week strip never go stale
const startOfToday = new Date()
startOfToday.setHours(0, 0, 0, 0)
function daysAgo(n) {
  const d = new Date(startOfToday)
  d.setDate(d.getDate() - n)
  return ymd(d)
}

export const journalEntries = [
  {
    id: 'j1',
    date: daysAgo(1),
    sport: 'strength',
    title: 'Push day — felt strong',
    durationMin: 62,
    volumeKg: 4820,
    mood: 'proud',
    notes: 'Hit 100kg bench × 5. First time clean. Triceps cooked after.',
    rpe: 8,
  },
  {
    id: 'j2',
    date: daysAgo(2),
    sport: 'running',
    title: 'Easy 6k zone 2',
    durationMin: 34,
    distanceKm: 6.1,
    mood: 'energized',
    notes: 'Morning run. Cool air. Pace 5:32/km, felt sustainable.',
    rpe: 4,
  },
  {
    id: 'j3',
    date: daysAgo(3),
    sport: 'yoga',
    title: 'Mobility + recovery flow',
    durationMin: 30,
    mood: 'focused',
    notes: 'Hip openers and t-spine. Needed it after squat day.',
    rpe: 2,
  },
  {
    id: 'j4',
    date: daysAgo(4),
    sport: 'strength',
    title: 'Leg day — heavy squats',
    durationMin: 70,
    volumeKg: 6240,
    mood: 'sore',
    notes: 'Squats 5×5 @ 120kg. RDLs felt heavy. Probably under-fueled.',
    rpe: 9,
  },
  {
    id: 'j5',
    date: daysAgo(5),
    sport: 'cycling',
    title: 'Coastal 32k spin',
    durationMin: 78,
    distanceKm: 32,
    mood: 'happy',
    notes: 'Rode with Liam along the coast. Stopped for coffee. Easy effort.',
    rpe: 5,
  },
  { id: 'j6',  date: daysAgo(7), sport: 'strength', title: 'Push — pressing focus', durationMin: 55, volumeKg: 4100, mood: 'focused', notes: 'OHP felt heavy. Bench 90×8 clean.', rpe: 7 },
  { id: 'j7',  date: daysAgo(8), sport: 'running',  title: 'Intervals 6×400m',     durationMin: 38, distanceKm: 5.4, mood: 'energized', notes: 'Track session. Sub-90s splits.', rpe: 8 },
  { id: 'j8',  date: daysAgo(9), sport: 'yoga',     title: 'Recovery flow',         durationMin: 25, mood: 'focused',  notes: 'Easy hips + breathwork.', rpe: 2 },
  { id: 'j9',  date: daysAgo(11), sport: 'strength', title: 'Pull — heavy rows',     durationMin: 60, volumeKg: 4500, mood: 'proud',    notes: 'Pull-ups feel light now.', rpe: 7 },
  { id: 'j10', date: daysAgo(13), sport: 'cycling',  title: 'Hill repeats',           durationMin: 65, distanceKm: 22, mood: 'tired',    notes: '5×3min hills. Legs cooked.', rpe: 9 },
  { id: 'j11', date: daysAgo(14), sport: 'swimming', title: '1500m continuous',       durationMin: 35, distanceKm: 1.5, mood: 'happy',    notes: 'Felt smooth. Stroke count down.', rpe: 6 },
  { id: 'j12', date: daysAgo(16), sport: 'strength', title: 'Legs — squat day',       durationMin: 70, volumeKg: 6000, mood: 'sore',     notes: 'Squat 5×5 @115. RDLs after.', rpe: 8 },
  { id: 'j13', date: daysAgo(18), sport: 'running',  title: 'Long run 12k',           durationMin: 64, distanceKm: 12.1, mood: 'happy',  notes: 'Easy pace. Coastal route.', rpe: 5 },
  { id: 'j14', date: daysAgo(20), sport: 'yoga',     title: 'Vinyasa 45',             durationMin: 45, mood: 'focused',  notes: 'Studio class. Felt centered.', rpe: 3 },
  { id: 'j15', date: daysAgo(21), sport: 'strength', title: 'Upper — pull',           durationMin: 58, volumeKg: 3800, mood: 'energized', notes: 'New PR weighted pull-ups.', rpe: 7 },
  { id: 'j16', date: daysAgo(23), sport: 'cardio',   title: 'HIIT 20',                durationMin: 22, mood: 'tired',   notes: 'Bike intervals. Brutal.', rpe: 9 },
  { id: 'j17', date: daysAgo(25), sport: 'running',  title: 'Easy 5k',                durationMin: 28, distanceKm: 5.0, mood: 'happy',  notes: 'Morning shake-out.', rpe: 4 },
  { id: 'j18', date: daysAgo(27), sport: 'strength', title: 'Push — dumbbells',       durationMin: 50, volumeKg: 3200, mood: 'focused', notes: 'Garage session. Solid.', rpe: 6 },
  { id: 'j19', date: daysAgo(29), sport: 'cycling',  title: 'Group ride 45k',         durationMin: 95, distanceKm: 45, mood: 'happy',   notes: 'Z2 with the crew.', rpe: 5 },
  { id: 'j20', date: daysAgo(30), sport: 'yoga',     title: 'Mobility 20',            durationMin: 20, mood: 'focused', notes: 'T-spine + ankles.', rpe: 2 },
];

// ponytail: top set per session, one series per exercise — enough to draw a trend line
const progressPoints = (start, step, weeks = 8) =>
  Array.from({ length: weeks }, (_, i) => ({
    date: daysAgo((weeks - 1 - i) * 7),
    // deload dip every 3rd week so the line is not a perfect ramp
    value: Math.round((start + step * i - (i % 3 === 1 ? step * 0.8 : 0)) * 10) / 10,
  }))

export const exerciseProgress = [
  { id: 'bench', name: 'Bench Press', unit: 'kg', points: progressPoints(82.5, 2.5) },
  { id: 'squat', name: 'Squat', unit: 'kg', points: progressPoints(100, 3.75) },
  { id: 'deadlift', name: 'Deadlift', unit: 'kg', points: progressPoints(130, 3.1) },
  { id: 'ohp', name: 'Overhead Press', unit: 'kg', points: progressPoints(50, 1.25) },
  { id: 'pullups', name: 'Pull Ups', unit: 'reps', points: progressPoints(8, 0.75) },
];

export const recentActivity = [
  { id: 'a1', when: '2h ago', text: 'Completed Upper Body — Pull Focus', icon: '✅' },
  { id: 'a2', when: 'Yesterday', text: 'New PR — Bench Press 100kg × 5', icon: '🏆' },
  { id: 'a3', when: '2d ago', text: '7-day streak unlocked', icon: '🔥' },
  { id: 'a4', when: '3d ago', text: 'Joined challenge: April Mobility', icon: '🎯' },
];

export const weeklyProgress = [
  { day: 'Mon', done: true, sport: 'strength' },
  { day: 'Tue', done: true, sport: 'running' },
  { day: 'Wed', done: true, sport: 'yoga' },
  { day: 'Thu', done: true, sport: 'strength' },
  { day: 'Fri', done: false, sport: null },
  { day: 'Sat', done: false, sport: null },
  { day: 'Sun', done: false, sport: null },
];

export const heatmap12w = Array.from({ length: 84 }, (_, i) => ({
  day: i,
  intensity: Math.max(0, Math.min(4, Math.round(Math.sin(i / 3) * 2 + (i % 7 === 0 ? 0 : 2)))),
}));
