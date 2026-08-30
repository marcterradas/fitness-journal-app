<script setup>
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/Card.vue'
import Chip from '@/components/Chip.vue'
import Avatar from '@/components/Avatar.vue'
import EmptyState from '@/components/EmptyState.vue'
import SportIcon from '@/components/SportIcon.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import ReviewQueue from '@/components/ReviewQueue.vue'
import UserHoverCard from '@/components/UserHoverCard.vue'
import ExerciseModal from '@/components/ExerciseModal.vue'

import { friends } from '@/mock/user'
import { tierFromDots } from '@/ranking'
import { exercises, workoutPlans, EXERCISE_MEDIA_CREDIT } from '@/mock/exercises'
import { challenges, feedPosts } from '@/mock/social'
import { friendsBoard, globalBoard } from '@/mock/leaderboard'
import { pendingReviews } from '@/reviews'

const route = useRoute()
const query = ref('')
// ponytail: only the non-search tabs are deep-linkable; ?tab=anything-else falls back to 'all'
const PANELS = ['ranking', 'review']
const tab = ref(PANELS.includes(route.query.tab) ? route.query.tab : 'all')

const tabs = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'people', label: 'People', icon: '👥' },
  { id: 'workouts', label: 'Workouts', icon: '💪' },
  { id: 'exercises', label: 'Exercises', icon: '🏋️' },
  { id: 'challenges', label: 'Challenges', icon: '🎯' },
  { id: 'posts', label: 'Posts', icon: '📝' },
  { id: 'ranking', label: 'Ranking', icon: '🏆' },
  { id: 'review', label: 'Review', icon: '🎥' },
]

const trending = ['#PullUpProgress', '#April30Mobility', '#Sub50_10k', '#PostureFix', '#ZeroSugarApril']

// ponytail: one row shape for every kind, so the list markup is written once
const SOURCES = [
  {
    id: 'people', label: 'People', action: 'Follow', done: 'Following',
    items: () => friends.map(u => ({
      id: u.id, title: u.name, sub: `@${u.username} · ${u.sport}`, avatar: u.avatar,
      terms: [u.name, u.username, u.sport],
    })),
  },
  {
    id: 'workouts', label: 'Workouts', action: 'Try', done: 'Saved',
    items: () => workoutPlans.map(w => ({
      id: w.id, title: w.title, sub: `${w.durationMin} min · ${w.level}`, sport: w.sport,
      terms: [w.title, w.sport, w.level],
    })),
  },
  {
    id: 'exercises', label: 'Exercises', action: 'Add', done: 'Added',
    items: () => exercises.map(e => ({
      id: e.id, title: e.name, sub: `${e.muscle} · ${e.equipment}`, image: e.image, text: e.steps[0], open: e,
      terms: [e.name, e.muscle, e.equipment, e.bodyPart, ...e.secondary],
    })),
  },
  {
    id: 'challenges', label: 'Challenges', action: 'Join', done: 'Joined',
    items: () => challenges.map(c => ({
      id: c.id, title: c.title, sub: `${c.members.toLocaleString()} members · ${c.daysLeft} days left`, emoji: c.emoji,
      terms: [c.title],
    })),
  },
  {
    id: 'posts', label: 'Posts',
    items: () => feedPosts.map(p => ({
      id: p.id, title: p.title, sub: `${p.user.name} · ${p.when}`, avatar: p.user.avatar, text: p.text,
      terms: [p.title, p.text, p.user.name],
    })),
  },
]

