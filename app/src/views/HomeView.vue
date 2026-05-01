<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Stat from '@/components/Stat.vue'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import SportIcon from '@/components/SportIcon.vue'
import StoriesRow from '@/components/StoriesRow.vue'
import Post from '@/components/Post.vue'
import FollowSuggestionsForYou from '@/components/FollowSuggestionsForYou.vue'

import { currentUser } from '@/mock/user'
import { todayWorkout, recentActivity, weeklyProgress } from '@/mock/workouts'
import { motivationalQuotes, feedPosts, stories, challenges } from '@/mock/social'

const router = useRouter()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5) return 'Still up'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => currentUser.name.split(' ')[0])
const weekRatio = computed(() => currentUser.stats.weeklyDone / currentUser.stats.weeklyGoal)
const quote = computed(() => motivationalQuotes[new Date().getDate() % motivationalQuotes.length])

function go(path) { router.push(path) }
</script>

<template>
  <div class="home">
    <main class="home__main">
      <!-- Stories (Instagram-style) -->
      <section class="stories-bar">
        <StoriesRow :stories="stories" show-add />
      </section>

      <!-- Hero -->
      <Card variant="accent" padding="lg" class="hero">
        <div class="hero__row">
          <Avatar :src="currentUser.avatar" :alt="currentUser.name" size="lg" ring="accent" />
          <div class="hero__copy">
            <p class="hero__greeting">{{ greeting }},</p>
            <h1 class="hero__name">{{ firstName }} 👋</h1>
            <p class="hero__sub">{{ quote }}</p>
          </div>
        </div>
        <div class="hero__stats">
          <Stat icon="🔥" :value="currentUser.stats.streakDays" label="day streak" />
          <Stat icon="✅" :value="currentUser.stats.workouts" label="workouts" />
          <Stat icon="⏱" :value="currentUser.stats.minutesThisWeek" label="min this week" />
        </div>
      </Card>

      <!-- Today's workout -->
      <Card padding="lg" class="today">
        <div class="today__head">
          <div>
            <span class="today__eyebrow">Today's session</span>
            <h2 class="today__title">{{ todayWorkout.title }}</h2>
          </div>
          <SportIcon :sport="todayWorkout.sport" size="lg" />
        </div>
        <div class="today__meta">
          <Badge :tone="todayWorkout.sport" icon="⏱">{{ todayWorkout.durationMin }} min</Badge>
          <Badge tone="neutral" icon="📋">{{ todayWorkout.exerciseCount }} exercises</Badge>
        </div>
        <ul class="today__list">
          <li v-for="ex in todayWorkout.exercises.slice(0, 4)" :key="ex.name" class="today__item">
            <span>{{ ex.name }}</span>
            <span class="today__item-meta">{{ ex.sets }} × {{ ex.reps }}</span>
          </li>
          <li v-if="todayWorkout.exercises.length > 4" class="today__item today__item--more">
            +{{ todayWorkout.exercises.length - 4 }} more exercises
          </li>
        </ul>
        <button class="today__cta" @click="go('/workout')">Start workout →</button>
      </Card>

      <!-- Week progress + streak -->
      <div class="row-2">
        <Card padding="lg" class="streak">
          <ProgressRing :value="weekRatio" :size="120" :stroke="10">
            <span class="streak__value">{{ currentUser.stats.weeklyDone }}<span class="streak__sep">/</span>{{ currentUser.stats.weeklyGoal }}</span>
            <span class="streak__label">this week</span>
          </ProgressRing>
          <div class="streak__copy">
            <h3 class="streak__title">Weekly goal</h3>
            <p class="streak__sub">
              {{ currentUser.stats.weeklyGoal - currentUser.stats.weeklyDone }} session{{ currentUser.stats.weeklyGoal - currentUser.stats.weeklyDone === 1 ? '' : 's' }} to go.
              You've got this.
            </p>
          </div>
        </Card>

        <Card padding="lg" class="week">
          <h3 class="week__title">This week</h3>
          <div class="week__days">
            <div
              v-for="d in weeklyProgress"
              :key="d.day"
              class="day"
              :class="{ 'day--done': d.done }"
              :title="d.sport || 'Rest'"
            >
              <span class="day__dot">{{ d.done ? '✓' : '·' }}</span>
              <span class="day__label">{{ d.day }}</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Quick actions -->
      <section class="quick">
        <h3 class="section-h">Quick actions</h3>
        <div class="quick__grid">
          <button class="quick__btn" @click="go('/workout')">
            <span class="quick__icon">▶️</span>
            <span class="quick__lbl">Start</span>
          </button>
          <button class="quick__btn" @click="go('/journal')">
            <span class="quick__icon">📓</span>
            <span class="quick__lbl">Log entry</span>
          </button>
          <button class="quick__btn" @click="go('/search')">
            <span class="quick__icon">🔍</span>
            <span class="quick__lbl">Explore</span>
          </button>
          <button class="quick__btn" @click="go('/profile')">
            <span class="quick__icon">🏆</span>
            <span class="quick__lbl">Achievements</span>
          </button>
        </div>
      </section>

      <!-- Recent activity -->
      <section>
        <h3 class="section-h">Recent activity</h3>
        <Card padding="none">
          <ul class="activity">
            <li v-for="a in recentActivity" :key="a.id" class="activity__item">
              <span class="activity__icon">{{ a.icon }}</span>
              <span class="activity__text">{{ a.text }}</span>
              <span class="activity__when">{{ a.when }}</span>
            </li>
          </ul>
        </Card>
      </section>

      <!-- Community Feed -->
      <section class="community">
        <div class="community__head">
          <div>
            <h2 class="community__title">From your community</h2>
            <p class="community__sub">Cheer on friends. No leaderboards, just support.</p>
          </div>
        </div>

        <Card variant="accent" padding="lg" class="celebrate">
          <span class="celebrate__icon">🎉</span>
          <div>
            <h3 class="celebrate__title">Ava just hit a PR!</h3>
            <p class="celebrate__sub">Send some kudos to keep the momentum going.</p>
          </div>
        </Card>

        <div class="community__posts">
          <Post v-for="p in feedPosts" :key="p.id" :post="p" />
        </div>
      </section>
    </main>

    <aside class="home__aside">
      <Card padding="md">
        <div class="quote">
          <span class="quote__mark">"</span>
          <p class="quote__text">{{ quote }}</p>
          <span class="quote__author">— Journal Fit</span>
        </div>
      </Card>

      <Card padding="md">
        <h3 class="section-h">Active challenges</h3>
        <ul class="challenges">
          <li v-for="c in challenges" :key="c.id" class="challenge">
            <span class="challenge__emoji">{{ c.emoji }}</span>
            <div class="challenge__main">
              <div class="challenge__row">
                <span class="challenge__title">{{ c.title }}</span>
                <Badge tone="neutral">{{ c.daysLeft }}d</Badge>
              </div>
              <span class="challenge__meta">{{ c.members.toLocaleString() }} members</span>
              <div class="challenge__bar">
                <div class="challenge__fill" :style="{ width: `${c.progress * 100}%` }" />
              </div>
            </div>
          </li>
        </ul>
      </Card>

      <FollowSuggestionsForYou />
    </aside>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
}
.home__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-width: 0;
}
.home__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section-h {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
  letter-spacing: 0.02em;
}

