<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const router = useRouter()
const query = ref('')

// Ranking and the review queue are full panels, not search filters: they take over the view.
const PANELS = {
  ranking: { title: 'Ranking', sub: 'Every athlete, ordered by all-time points.' },
  review: { title: 'Review queue', sub: 'Vote on high-tier lifts waiting for the community.' },
}
const panel = ref(null)
watch(() => route.query.tab, t => { panel.value = t in PANELS ? t : null }, { immediate: true })
// Keep ?tab= in sync so a reload (or the browser back button) lands on the same panel.
const openPanel = id => router.push(id ? { query: { tab: id } } : { query: {} })

// ponytail: one row shape for every kind, so the list markup is written once
const SOURCES = [
  {
    id: 'people', label: 'People', icon: '👥', action: 'Follow', done: 'Following',
    items: () => friends.map(u => ({
      id: u.id, title: u.name, sub: `@${u.username} · ${u.sport}`, avatar: u.avatar, handle: u.username,
      terms: [u.name, u.username, u.sport],
    })),
  },
  {
    id: 'workouts', label: 'Workouts', icon: '💪', action: 'Try', done: 'Saved',
    items: () => workoutPlans.map(w => ({
      id: w.id, title: w.title, sub: `${w.durationMin} min · ${w.level}`, sport: w.sport,
      terms: [w.title, w.sport, w.level],
    })),
  },
  {
    id: 'exercises', label: 'Exercises', icon: '🏋️', action: 'Add', done: 'Added',
    items: () => exercises.map(e => ({
      id: e.id, title: e.name, sub: `${e.muscle} · ${e.equipment}`, image: e.image, text: e.steps[0], open: e,
      terms: [e.name, e.muscle, e.equipment, e.bodyPart, ...e.secondary],
    })),
  },
  {
    id: 'challenges', label: 'Challenges', icon: '🎯', action: 'Join', done: 'Joined',
    items: () => challenges.map(c => ({
      id: c.id, title: c.title, sub: `${c.members.toLocaleString()} members · ${c.daysLeft} days left`, emoji: c.emoji,
      terms: [c.title],
    })),
  },
  {
    id: 'posts', label: 'Posts', icon: '📝',
    items: () => feedPosts.map(p => ({
      id: p.id, title: p.title, sub: `${p.user.name} · ${p.when}`, avatar: p.user.avatar, text: p.text,
      terms: [p.title, p.text, p.user.name],
    })),
  },
]

const trending = ['#PullUpProgress', '#April30Mobility', '#Sub50_10k', '#PostureFix', '#ZeroSugarApril']

