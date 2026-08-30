// Lifetime points = 20 × workout + 1 × active minute + 10 × streak day (activity).
// dots = strength rank score, see src/ranking.js (skill). Both precomputed here; server-side later.
export const POINTS_FORMULA = 'Lifetime: 20 pts / workout · 1 pt / active minute · 10 pts / streak day'

export const friendsBoard = [
  { id: 'u1', name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava', dots: 318, workouts: 156, points: 1240, streak: 24, delta: 1 },
  { id: 'u_marc', name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc', dots: 282, workouts: 142, points: 1105, streak: 18, delta: 2, me: true },
  { id: 'u2', name: 'Liam Turner', username: 'liam_lifts', avatar: 'https://i.pravatar.cc/150?u=liam', dots: 402, workouts: 168, points: 1080, streak: 9, delta: -2 },
  { id: 'u4', name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah', dots: 241, workouts: 121, points: 965, streak: 12, delta: 0 },
  { id: 'u5', name: 'Isabella Cruz', username: 'isabella_cycle', avatar: 'https://i.pravatar.cc/150?u=isabella', dots: 289, workouts: 98, points: 890, streak: 15, delta: 1 },
  { id: 'u6', name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas', dots: 465, workouts: 205, points: 720, streak: 4, delta: -1 },
  { id: 'u3', name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya', dots: 196, workouts: 88, points: 660, streak: 21, delta: 0 },
  { id: 'u7', name: 'Charlotte Young', username: 'charlotte_y', avatar: 'https://i.pravatar.cc/150?u=charlotte', dots: 173, workouts: 64, points: 540, streak: 7, delta: 3 },
  { id: 'u8', name: 'Benjamin Hall', username: 'benji_balance', avatar: 'https://i.pravatar.cc/150?u=benjamin', dots: 128, workouts: 51, points: 410, streak: 3, delta: -1 },
]

export const globalBoard = {
  totalAthletes: 48213,
  top: [
    { id: 'g1', name: 'Kenji Watanabe', username: 'kenji_ultra', avatar: 'https://i.pravatar.cc/150?u=kenji', dots: 612, workouts: 412, points: 2840, streak: 88, delta: 0 },
    { id: 'g2', name: 'Sofia Almeida', username: 'sofia_tri', avatar: 'https://i.pravatar.cc/150?u=sofia', dots: 588, workouts: 388, points: 2790, streak: 64, delta: 1 },
    { id: 'g3', name: 'Derek Ncube', username: 'derek_lifts', avatar: 'https://i.pravatar.cc/150?u=derek', dots: 641, workouts: 356, points: 2710, streak: 41, delta: -1 },
    { id: 'g4', name: 'Anna Kowalska', username: 'anna_climbs', avatar: 'https://i.pravatar.cc/150?u=anna', dots: 533, workouts: 340, points: 2580, streak: 52, delta: 2 },
    { id: 'g5', name: 'Mateo Rossi', username: 'mateo_road', avatar: 'https://i.pravatar.cc/150?u=mateo', dots: 497, workouts: 315, points: 2465, streak: 30, delta: 0 },
    { id: 'g6', name: 'Priya Sharma', username: 'priya_runs', avatar: 'https://i.pravatar.cc/150?u=priya', dots: 458, workouts: 298, points: 2390, streak: 45, delta: -2 },
    { id: 'g7', name: 'Tom Becker', username: 'tom_ironman', avatar: 'https://i.pravatar.cc/150?u=tom', dots: 512, workouts: 287, points: 2310, streak: 19, delta: 1 },
    { id: 'g8', name: 'Lena Fischer', username: 'lena_moves', avatar: 'https://i.pravatar.cc/150?u=lena', dots: 471, workouts: 265, points: 2255, streak: 27, delta: 4 },
    { id: 'g9', name: 'Omar Haddad', username: 'omar_swim', avatar: 'https://i.pravatar.cc/150?u=omar', dots: 486, workouts: 244, points: 2180, streak: 33, delta: -1 },
    { id: 'g10', name: 'Grace Liu', username: 'grace_flow', avatar: 'https://i.pravatar.cc/150?u=grace', dots: 444, workouts: 230, points: 2095, streak: 58, delta: 0 },
  ],
  me: { rank: 1483, id: 'u_marc', name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc', dots: 282, workouts: 142, points: 1105, streak: 18, delta: 127, me: true },
}

// Diamond+ lifts wait on community review before they score. `followed` = the current user follows them,
// so it surfaces in the Home feed too; everything else only lives in the Explore review queue.
export const reviewQueue = [
  {
    id: 'rv1',
    athlete: { id: 'g3', name: 'Derek Ncube', username: 'derek_lifts', avatar: 'https://i.pravatar.cc/150?u=derek', dots: 641, bodyweightKg: 93, followed: true },
    exercise: 'Deadlift',
    weightKg: 300,
    reps: 1,
    pattern: 'legs',
    submittedAgo: '4h ago',
    videoSeconds: 22,
    votes: { valid: 47, invalid: 3, needed: 60 },
  },
  {
    id: 'rv2',
    athlete: { id: 'u6', name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas', dots: 465, bodyweightKg: 78, followed: true },
    exercise: 'Bench Press',
    weightKg: 165,
    reps: 2,
    pattern: 'push',
    submittedAgo: '11h ago',
    videoSeconds: 18,
    votes: { valid: 12, invalid: 9, needed: 60 },
  },
  {
    id: 'rv3',
    athlete: { id: 'g1', name: 'Kenji Watanabe', username: 'kenji_ultra', avatar: 'https://i.pravatar.cc/150?u=kenji', dots: 612, bodyweightKg: 71, followed: false },
    exercise: 'Weighted Pull Up',
    weightKg: 65,
    reps: 3,
    pattern: 'pull',
    submittedAgo: '1d ago',
    videoSeconds: 31,
    votes: { valid: 58, invalid: 1, needed: 60 },
  },
  {
    id: 'rv4',
    athlete: { id: 'g2', name: 'Sofia Almeida', username: 'sofia_tri', avatar: 'https://i.pravatar.cc/150?u=sofia', dots: 588, bodyweightKg: 62, followed: false },
    exercise: 'Squat',
    weightKg: 180,
    reps: 1,
    pattern: 'legs',
    submittedAgo: '1d ago',
    videoSeconds: 26,
    votes: { valid: 5, invalid: 0, needed: 60 },
  },
  {
    id: 'rv5',
    athlete: { id: 'g7', name: 'Tom Becker', username: 'tom_ironman', avatar: 'https://i.pravatar.cc/150?u=tom', dots: 512, bodyweightKg: 84, followed: false },
    exercise: 'Overhead Press',
    weightKg: 105,
    reps: 1,
    pattern: 'push',
    submittedAgo: '2d ago',
    videoSeconds: 15,
    votes: { valid: 31, invalid: 22, needed: 60 },
  },
]

// Lifetime contribution of the current user as a reviewer. Server-side later.
export const reviewerStats = {
  reviewed: 947,
  approved: 812,
  denied: 135,
  agreementRate: 0.94, // share of votes that matched the final community verdict
  rank: 168,           // position among all reviewers
  totalReviewers: 12480,
}
