export const RANKS = [
  { id: 'bronze',   label: 'Bronze',   icon: '🥉', min: 0,   color: '#cd7f32' },
  { id: 'silver',   label: 'Silver',   icon: '🥈', min: 25,  color: '#c0c0c0' },
  { id: 'gold',     label: 'Gold',     icon: '🥇', min: 50,  color: '#ffd700' },
  { id: 'platinum', label: 'Platinum', icon: '🔷', min: 100, color: '#00bcd4' },
  { id: 'emerald',  label: 'Emerald',  icon: '💚', min: 150, color: '#50c878' },
  { id: 'diamond',  label: 'Diamond',  icon: '💎', min: 200, color: '#b9f2ff' },
  { id: 'god',      label: 'God Tier', icon: '⚡', min: 300, color: '#ff6b35' },
]

export function getUserRank(workouts) {
  const sorted = [...RANKS].reverse()
  return sorted.find(r => workouts >= r.min) || RANKS[0]
}

export const currentUser = {
  id: 'u_marc',
  name: 'Marc Terradas',
  username: 'marc_fitness',
  avatar: 'https://i.pravatar.cc/300?u=marc',
  bio: 'Calisthenics + climbing. Building habits, not streaks.',
  location: 'Barcelona',
  joinedAt: '2024-08-12',
  stats: {
    workouts: 142,
    followers: 384,
    following: 211,
    streakDays: 18,
    weeklyGoal: 5,
    weeklyDone: 4,
    minutesThisWeek: 312,
  },
  goals: [
    { id: 'g1', label: 'Pull-ups @ bw +20kg × 5', progress: 0.6 },
    { id: 'g2', label: 'Run 5k under 22:00', progress: 0.45 },
    { id: 'g3', label: '4 sessions / week', progress: 0.8 },
  ],
};

export const friends = [
  { id: 'u1', name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava', sport: 'Running' },
  { id: 'u2', name: 'Liam Turner', username: 'liam_lifts', avatar: 'https://i.pravatar.cc/150?u=liam', sport: 'Strength' },
  { id: 'u3', name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya', sport: 'Yoga' },
  { id: 'u4', name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah', sport: 'Cycling' },
  { id: 'u5', name: 'Isabella Cruz', username: 'isabella_cycle', avatar: 'https://i.pravatar.cc/150?u=isabella', sport: 'Cycling' },
  { id: 'u6', name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas', sport: 'Strength' },
  { id: 'u7', name: 'Charlotte Young', username: 'charlotte_y', avatar: 'https://i.pravatar.cc/150?u=charlotte', sport: 'Swimming' },
  { id: 'u8', name: 'Benjamin Hall', username: 'benji_balance', avatar: 'https://i.pravatar.cc/150?u=benjamin', sport: 'Yoga' },
];