/* Stories bar — Instagram-style, edge-to-edge on mobile */
.stories-bar {
  margin: 0 calc(-1 * var(--space-4));
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
@media (min-width: 600px) {
  .stories-bar {
    margin: 0 calc(-1 * var(--space-5));
    padding: var(--space-2) var(--space-5);
  }
}
@media (min-width: 960px) {
  .stories-bar {
    margin: 0;
    padding: var(--space-2) 0;
  }
}

/* Hero */
.hero { display: flex; flex-direction: column; gap: var(--space-5); }
.hero__row { display: flex; align-items: center; gap: var(--space-4); }
.hero__greeting { font-size: var(--fs-sm); color: var(--color-text-muted); }
.hero__name {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  margin-top: var(--space-1);
}
.hero__sub { color: var(--color-text-muted); margin-top: var(--space-1); font-size: var(--fs-sm); }
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

/* Today */
.today { display: flex; flex-direction: column; gap: var(--space-3); }
.today__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.today__eyebrow {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
  margin-bottom: var(--space-1);
}
.today__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
}
.today__meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.today__list { display: flex; flex-direction: column; }
.today__item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: var(--fs-sm);
}
.today__item:last-child { border-bottom: none; }
.today__item-meta { color: var(--color-text-dim); font-variant-numeric: tabular-nums; }
.today__item--more { color: var(--color-text-dim); font-style: italic; justify-content: flex-start; }
.today__cta {
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.today__cta:hover { background: var(--color-accent-hover); }

/* Row of two */
.row-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
@media (min-width: 600px) {
  .row-2 { grid-template-columns: 1fr 1fr; }
}

/* Streak */
.streak {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
}
.streak__value {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
}
.streak__sep { color: var(--color-text-dim); margin: 0 var(--space-1); }
.streak__label { font-size: var(--fs-xs); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; }
.streak__title { font-size: var(--fs-md); font-weight: var(--fw-semibold); }
.streak__sub { font-size: var(--fs-sm); color: var(--color-text-muted); }

/* Week dots */
.week__title { font-size: var(--fs-md); font-weight: var(--fw-semibold); margin-bottom: var(--space-4); }
.week__days { display: grid; grid-template-columns: repeat(7, 1fr); gap: var(--space-2); }
.day { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.day__dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  color: var(--color-text-dim);
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  border: 1px solid var(--color-border);
}
.day--done .day__dot {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border-color: var(--color-accent);
}
.day__label { font-size: var(--fs-xs); color: var(--color-text-dim); }

/* Quick */
.quick__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}
.quick__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.quick__btn:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}
.quick__icon { font-size: 1.5rem; }
.quick__lbl { font-size: var(--fs-sm); font-weight: var(--fw-medium); }