const q = computed(() => query.value.trim().toLowerCase().replace(/^#/, ''))

const groups = computed(() =>
  SOURCES
    .filter(s => tab.value === 'all' || tab.value === s.id)
    .map(s => ({
      ...s,
      hits: s.items().filter(i => !q.value || i.terms.some(t => t.toLowerCase().includes(q.value))),
    }))
    .filter(g => g.hits.length)
)

const totalHits = computed(() => groups.value.reduce((a, g) => a + g.hits.length, 0))
const isDiscover = computed(() => tab.value === 'all' && !q.value)

// ponytail: plain Set of "kind:id" — no per-entity store until there's a backend
const saved = reactive(new Set())
const key = (g, i) => `${g.id}:${i.id}`
function toggle(g, i) {
  const k = key(g, i)
  saved.has(k) ? saved.delete(k) : saved.add(k)
}

const topThree = friendsBoard.slice(0, 3)
const MEDALS = ['🥇', '🥈', '🥉']

const DISCOVER = [
  { id: 'people', label: 'Athletes to follow', take: 3 },
  { id: 'workouts', label: 'Popular workouts', take: 3 },
  { id: 'challenges', label: 'Open challenges', take: 2 },
]

// discover = curated slices; otherwise = whatever matched
const sections = computed(() => {
  if (isDiscover.value) {
    return DISCOVER.map(d => {
      const g = SOURCES.find(s => s.id === d.id)
      return { group: g, label: d.label, hits: g.items().slice(0, d.take), more: true }
    })
  }
  return groups.value.map(g => ({
    group: g,
    label: `${g.label} · ${g.hits.length}`,
    hits: tab.value === 'all' ? g.hits.slice(0, 3) : g.hits,
    more: tab.value === 'all' && g.hits.length > 3,
    bare: tab.value !== 'all',
  }))
})

// Rows that carry an `open` payload get the detail popup; the rest stay plain.
const openExercise = ref(null)

function openTab(id) {
  tab.value = id
}

function onType() {
  if (PANELS.includes(tab.value)) tab.value = 'all'
}
</script>

<template>
  <div class="search">
    <header class="search__head">
      <h1 class="search__title">Explore</h1>
      <p class="search__sub">Athletes, workouts, challenges, the all-time ranking and the lift review queue.</p>
    </header>

    <div class="search__bar">
      <span class="search__icon">🔍</span>
      <input
        v-model="query"
        type="text"
        class="search__input"
        placeholder="Search people, workouts, exercises…"
        @input="onType"
      />
      <button v-if="query" class="search__clear" @click="query = ''" aria-label="Clear">×</button>
    </div>

    <div class="search__tabs hide-scrollbar">
      <Chip v-for="t in tabs" :key="t.id" :active="tab === t.id" @click="openTab(t.id)">
        {{ t.icon }} {{ t.label }}<span v-if="t.id === 'review' && pendingReviews.length" class="search__pill">{{ pendingReviews.length }}</span>
      </Chip>
    </div>

    <Leaderboard v-if="tab === 'ranking'" />

    <ReviewQueue v-else-if="tab === 'review'" />

    <template v-else-if="isDiscover || totalHits">
      <!-- Discover header blocks -->
      <template v-if="isDiscover">
        <section class="block">
          <h3 class="block__h">Trending</h3>
          <div class="block__chips">
            <Chip v-for="t in trending" :key="t" size="sm" @click="query = t">{{ t }}</Chip>
          </div>
        </section>

        <section v-if="pendingReviews.length" class="block">
          <div class="block__head">
            <h3 class="block__h">Waiting on the community</h3>
            <button class="block__more" @click="openTab('review')">Review queue →</button>
          </div>
          <Card padding="md" class="verify" @click="openTab('review')">
            <span class="verify__icon">🎥</span>
            <div class="verify__main">
              <span class="verify__title">{{ pendingReviews.length }} high-tier lift{{ pendingReviews.length === 1 ? '' : 's' }} need verifying</span>
              <span class="verify__sub">Vote on the videos — every review counts toward your reviewer badge.</span>
            </div>
            <div class="verify__faces">
              <Avatar v-for="s in pendingReviews.slice(0, 3)" :key="s.id" :src="s.athlete.avatar" :alt="s.athlete.name" size="sm" />
            </div>
          </Card>
        </section>

        <section class="block">
          <div class="block__head">
            <h3 class="block__h">Top this month</h3>
            <button class="block__more" @click="openTab('ranking')">Full ranking →</button>
          </div>
          <Card padding="none">
            <div v-for="(u, i) in topThree" :key="u.id" class="lead" :class="{ 'lead--me': u.me }">
              <span class="lead__medal">{{ MEDALS[i] }}</span>
              <UserHoverCard :user="u">
                <Avatar :src="u.avatar" :alt="u.name" size="sm" />
              </UserHoverCard>
              <UserHoverCard :user="u" class="lead__who">
                <span class="lead__name" tabindex="0">{{ u.me ? 'You' : u.name }}</span>
              </UserHoverCard>
              <span class="lead__tier" :title="`${tierFromDots(u.dots).label} ${tierFromDots(u.dots).division}`">{{ tierFromDots(u.dots).icon }}</span>
              <span class="lead__pts">{{ u.points.toLocaleString() }} pts</span>
            </div>
            <div class="lead lead--foot">
              You're <strong>#{{ globalBoard.me.rank.toLocaleString() }}</strong>
              of {{ globalBoard.totalAthletes.toLocaleString() }} athletes globally
            </div>
          </Card>
        </section>
      </template>

      <p v-else-if="q" class="search__count">
        {{ totalHits }} result{{ totalHits === 1 ? '' : 's' }} for “{{ query }}”
      </p>

      <!-- Result / discover lists -->
      <section v-for="s in sections" :key="s.group.id" class="block">
        <div v-if="!s.bare" class="block__head">
          <h3 class="block__h">{{ s.label }}</h3>
          <button v-if="s.more" class="block__more" @click="openTab(s.group.id)">See all →</button>
        </div>
        <p v-if="s.group.id === 'exercises'" class="block__credit">{{ EXERCISE_MEDIA_CREDIT }}</p>
        <div class="results">
          <Card
            v-for="i in s.hits"
            :key="i.id"
            padding="md"
            class="row"
            :class="{ 'row--clickable': i.open }"
            :tabindex="i.open ? 0 : undefined"
            :role="i.open ? 'button' : undefined"
            @click="i.open && (openExercise = i.open)"
            @keyup.enter="i.open && (openExercise = i.open)"
          >
            <img v-if="i.image" :src="i.image" :alt="i.title" class="row__thumb" loading="lazy" width="180" height="180" />
            <UserHoverCard v-else-if="i.avatar && s.group.id === 'people'" :user="i.id">
              <Avatar :src="i.avatar" :alt="i.title" size="md" />
            </UserHoverCard>
            <Avatar v-else-if="i.avatar" :src="i.avatar" :alt="i.title" size="md" />
            <SportIcon v-else-if="i.sport" :sport="i.sport" size="md" />
            <span v-else class="row__emoji">{{ i.emoji }}</span>
            <div class="row__main">
              <span class="row__title">{{ i.title }}</span>
              <span class="row__sub">{{ i.sub }}</span>
              <p v-if="i.text" class="row__text">{{ i.text }}</p>
            </div>
            <button
              v-if="s.group.action"
              class="row__btn"
              :class="{ 'row__btn--done': saved.has(key(s.group, i)) }"
              @click.stop="toggle(s.group, i)"
            >{{ saved.has(key(s.group, i)) ? s.group.done : s.group.action }}</button>
          </Card>
        </div>
      </section>
    </template>

    <EmptyState
      v-else
      icon="🔎"
      title="Nothing found"
      :description="query ? `No matches for &quot;${query}&quot;.` : 'Try a different filter.'"
    />

    <ExerciseModal :exercise="openExercise" @close="openExercise = null" />
  </div>
</template>

<style scoped>
.search { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }
.search__head { padding: 0 var(--space-1); }
.search__title { font-size: var(--fs-2xl); font-weight: var(--fw-bold); letter-spacing: -0.02em; }
.search__sub { color: var(--color-text-muted); margin-top: var(--space-1); font-size: var(--fs-sm); }

.search__bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 0 var(--space-3);
  transition: border-color var(--t-fast) var(--ease);
}
.search__bar:focus-within { border-color: var(--color-accent); box-shadow: var(--shadow-glow); }
.search__icon { font-size: var(--fs-md); color: var(--color-text-dim); }
.search__input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-3) 0;
  color: var(--color-text);
  font-size: var(--fs-md);
  outline: none;
}
.search__input::placeholder { color: var(--color-text-dim); }
.search__clear {
  background: var(--color-surface-2);
  border: none;
  color: var(--color-text-muted);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--fs-md);
  line-height: 1;
}
.search__tabs { display: flex; gap: var(--space-2); overflow-x: auto; }
.search__count { font-size: var(--fs-sm); color: var(--color-text-muted); }
.search__pill {
  margin-left: var(--space-1);
  padding: 0 0.35rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-size: 0.65rem;
  font-weight: var(--fw-bold);
}

