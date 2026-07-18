// Monthly points = 20 × workout + 1 × active minute + 10 × streak day.
// Precomputed here; server-side later.
export const POINTS_FORMULA = '20 pts / workout · 1 pt / active minute · 10 pts / streak day'

export const friendsBoard = [
  { id: 'u1', name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava', workouts: 156, points: 1240, streak: 24, delta: 1 },
  { id: 'u_marc', name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc', workouts: 142, points: 1105, streak: 18, delta: 2, me: true },
  { id: 'u2', name: 'Liam Turner', username: 'liam_lifts', avatar: 'https://i.pravatar.cc/150?u=liam', workouts: 168, points: 1080, streak: 9, delta: -2 },
  { id: 'u4', name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah', workouts: 121, points: 965, streak: 12, delta: 0 },
  { id: 'u5', name: 'Isabella Cruz', username: 'isabella_cycle', avatar: 'https://i.pravatar.cc/150?u=isabella', workouts: 98, points: 890, streak: 15, delta: 1 },
  { id: 'u6', name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas', workouts: 205, points: 720, streak: 4, delta: -1 },
  { id: 'u3', name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya', workouts: 88, points: 660, streak: 21, delta: 0 },
  { id: 'u7', name: 'Charlotte Young', username: 'charlotte_y', avatar: 'https://i.pravatar.cc/150?u=charlotte', workouts: 64, points: 540, streak: 7, delta: 3 },
  { id: 'u8', name: 'Benjamin Hall', username: 'benji_balance', avatar: 'https://i.pravatar.cc/150?u=benjamin', workouts: 51, points: 410, streak: 3, delta: -1 },
]

export const globalBoard = {
  totalAthletes: 48213,
  top: [
    { id: 'g1', name: 'Kenji Watanabe', username: 'kenji_ultra', avatar: 'https://i.pravatar.cc/150?u=kenji', workouts: 412, points: 2840, streak: 88, delta: 0 },
    { id: 'g2', name: 'Sofia Almeida', username: 'sofia_tri', avatar: 'https://i.pravatar.cc/150?u=sofia', workouts: 388, points: 2790, streak: 64, delta: 1 },
    { id: 'g3', name: 'Derek Ncube', username: 'derek_lifts', avatar: 'https://i.pravatar.cc/150?u=derek', workouts: 356, points: 2710, streak: 41, delta: -1 },
    { id: 'g4', name: 'Anna Kowalska', username: 'anna_climbs', avatar: 'https://i.pravatar.cc/150?u=anna', workouts: 340, points: 2580, streak: 52, delta: 2 },
    { id: 'g5', name: 'Mateo Rossi', username: 'mateo_road', avatar: 'https://i.pravatar.cc/150?u=mateo', workouts: 315, points: 2465, streak: 30, delta: 0 },
    { id: 'g6', name: 'Priya Sharma', username: 'priya_runs', avatar: 'https://i.pravatar.cc/150?u=priya', workouts: 298, points: 2390, streak: 45, delta: -2 },
    { id: 'g7', name: 'Tom Becker', username: 'tom_ironman', avatar: 'https://i.pravatar.cc/150?u=tom', workouts: 287, points: 2310, streak: 19, delta: 1 },
    { id: 'g8', name: 'Lena Fischer', username: 'lena_moves', avatar: 'https://i.pravatar.cc/150?u=lena', workouts: 265, points: 2255, streak: 27, delta: 4 },
    { id: 'g9', name: 'Omar Haddad', username: 'omar_swim', avatar: 'https://i.pravatar.cc/150?u=omar', workouts: 244, points: 2180, streak: 33, delta: -1 },
    { id: 'g10', name: 'Grace Liu', username: 'grace_flow', avatar: 'https://i.pravatar.cc/150?u=grace', workouts: 230, points: 2095, streak: 58, delta: 0 },
  ],
  me: { rank: 1483, id: 'u_marc', name: 'Marc Terradas', username: 'marc_fitness', avatar: 'https://i.pravatar.cc/300?u=marc', workouts: 142, points: 1105, streak: 18, delta: 127, me: true },
}
