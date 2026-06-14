export const feedPosts = [
  {
    id: 'p1',
    type: 'workout',
    user: { name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava' },
    when: '20 min ago',
    sport: 'running',
    title: 'Sunrise 10k — under 50min!',
    text: 'First time breaking 50 minutes. Slow build pays off. 🌅',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800' },
    ],
    stats: { distanceKm: 10.0, durationMin: 49, paceMinKm: '4:54' },
    badge: { label: 'Personal record', icon: '🏆' },
    kudos: 24,
    comments: [
      { user: 'Liam Turner', avatar: 'https://i.pravatar.cc/150?u=liam', text: 'Huge! That pace is dialed in.' },
      { user: 'Maya Lee', avatar: 'https://i.pravatar.cc/150?u=maya', text: 'Inspiring 🌱' },
      { user: 'Noah Reed', avatar: 'https://i.pravatar.cc/150?u=noah', text: 'Next goal: sub 48! 🔥' },
    ],
    kudoed: false,
  },
  {
    id: 'p2',
    type: 'post',
    user: { name: 'Coach Mike', username: 'coach_mike', avatar: 'https://i.pravatar.cc/150?u=mike' },
    when: '2h ago',
    title: 'Tip of the day',
    text: "Don't chase fatigue, chase quality reps. 3 great sets > 5 sloppy ones. Your joints will thank you in 10 years.",
    kudos: 87,
    comments: [
      { user: 'Sarah Fit', avatar: 'https://i.pravatar.cc/150?u=sarah', text: 'Saving this 💚' },
    ],
    kudoed: true,
  },
  {
    id: 'p3',
    type: 'workout',
    user: { name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya' },
    when: 'Yesterday',
    sport: 'yoga',
    title: '30 days mobility — done',
    text: 'Started barely touching my toes. Today: full pancake. Slow wins.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800' },
    ],
    badge: { label: 'Challenge complete', icon: '🎯' },
    kudos: 41,
    comments: [],
    kudoed: false,
  },
  {
    id: 'p4',
    type: 'workout',
    user: { name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah' },
    when: 'Yesterday',
    sport: 'cycling',
    title: 'Group ride — 60k coastal',
    text: 'Easy spin with the crew. No watts goals, just vibes.',
    media: [
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumb: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800' },
    ],
    stats: { distanceKm: 60.4, durationMin: 142, calories: 1340 },
    kudos: 18,
    comments: [],
    kudoed: false,
  },
  {
    id: 'p5',
    type: 'workout',
    user: { name: 'Liam Turner', username: 'liam_lifts', avatar: 'https://i.pravatar.cc/150?u=liam' },
    when: '3h ago',
    sport: 'strength',
    title: 'Push day — bench back over 100kg',
    text: 'First heavy push session after deload week. Everything moved well, no grind.',
    stats: { durationMin: 64, calories: 390 },
    exercises: [
      { name: 'Bench Press', sets: 5, reps: 3, weightKg: 102.5, pr: true },
      { name: 'Incline DB Press', sets: 4, reps: 10, weightKg: 36 },
      { name: 'Cable Fly', sets: 3, reps: 15, weightKg: 12 },
      { name: 'Overhead Press', sets: 4, reps: 6, weightKg: 62.5 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, weightKg: 22 },
    ],
    kudos: 9,
    comments: [
      { user: 'Ava Smith', avatar: 'https://i.pravatar.cc/150?u=ava', text: 'Triple plates incoming 🔥' },
    ],
    kudoed: false,
  },
];

export const challenges = [
  { id: 'c1', title: 'April Mobility', members: 1280, daysLeft: 4, progress: 0.7, emoji: '🧘' },
  { id: 'c2', title: '100 Pull-ups / week', members: 542, daysLeft: 11, progress: 0.4, emoji: '💪' },
  { id: 'c3', title: 'Run streak — 30 days', members: 2104, daysLeft: 22, progress: 0.25, emoji: '🏃' },
];

export const stories = [
  { id: 's1', title: 'PRs', cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300', emoji: '🏆' },
  { id: 's2', title: 'Climbs', cover: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=300', emoji: '🧗' },
  { id: 's3', title: 'Routes', cover: 'https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=300', emoji: '🏃' },
  { id: 's4', title: 'Recovery', cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300', emoji: '🧘' },
  { id: 's5', title: 'Travel', cover: 'https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=300', emoji: '✈️' },
];

export const achievements = [
  { id: 'a1', title: '7-day streak', earned: true, icon: '🔥', date: 'Apr 23' },
  { id: 'a2', title: '100kg bench', earned: true, icon: '🏋️', date: 'Apr 30' },
  { id: 'a3', title: 'Sub-50 10k', earned: true, icon: '🏃', date: 'May 1' },
  { id: 'a4', title: '50 workouts', earned: true, icon: '✅', date: 'Mar 14' },
  { id: 'a5', title: '30-day streak', earned: false, icon: '🌟', date: null },
  { id: 'a6', title: 'Marathon', earned: false, icon: '🥇', date: null },
];

export const userPosts = [
  {
    id: 'up1',
    type: 'workout',
    user: { name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc' },
    when: '2h ago',
    sport: 'strength',
    title: 'Pull day — new PR on weighted pull-ups',
    text: 'Hit +22.5kg × 5. Three months of patient progression. The plan works.',
    stats: { durationMin: 58, calories: 420 },
    badge: { label: 'Personal record', icon: '🏆' },
    exercises: [
      { name: 'Weighted Pull-ups', sets: 4, reps: 5, weightKg: 22.5, pr: true },
      { name: 'Barbell Row', sets: 4, reps: 8, weightKg: 80 },
      { name: 'Lat Pulldown', sets: 3, reps: 10, weightKg: 65 },
      { name: 'Face Pulls', sets: 3, reps: 15, weightKg: 20 },
      { name: 'Bicep Curls', sets: 3, reps: 12, weightKg: 14 },
    ],
    kudos: 31,
    comments: [
      { user: 'Ava Smith', avatar: 'https://i.pravatar.cc/150?u=ava', text: 'Absolute unit 💪' },
    ],
    kudoed: false,
  },
  {
    id: 'up2',
    type: 'workout',
    user: { name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc' },
    when: 'Yesterday',
    sport: 'running',
    title: 'Easy 5k recovery run',
    text: 'Legs needed it. Kept it slow, heart rate under 145. Feels good to move without a plan sometimes.',
    stats: { distanceKm: 5.1, durationMin: 28, paceMinKm: '5:29' },
    kudos: 12,
    comments: [],
    kudoed: false,
  },
  {
    id: 'up3',
    type: 'workout',
    user: { name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc' },
    when: '3 days ago',
    sport: 'strength',
    title: 'Leg day — squats back after 2 weeks off',
    text: 'Lower back is finally OK. Started conservative at 80% of max. Felt great to squat heavy again.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' },
    ],
    stats: { durationMin: 65 },
    kudos: 19,
    comments: [
      { user: 'Liam Turner', avatar: 'https://i.pravatar.cc/150?u=liam', text: 'Smart to ease back in' },
    ],
    kudoed: false,
  },
]

export const motivationalQuotes = [
  'Show up, even when small. Especially when small.',
  'You don’t need more discipline. You need a smaller first step.',
  'Recovery is part of the workout, not a break from it.',
  'Compare today to yesterday-you, not anyone else.',
  'Progress is quiet. Trust the boring work.',
];
