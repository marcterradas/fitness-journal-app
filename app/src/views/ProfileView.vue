<script setup>
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Stat from '@/components/Stat.vue'
import Post from '@/components/Post.vue'

import { currentUser, RANKS, getUserRank } from '@/mock/user'
import { userPosts, achievements } from '@/mock/social'

const rank = getUserRank(currentUser.stats.workouts)
const nextRank = RANKS[RANKS.findIndex(r => r.id === rank.id) + 1] || null
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

      <!-- Rank -->
      <div class="rank" :style="{ '--rank-color': rank.color }">
        <span class="rank__icon">{{ rank.icon }}</span>
        <div class="rank__info">
          <span class="rank__label">{{ rank.label }}</span>
          <span class="rank__sub">
            {{ currentUser.stats.workouts }} workouts
            <template v-if="nextRank"> · {{ nextRank.min - currentUser.stats.workouts }} to {{ nextRank.label }}</template>
          </span>
        </div>
        <div class="rank__tiers">
          <span
            v-for="r in RANKS"
            :key="r.id"
            class="rank__pip"
            :style="{ background: r.id === rank.id ? rank.color : 'var(--color-surface-2)', border: `1px solid ${r.id === rank.id ? rank.color : 'var(--color-border)'}` }"
            :title="r.label"
          />
        </div>
        <router-link to="/ranking" class="rank__link">Leaderboard ›</router-link>
      </div>

      <div class="hero__stats">
        <Stat icon="✅" :value="currentUser.stats.workouts" label="workouts" />
        <Stat icon="👥" :value="currentUser.stats.followers" label="followers" />
        <Stat icon="↗️" :value="currentUser.stats.following" label="following" />
        <Stat icon="🔥" :value="currentUser.stats.streakDays" label="day streak" />
      </div>
    </Card>

    <section>
      <h3 class="section-h">Achievements</h3>
      <div class="achievements">
        <div
          v-for="a in achievements"
          :key="a.id"
          class="ach"
          :class="{ 'ach--locked': !a.earned }"
          :title="a.earned ? `Earned ${a.date}` : 'Not earned yet'"
        >
          <span class="ach__icon">{{ a.earned ? a.icon : '🔒' }}</span>
          <span class="ach__title">{{ a.title }}</span>
          <span class="ach__date">{{ a.earned ? a.date : '—' }}</span>
        </div>
      </div>
    </section>

    <section>
      <h3 class="section-h">Posts</h3>
      <div class="profile__posts">
        <Post v-for="p in userPosts" :key="p.id" :post="p" />
      </div>
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

/* Rank */
.rank {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: color-mix(in srgb, var(--rank-color) 12%, var(--color-surface-2));
  border: 1px solid color-mix(in srgb, var(--rank-color) 35%, transparent);
  border-radius: var(--radius-md);
}
.rank__icon { font-size: 2rem; flex-shrink: 0; }
.rank__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.rank__label {
  font-weight: var(--fw-bold);
  font-size: var(--fs-md);
  color: var(--rank-color);
}
.rank__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.rank__tiers {
  display: flex;
  gap: 4px;
  align-items: center;
}
.rank__pip {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}
.rank__link {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--rank-color);
  text-decoration: none;
  white-space: nowrap;
  margin-left: var(--space-2);
}
.rank__link:hover { text-decoration: underline; }

/* Achievements */
.achievements {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--space-2);
}
.ach {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
}
.ach--locked { opacity: 0.45; }
.ach__icon { font-size: 1.5rem; }
.ach__title { font-size: var(--fs-xs); font-weight: var(--fw-semibold); }
.ach__date { font-size: 0.65rem; color: var(--color-text-dim); }

/* Posts */
.profile__posts { display: flex; flex-direction: column; gap: var(--space-4); }

@media (max-width: 480px) {
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
