export const feedPosts = [
  {
    id: 'p1',
    user: { name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava' },
    when: '20 min ago',
    sport: 'running',
    title: 'Sunrise 10k — under 50min!',
    text: 'First time breaking 50 minutes. Slow build pays off. 🌅',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    stats: { distanceKm: 10.0, durationMin: 49, paceMinKm: '4:54' },
    badge: { label: 'Personal record', icon: '🏆' },
    kudos: 24,
    comments: [
      { user: 'Liam Turner', avatar: 'https://i.pravatar.cc/150?u=liam', text: 'Huge! That pace is dialed in.' },
      { user: 'Maya Lee', avatar: 'https://i.pravatar.cc/150?u=maya', text: 'Inspiring 🌱' },
    ],
    kudoed: false,
  },
  {
    id: 'p2',
    user: { name: 'Coach Mike', username: 'coach_mike', avatar: 'https://i.pravatar.cc/150?u=mike' },
    when: '2h ago',
    sport: 'strength',
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
    user: { name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya' },
    when: 'Yesterday',
    sport: 'yoga',
    title: '30 days mobility — done',
    text: 'Started barely touching my toes. Today: full pancake. Slow wins.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    badge: { label: 'Challenge complete', icon: '🎯' },
    kudos: 41,
    comments: [],
    kudoed: false,
  },
  {
    id: 'p4',
    user: { name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah' },
    when: 'Yesterday',
    sport: 'cycling',
    title: 'Group ride — 60k coastal',
    text: 'Easy spin with the crew. No watts goals, just vibes.',
    stats: { distanceKm: 60.4, durationMin: 142 },
    kudos: 18,
    comments: [],
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

export const motivationalQuotes = [
  'Show up, even when small. Especially when small.',
  'You don’t need more discipline. You need a smaller first step.',
  'Recovery is part of the workout, not a break from it.',
  'Compare today to yesterday-you, not anyone else.',
  'Progress is quiet. Trust the boring work.',
];
