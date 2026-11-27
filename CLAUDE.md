# Fitness Journal — project context

Prototype of a social network built around a fitness journal: users log workouts, share them as posts/stories, follow each other, and climb a strength ranking.

## Status (Nov 2026)
- Owner is a Vue developer learning React — prefer plain, readable React (function components + hooks), explain React-specific idioms when non-obvious.
- **Frontend prototype done on mock data.** All views of the old Vue 3 web prototype (git `7120d70`) ported to React Native (Expo), running on web + iOS (+ Android untested). Old source: `git show 7120d70:app/src/views/<View>.vue`.
- **Architecture:** hexagonal (see below). Journal fully migrated (screen → `api` + `domain`). Mock API adapter covers every resource. Other 15 screens/components still import fixtures directly → migrate when wiring the real API.
- **Deploy:** Vercel project `fitness-journal-app`, Root Directory `app`, Node 22. `app/vercel.json` builds with `npm run build:web` (`expo export --platform web` → `dist`, SPA rewrite). Pending: commit/push `vercel.json` + set Framework Preset Vite → Other (old preset ran `vite build` → failed).
- No backend yet; root `api/` workspace is empty. No tests yet.

## Next task: real API
1. **Choose the backend service.** Leading candidate: **Supabase** (Postgres + Auth + Storage + Realtime, `@supabase/supabase-js` works in Expo/web). Compare briefly against alternatives (e.g. Firebase, PocketBase, own Node API) on: relational fit for social data (follows, likes, comments, leaderboards), auth (email + Google/Apple), media storage (workout videos/images), realtime (messages, notifications), row-level security, free tier, lock-in, offline.
2. Model the schema from the contract in `app/src/api/index.js` + fixtures in `api/mock/data/` (users, follows, journal entries, saved workouts, weekly plans, posts/stories, reviews/votes, notifications, conversations/messages).
3. Write `app/src/api/http/` (or `api/supabase/`) implementing the same contract; switch in `api/index.js`. Keep mock adapter for offline dev.
4. Migrate remaining screens from fixture imports to `api.*` + `domain`.
5. Decide fate of root `api/` workspace (likely removed if Supabase covers it; server logic → Postgres functions / Edge Functions). Ranking/achievements stay in `domain/` (shared with any server code).

## Stack
- npm workspaces: `app` (frontend), `api` (backend placeholder, empty — may be dropped, see Next task).
- `app`: Expo SDK 58 + React Native 0.88 + React 19, plain JavaScript. One codebase for iOS, Android and web (`react-native-web`).
- **Minimal dependencies.** Justify every new one. Always add with `npx expo install <pkg>` (SDK-compatible versions).
- Styling: `StyleSheet` from react-native. No UI kit, no CSS-in-JS lib.
- Navigation: Expo Router. Extra deps: expo-router (+ safe-area-context, screens, linking, constants), @expo/vector-icons (Ionicons).
- No SVG lib: charts, rings, heatmaps are built from Views. Upgrade path: react-native-svg.
- Expo APIs change every SDK — read `app/AGENTS.md` and versioned docs before using any Expo API.

## Architecture: hexagonal (ports & adapters), `app/src`
Three folders. Dependencies: `ui → api` and `ui → domain`; `api/mock → domain`. Domain depends on nothing.

- `domain/` — pure business rules (journal, ranking, achievements, reviews, body, dates, catalog, authRules, storyNav). No React, no IO, no `@/` alias (relative `./x.js` imports) → runs in plain Node, unit-test without setup.
- `api/` — the port. `api/index.js` documents the contract (resources + methods) and picks the adapter: `export const api = mock`. All methods async, return plain JSON.
  - `api/mock/` — fake server adapter: `index.js` implements every resource on fixtures in `data/`; `server.js` adds latency + returns copies (screens can't mutate the "db"). `reviewsStore.js` = legacy sync store, delete when Home/Explore use `api.reviews`.
  - `api/http/` — next: same contract with `fetch()`. Switch in `api/index.js` only.
- `ui/` — the whole frontend, React only.
  - `routes/` — Expo Router screens (set via `app.json` plugin option `"root": "src/ui/routes"`). Kept thin: a module-level `loadX()` (API calls + domain derivations) → `useLoad(loadX)`, UI-only state (tabs, open sheets), actions = validate with domain → call `api` → `reload()`. No business logic, no fixture imports.
  - `components/` — atomic design, one component per file, all re-exported from `components/index.js` (routes: `import { Text, Card } from '@/ui/components'`; inside components use relative imports to avoid cycles).
    - `atoms/` Text (variants h1/h2/h3/body/small/muted/dim/label/overline/link), Row, Icon, IconButton, Avatar, Button, Card, Chip, Badge, Input, SportIcon.
    - `molecules/` Stat, SectionTitle, EmptyState, Tabs, Toast, UserLink, Dialog, ProgressRing, AchievementTile, JournalEntry.
    - `organisms/` feature blocks (Post, Leaderboard, StoryViewer, AppHeader, ...); feature sections in `organisms/<feature>/` (journal).
    - `templates/` Screen.
    - Rules: atoms/molecules take data via props only (no api/fixtures; navigation only as an `href`) → Storybook-ready. Screens compose atoms; no hand-rolled text styles (use `Text` variants). Styling stays `StyleSheet` (Tailwind/NativeWind deferred — swap inside atoms if ever).
  - `hooks/` — `useLoad` (runs loader on focus, `reload()`), `useToast`, `useTimer`. `theme.js` tokens (+ `sportColor`; colors are UI, never in domain/data).

**Migration status:** Journal is the reference (`ui/routes/(tabs)/journal.js`, `ui/components/organisms/journal/`, `domain/journal.js`). All mock adapters exist. Other screens still import `api/mock/data/*` directly — migrate them to `api.*` + domain.
Exercise images in `app/assets/exercises/` (via `require`).

## Run
- From root: `npm run web` | `npm run ios` | `npm run android` (ios needs Xcode + simulator, android needs Android Studio + emulator, or scan the QR with Expo Go).
- Sanity check: `cd app && npx expo-doctor`.

## Conventions
- Laziest working solution; mark simplifications with `ponytail:` comments.
- Tests planned (not yet): unit tests on `domain/` (pure) and `api/mock` contract; no UI tests needed for logic.
