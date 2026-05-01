<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/Card.vue'
import Chip from '@/components/Chip.vue'
import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'
import EmptyState from '@/components/EmptyState.vue'
import SportIcon from '@/components/SportIcon.vue'

import { friends } from '@/mock/user'
import { exercises, workoutPlans } from '@/mock/exercises'
import { challenges, feedPosts } from '@/mock/social'

const query = ref('')
const tab = ref('people')

const tabs = [
  { id: 'people', label: 'People', icon: '👥' },
  { id: 'workouts', label: 'Workouts', icon: '💪' },
  { id: 'exercises', label: 'Exercises', icon: '🏋️' },
  { id: 'challenges', label: 'Challenges', icon: '🎯' },
  { id: 'posts', label: 'Posts', icon: '📝' },
]

const trending = ['#PullUpProgress', '#April30Mobility', '#Sub50_10k', '#PostureFix', '#ZeroSugarApril']

function match(s) { return s.toLowerCase().includes(query.value.toLowerCase()) }

const results = computed(() => {
  const q = query.value.trim()
  switch (tab.value) {
    case 'people':
      return friends.filter(u => !q || match(u.name) || match(u.username))
    case 'workouts':
      return workoutPlans.filter(w => !q || match(w.title) || match(w.sport))
    case 'exercises':
      return exercises.filter(e => !q || match(e.name) || match(e.muscle))
    case 'challenges':
      return challenges.filter(c => !q || match(c.title))
    case 'posts':
      return feedPosts.filter(p => !q || match(p.title) || match(p.text))
    default: return []
  }
})

function setTab(id) { tab.value = id }
</script>

<template>
  <div class="search">
    <header class="search__head">
      <h1 class="search__title">Explore</h1>
      <p class="search__sub">Find friends, workouts, exercises, challenges.</p>
    </header>

    <div class="search__bar">
      <span class="search__icon">🔍</span>
      <input
        v-model="query"
        type="text"
        class="search__input"
        :placeholder="`Search ${tabs.find(t => t.id === tab).label.toLowerCase()}...`"
      />
      <button v-if="query" class="search__clear" @click="query = ''" aria-label="Clear">×</button>
    </div>

    <div class="search__tabs hide-scrollbar">
      <Chip
        v-for="t in tabs"
        :key="t.id"
        :active="tab === t.id"
        @click="setTab(t.id)"
      >
        {{ t.icon }} {{ t.label }}
      </Chip>
    </div>

    <section v-if="!query && tab === 'people'" class="trending">
      <h3 class="search__section-h">Trending</h3>
      <div class="trending__chips">
        <Chip v-for="t in trending" :key="t" size="sm" @click="query = t">{{ t }}</Chip>
      </div>
    </section>

    <div v-if="results.length" class="results">
      <!-- People -->
      <template v-if="tab === 'people'">
        <Card v-for="u in results" :key="u.id" padding="md" class="row">
          <Avatar :src="u.avatar" :alt="u.name" size="md" />
          <div class="row__main">
            <span class="row__title">{{ u.name }}</span>
            <span class="row__sub">@{{ u.username }} · {{ u.sport }}</span>
          </div>
          <button class="row__btn">Follow</button>
        </Card>
      </template>

      <!-- Workouts -->
      <template v-else-if="tab === 'workouts'">
        <Card v-for="w in results" :key="w.id" padding="md" class="row">
          <SportIcon :sport="w.sport" size="md" />
          <div class="row__main">
            <span class="row__title">{{ w.title }}</span>
            <div class="row__badges">
              <Badge :tone="w.sport">{{ w.sport }}</Badge>
              <Badge tone="neutral">⏱ {{ w.durationMin }} min</Badge>
              <Badge tone="neutral">{{ w.level }}</Badge>
            </div>
          </div>
          <button class="row__btn">Try</button>
        </Card>
      </template>

      <!-- Exercises -->
      <template v-else-if="tab === 'exercises'">
        <Card v-for="e in results" :key="e.id" padding="md" class="row">
          <span class="row__emoji">🏋️</span>
          <div class="row__main">
            <span class="row__title">{{ e.name }}</span>
            <span class="row__sub">{{ e.muscle }} · {{ e.equipment }}</span>
          </div>
          <button class="row__btn">Add</button>
        </Card>
      </template>

      <!-- Challenges -->
      <template v-else-if="tab === 'challenges'">
        <Card v-for="c in results" :key="c.id" padding="md" class="row">
          <span class="row__emoji">{{ c.emoji }}</span>
          <div class="row__main">
            <span class="row__title">{{ c.title }}</span>
            <span class="row__sub">{{ c.members.toLocaleString() }} members · {{ c.daysLeft }} days left</span>
          </div>
          <button class="row__btn">Join</button>
        </Card>
      </template>

      <!-- Posts -->
      <template v-else-if="tab === 'posts'">
        <Card v-for="p in results" :key="p.id" padding="md" class="row">
          <Avatar :src="p.user.avatar" :alt="p.user.name" size="md" />
          <div class="row__main">
            <span class="row__title">{{ p.title }}</span>
            <span class="row__sub">{{ p.user.name }} · {{ p.when }}</span>
            <p class="row__text">{{ p.text }}</p>
          </div>
        </Card>
      </template>
    </div>

    <EmptyState
      v-else
      icon="🔎"
      title="Nothing found"
      :description="query ? `No matches for &quot;${query}&quot;.` : 'Try a different filter.'"
    />
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

.search__tabs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
}

.trending { display: flex; flex-direction: column; gap: var(--space-2); }
.search__section-h {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.trending__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.results { display: flex; flex-direction: column; gap: var(--space-2); }

.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
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
.row__text { color: var(--color-text-muted); font-size: var(--fs-sm); margin-top: var(--space-1); }
.row__badges { display: flex; flex-wrap: wrap; gap: var(--space-1); margin-top: var(--space-1); }
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
</style>