/* Activity */
.activity { padding: var(--space-2) 0; }
.activity__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
}
.activity__item:last-child { border-bottom: none; }
.activity__icon { font-size: 1.25rem; flex-shrink: 0; }
.activity__text { flex: 1; color: var(--color-text); }
.activity__when { color: var(--color-text-dim); font-size: var(--fs-xs); }

/* Quote */
.quote { display: flex; flex-direction: column; gap: var(--space-2); }
.quote__mark { font-size: 2rem; color: var(--color-accent); line-height: 1; }
.quote__text { color: var(--color-text); font-size: var(--fs-md); line-height: 1.5; }
.quote__author { color: var(--color-text-dim); font-size: var(--fs-xs); }

/* Community */
.community { display: flex; flex-direction: column; gap: var(--space-4); }
.community__head { padding-top: var(--space-3); border-top: 1px solid var(--color-border); }
.community__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.01em;
}
.community__sub { color: var(--color-text-muted); font-size: var(--fs-sm); margin-top: var(--space-1); }

.celebrate { display: flex; align-items: center; gap: var(--space-4); }
.celebrate__icon { font-size: 2.5rem; }
.celebrate__title { font-size: var(--fs-lg); font-weight: var(--fw-semibold); color: var(--color-text); }
.celebrate__sub { color: var(--color-text-muted); margin-top: var(--space-1); font-size: var(--fs-sm); }

.community__posts { display: flex; flex-direction: column; gap: var(--space-4); }

/* Challenges (sidebar) */
.challenges { display: flex; flex-direction: column; gap: var(--space-3); }
.challenge { display: flex; gap: var(--space-3); align-items: flex-start; }
.challenge__emoji { font-size: 1.5rem; flex-shrink: 0; }
.challenge__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-1); }
.challenge__row { display: flex; align-items: center; gap: var(--space-2); justify-content: space-between; }
.challenge__title { font-weight: var(--fw-semibold); color: var(--color-text); font-size: var(--fs-sm); }
.challenge__meta { font-size: var(--fs-xs); color: var(--color-text-dim); }
.challenge__bar {
  height: 4px;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  overflow: hidden;
  margin-top: var(--space-1);
}
.challenge__fill { height: 100%; background: var(--color-accent); }

/* Layout — desktop sidebar */
@media (min-width: 960px) {
  .home {
    flex-direction: row;
    align-items: flex-start;
  }
  .home__main { flex: 1 1 auto; min-width: 0; }
  .home__aside {
    width: 320px;
    flex: 0 0 320px;
    position: sticky;
    top: var(--space-5);
  }
}

@media (max-width: 480px) {
  .quick__grid { grid-template-columns: repeat(2, 1fr); }
  .hero__stats { gap: var(--space-2); }
}
</style>
