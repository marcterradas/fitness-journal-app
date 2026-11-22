# Fitness Journal — project context

Prototype of a social network built around a fitness journal: users log workouts, share them as posts/stories, follow each other, and climb a strength ranking.

## Status
- Restarted (Nov 2026) on React Native. All views of the old Vue 3 web prototype (git `7120d70`) are ported 1:1 visually, on mock data. Old source: `git show 7120d70:app/src/views/<View>.vue`.
- No backend yet; `api/` workspace is empty. Use mock data first.
- Owner is a Vue developer learning React — prefer plain, readable React (function components + hooks), explain React-specific idioms when non-obvious.

## Stack
- npm workspaces: `app` (frontend), `api` (backend, not started).
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
  - `components/ui.js` primitives (Screen, AppHeader, Tabs, Toast, Avatar, Button, Card, Chip, Badge, Input, EmptyState, Stat, SectionTitle, UserLink, Icon, `s`). Feature sections in `components/<feature>/`.
  - `hooks/` — `useLoad` (runs loader on focus, `reload()`), `useToast`, `useTimer`. `theme.js` tokens (+ `sportColor`; colors are UI, never in domain/data).

**Migration status:** Journal is the reference (`ui/routes/(tabs)/journal.js`, `ui/components/journal/`, `domain/journal.js`). All mock adapters exist. Other screens still import `api/mock/data/*` directly — migrate them to `api.*` + domain.
Exercise images in `app/assets/exercises/` (via `require`).

## Run
- From root: `npm run web` | `npm run ios` | `npm run android` (ios needs Xcode + simulator, android needs Android Studio + emulator, or scan the QR with Expo Go).
- Sanity check: `cd app && npx expo-doctor`.

## Conventions
- Laziest working solution; mark simplifications with `ponytail:` comments.
- Tests planned (not yet): unit tests on `domain/` and `usecases/` (fake ports), no UI tests needed for logic.