/* Review teaser */
.verify { display: flex; align-items: center; gap: var(--space-3); cursor: pointer; }
.verify__icon { font-size: 1.5rem; }
.verify__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.verify__title { font-weight: var(--fw-semibold); font-size: var(--fs-sm); }
.verify__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.verify__faces { display: flex; }
.verify__faces > * + * { margin-left: -8px; }

/* Sections */
.block { display: flex; flex-direction: column; gap: var(--space-2); }
.block__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.block__h {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.block__more {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
}
.block__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.block__credit { font-size: 0.65rem; color: var(--color-text-dim); }

/* Dataset thumbnails are 180x180 — never upscale them past that */
.row__thumb {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-md);
  object-fit: cover;
  background: var(--color-surface-2);
  flex-shrink: 0;
}

/* Ranking preview */
.lead {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.lead--me { background: var(--color-accent-soft); }
.lead__medal { font-size: var(--fs-md); }
.lead__name { font-weight: var(--fw-medium); color: var(--color-text); }
.lead__who { flex: 1; min-width: 0; }
.lead__tier { font-size: var(--fs-sm); }
.lead__pts { font-size: var(--fs-xs); color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
.lead--foot {
  border-bottom: none;
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  justify-content: center;
}
.lead--foot strong { color: var(--color-text); }

.results { display: flex; flex-direction: column; gap: var(--space-2); }

.row { display: flex; align-items: center; gap: var(--space-3); }
.row--clickable { cursor: pointer; }
.row--clickable:hover { border-color: var(--color-border-strong); }
.row--clickable:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.row__emoji {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.row__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-1); }
.row__title { color: var(--color-text); font-weight: var(--fw-semibold); }
.row__sub { color: var(--color-text-dim); font-size: var(--fs-xs); }
.row__text {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-top: var(--space-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.row__btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--t-fast) var(--ease);
}
.row__btn:hover { background: var(--color-accent-hover); }
.row__btn--done {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  box-shadow: inset 0 0 0 1px var(--color-border);
}
.row__btn--done:hover { background: var(--color-surface-hover); }
</style>
