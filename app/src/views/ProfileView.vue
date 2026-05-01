<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Stat from '@/components/Stat.vue'
import Badge from '@/components/Badge.vue'
import Chip from '@/components/Chip.vue'
import WorkoutCalendar from '@/components/WorkoutCalendar.vue'
import StoriesRow from '@/components/StoriesRow.vue'
import JournalEntry from '@/components/JournalEntry.vue'
import EmptyState from '@/components/EmptyState.vue'

import { currentUser } from '@/mock/user'
import { journalEntries } from '@/mock/workouts'
import { stories, achievements } from '@/mock/social'

const tab = ref('history')
const tabs = [
  { id: 'history', label: 'History' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'goals', label: 'Goals' },
]

const earned = computed(() => achievements.filter(a => a.earned))
const locked = computed(() => achievements.filter(a => !a.earned))
</script>

<template>
  <div class="profile">
    <Card padding="lg" class="hero">
      <div class="hero__top">
        <Avatar :src="currentUser.avatar" :alt="currentUser.name" size="xl" ring="accent" />
        <button class="hero__edit">Edit profile</button>
      </div>
      <div class="hero__id">
        <h1 class="hero__name">{{ currentUser.name }}</h1>
        <p class="hero__handle">@{{ currentUser.username }} · 📍 {{ currentUser.location }}</p>
        <p class="hero__bio">{{ currentUser.bio }}</p>
      </div>
      <div class="hero__stats">
        <Stat icon="✅" :value="currentUser.stats.workouts" label="workouts" />
        <Stat icon="👥" :value="currentUser.stats.followers" label="followers" />
        <Stat icon="↗️" :value="currentUser.stats.following" label="following" />
        <Stat icon="🔥" :value="currentUser.stats.streakDays" label="day streak" />
      </div>
    </Card>

    <section>
      <h3 class="section-h">Highlights</h3>
      <StoriesRow :stories="stories" show-add />
    </section>

    <Card padding="lg">
      <h3 class="section-h">Training calendar</h3>
      <WorkoutCalendar :entries="journalEntries" />
    </Card>

    <div class="profile__tabs">
      <button
        v-for="t in tabs"
        :key="t.id"
        :class="['profile__tab', { 'profile__tab--active': tab === t.id }]"
        @click="tab = t.id"
      >{{ t.label }}</button>
    </div>

    <!-- History -->
    <section v-if="tab === 'history'" class="profile__list">
      <JournalEntry v-for="e in journalEntries" :key="e.id" :entry="e" />
    </section>

    <!-- Achievements -->
    <section v-else-if="tab === 'achievements'" class="achievements">
      <h3 class="section-h">Earned · {{ earned.length }}</h3>
      <div class="ach-grid">
        <Card
          v-for="a in earned"
          :key="a.id"
          padding="md"
          variant="accent"
          class="ach"
        >
          <span class="ach__icon">{{ a.icon }}</span>
          <span class="ach__title">{{ a.title }}</span>
          <span class="ach__date">{{ a.date }}</span>
        </Card>
      </div>
      <h3 class="section-h">Locked</h3>
      <div class="ach-grid">
        <Card v-for="a in locked" :key="a.id" padding="md" class="ach ach--locked">
          <span class="ach__icon">{{ a.icon }}</span>
          <span class="ach__title">{{ a.title }}</span>
          <span class="ach__date">Keep going</span>
        </Card>
      </div>
    </section>

    <!-- Goals -->
    <section v-else-if="tab === 'goals'" class="goals">
      <Card v-for="g in currentUser.goals" :key="g.id" padding="md">
        <div class="goal__row">
          <span class="goal__label">{{ g.label }}</span>
          <Badge tone="accent">{{ Math.round(g.progress * 100) }}%</Badge>
        </div>
        <div class="goal__bar">
          <div class="goal__fill" :style="{ width: `${g.progress * 100}%` }" />
        </div>
      </Card>
      <EmptyState
        v-if="!currentUser.goals.length"
        icon="🎯"
        title="No goals set"
        description="Pick a target and we'll track your progress."
      />
    </section>
  </div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
}

.section-h {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

/* Hero */
.hero { display: flex; flex-direction: column; gap: var(--space-5); }
.hero__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.hero__edit {
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.hero__edit:hover { background: var(--color-surface-hover); }

.hero__id { display: flex; flex-direction: column; gap: var(--space-2); }
.hero__name {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
}
.hero__handle { color: var(--color-text-dim); font-size: var(--fs-sm); }
.hero__bio { color: var(--color-text-muted); }

.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

/* Tabs */
.profile__tabs {
  display: flex;
  gap: var(--space-1);
  background: var(--color-surface);
  padding: var(--space-1);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}
.profile__tab {
  flex: 1;
  padding: var(--space-3);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-weight: var(--fw-medium);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--t-fast) var(--ease);
}
.profile__tab--active {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.profile__list { display: flex; flex-direction: column; gap: var(--space-3); }

/* Achievements */
.achievements { display: flex; flex-direction: column; gap: var(--space-3); }
.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-3);
}
.ach {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-1);
}
.ach__icon { font-size: 2rem; }
.ach__title { font-weight: var(--fw-semibold); color: var(--color-text); font-size: var(--fs-sm); }
.ach__date { color: var(--color-text-dim); font-size: var(--fs-xs); }
.ach--locked { opacity: 0.45; }

/* Goals */
.goals { display: flex; flex-direction: column; gap: var(--space-3); }
.goal__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}
.goal__label { font-weight: var(--fw-medium); color: var(--color-text); }
.goal__bar {
  height: 8px;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.goal__fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-pill);
  transition: width var(--t-med) var(--ease);
}

@media (max-width: 480px) {
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