const q = computed(() => query.value.trim().toLowerCase().replace(/^#/, ''))

// No kind selected = every kind, grouped. That's what the old "All" tab did.
const kind = ref(null)

const matches = computed(() =>
  SOURCES.map(s => ({
    ...s,
    hits: s.items().filter(i => !q.value || i.terms.some(t => t.toLowerCase().includes(q.value))),
  }))
)

// Chips carry their own hit count while searching; empty kinds drop out, except the active one
// — it has to stay clickable or there's no way back out of a filter with no matches.
const chips = computed(() =>
  matches.value.filter(m => !q.value || m.hits.length || m.id === kind.value)
)

const groups = computed(() => matches.value.filter(g => g.hits.length && (!kind.value || kind.value === g.id)))
const totalHits = computed(() => groups.value.reduce((a, g) => a + g.hits.length, 0))
const isDiscover = computed(() => !q.value && !kind.value)

const DISCOVER = [
  { id: 'people', label: 'Athletes to follow', take: 4 },
  { id: 'workouts', label: 'Popular workouts', take: 4 },
  { id: 'exercises', label: 'Exercises to learn', take: 4 },
  { id: 'challenges', label: 'Open challenges', take: 2 },
]

const PREVIEW = 4

// Discover = curated slices; otherwise = whatever matched, capped until a kind is picked.
const sections = computed(() => {
  if (isDiscover.value) {
    return DISCOVER.map(d => {
      const g = matches.value.find(s => s.id === d.id)
      return { group: g, label: d.label, hits: g.hits.slice(0, d.take), more: g.hits.length > d.take }
    })
  }
  return groups.value.map(g => ({
    group: g,
    label: g.label,
    count: g.hits.length,
    hits: kind.value ? g.hits : g.hits.slice(0, PREVIEW),
    more: !kind.value && g.hits.length > PREVIEW,
  }))
})

// ponytail: plain Set of "kind:id" — no per-entity store until there's a backend
const saved = reactive(new Set())
const key = (g, i) => `${g.id}:${i.id}`
function toggle(g, i) {
  const k = key(g, i)
  saved.has(k) ? saved.delete(k) : saved.add(k)
}

const topThree = friendsBoard.slice(0, 3)
const MEDALS = ['🥇', '🥈', '🥉']

// Rows that carry an `open` payload get the detail popup; the rest stay plain.
const openExercise = ref(null)

// Clicking the active chip clears the filter and puts every kind back.
const pick = id => { kind.value = kind.value === id ? null : id }
</script>

<template>
  <div class="search">
    <header class="search__head">
      <button v-if="panel" class="search__back" @click="openPanel(null)">← Explore</button>
      <h1 class="search__title">{{ panel ? PANELS[panel].title : 'Explore' }}</h1>
      <p class="search__sub">{{ panel ? PANELS[panel].sub : 'Athletes, workouts, exercises, challenges and posts.' }}</p>
    </header>

    <Leaderboard v-if="panel === 'ranking'" />
    <ReviewQueue v-else-if="panel === 'review'" />

    <template v-else>
      <div class="search__bar">
        <span class="search__icon">🔍</span>
        <input
          v-model="query"
          type="text"
          class="search__input"
          placeholder="Search people, workouts, exercises…"
        />
        <button v-if="query" class="search__clear" @click="query = ''" aria-label="Clear">×</button>
      </div>

      <div v-if="chips.length" class="search__tabs hide-scrollbar">
        <Chip v-for="c in chips" :key="c.id" :active="kind === c.id" @click="pick(c.id)">
          {{ c.icon }} {{ c.label }}<span v-if="q" class="search__pill">{{ c.hits.length }}</span>
        </Chip>
      </div>

      <template v-if="isDiscover || totalHits">
        <!-- Discover: the two panels and the trending tags sit above the curated lists -->
        <template v-if="isDiscover">
          <div class="panels">
            <Card padding="md" class="panel" role="button" tabindex="0" @click="openPanel('ranking')" @keyup.enter="openPanel('ranking')">
              <div class="panel__head">
                <h3 class="panel__h">🏆 Top this month</h3>
                <span class="panel__go">Full ranking →</span>
              </div>
              <div v-for="(u, i) in topThree" :key="u.id" class="lead" :class="{ 'lead--me': u.me }">
                <span class="lead__medal">{{ MEDALS[i] }}</span>
                <UserHoverCard :user="u" @click.stop>
                  <Avatar :src="u.avatar" :alt="u.name" size="sm" />
                </UserHoverCard>
                <UserHoverCard :user="u" class="lead__who" @click.stop>
                  <span class="lead__name" tabindex="0">{{ u.me ? 'You' : u.name }}</span>
                </UserHoverCard>
                <span class="lead__tier" :title="`${tierFromDots(u.dots).label} ${tierFromDots(u.dots).division}`">{{ tierFromDots(u.dots).icon }}</span>
                <span class="lead__pts">{{ u.points.toLocaleString() }} pts</span>
              </div>
              <p class="panel__foot">
                You're <strong>#{{ globalBoard.me.rank.toLocaleString() }}</strong>
                of {{ globalBoard.totalAthletes.toLocaleString() }} athletes globally
              </p>
            </Card>

            <Card padding="md" class="panel" role="button" tabindex="0" @click="openPanel('review')" @keyup.enter="openPanel('review')">
              <div class="panel__head">
                <h3 class="panel__h">🎥 Waiting on the community</h3>
                <span class="panel__go">Review queue →</span>
              </div>
              <p class="panel__lead">
                <strong>{{ pendingReviews.length }}</strong> high-tier lift{{ pendingReviews.length === 1 ? '' : 's' }} need verifying.
                Every review counts toward your reviewer badge.
              </p>
              <div class="panel__faces">
                <Avatar v-for="s in pendingReviews.slice(0, 4)" :key="s.id" :src="s.athlete.avatar" :alt="s.athlete.name" size="sm" />
                <span v-if="pendingReviews.length > 4" class="panel__rest">+{{ pendingReviews.length - 4 }}</span>
              </div>
            </Card>
          </div>

          <section class="block">
            <h3 class="block__h">Trending</h3>
            <div class="block__chips">
              <Chip v-for="t in trending" :key="t" size="sm" @click="query = t">{{ t }}</Chip>
            </div>
          </section>
        </template>

        <p v-else class="search__count">
          {{ totalHits }} result{{ totalHits === 1 ? '' : 's' }}<template v-if="q"> for “{{ query }}”</template>
        </p>

        <!-- Result / discover lists -->
        <section v-for="s in sections" :key="s.group.id" class="block">
          <div class="block__head">
            <h3 class="block__h">
              {{ s.label }}<span v-if="s.count" class="block__n">{{ s.count }}</span>
            </h3>
            <button v-if="s.more" class="block__more" @click="pick(s.group.id)">See all →</button>
          </div>
          <p v-if="s.group.id === 'exercises'" class="block__credit">{{ EXERCISE_MEDIA_CREDIT }}</p>
          <div class="results">
            <Card
              v-for="i in s.hits"
              :key="i.id"
              padding="md"
              class="row"
              :class="{ 'row--clickable': i.open || i.handle }"
              :tabindex="i.open || i.handle ? 0 : undefined"
              :role="i.open || i.handle ? 'button' : undefined"
              @click="i.open ? (openExercise = i.open) : i.handle && router.push(`/u/${i.handle}`)"
              @keyup.enter="i.open ? (openExercise = i.open) : i.handle && router.push(`/u/${i.handle}`)"
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
    </template>
  </div>
</template>

<style scoped>
.search { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }
.search__head { padding: 0 var(--space-1); }
.search__title { font-size: var(--fs-2xl); font-weight: var(--fw-bold); letter-spacing: -0.02em; }
.search__sub { color: var(--color-text-muted); margin-top: var(--space-1); font-size: var(--fs-sm); }
.search__back {
  background: none;
  border: none;
  padding: 0;
  margin-bottom: var(--space-2);
  color: var(--color-accent);
  font: inherit;
  font-size: var(--fs-sm);
  cursor: pointer;
}

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
  background: var(--color-surface);
  color: inherit;
  font-size: 0.65rem;
  font-weight: var(--fw-bold);
}

/* Ranking + review entry cards, side by side where there's room */
.panels { display: grid; gap: var(--space-3); }
@media (min-width: 760px) { .panels { grid-template-columns: 1fr 1fr; } }
.panel { display: flex; flex-direction: column; gap: var(--space-2); cursor: pointer; }
.panel:hover { border-color: var(--color-border-strong); }
.panel:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.panel__head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-3); }
.panel__h { font-size: var(--fs-sm); font-weight: var(--fw-semibold); }
.panel__go { color: var(--color-accent); font-size: var(--fs-xs); font-weight: var(--fw-medium); flex-shrink: 0; }
.panel__lead { font-size: var(--fs-sm); color: var(--color-text-muted); flex: 1; }
.panel__lead strong { color: var(--color-text); }
.panel__faces { display: flex; align-items: center; }
.panel__faces > * + * { margin-left: -8px; }
.panel__rest { margin-left: var(--space-2); font-size: var(--fs-xs); color: var(--color-text-dim); }
.panel__foot {
  margin-top: var(--space-1);
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-align: center;
}
.panel__foot strong { color: var(--color-text); }

/* Sections */
.block { display: flex; flex-direction: column; gap: var(--space-2); }
.block__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.block__h {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.block__n {
  padding: 0 0.4rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  color: var(--color-text-dim);
  font-size: 0.65rem;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
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
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border);
}
.lead--me { background: var(--color-accent-soft); }
.lead__medal { font-size: var(--fs-md); }
.lead__name { font-weight: var(--fw-medium); color: var(--color-text); }
.lead__who { flex: 1; min-width: 0; }
.lead__tier { font-size: var(--fs-sm); }
.lead__pts { font-size: var(--fs-xs); color: var(--color-text-dim); font-variant-numeric: tabular-nums; }

/* Two columns of result cards once the viewport can hold them */
.results { display: grid; gap: var(--space-2); }
@media (min-width: 760px) { .results { grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr)); } }

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
