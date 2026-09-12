<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Stat from '@/components/Stat.vue'
import Post from '@/components/Post.vue'
import SportIcon from '@/components/SportIcon.vue'
import EmptyState from '@/components/EmptyState.vue'
import { personOf, isMe } from '@/mock/directory'
import { tierFromDots, UNRANKED } from '@/ranking'
import { topAchievements } from '@/achievements'
import { feedPosts } from '@/mock/social'
import { workoutsOf } from '@/mock/publicWorkouts'
import { WEEKDAYS, saveToDay } from '@/mock/templates'

const route = useRoute()
const router = useRouter()

const handle = computed(() => String(route.params.handle || '').replace(/^@/, ''))
const person = computed(() => personOf(handle.value))
const tier = computed(() => (person.value?.dots ? tierFromDots(person.value.dots) : UNRANKED))
const awards = computed(() => topAchievements(person.value))
const posts = computed(() => feedPosts.filter(p => p.user.username === person.value?.username))
const workouts = computed(() => workoutsOf(person.value?.username))

/* ---- Copy a workout into my weekly plan ---- */
const picking = ref(null)   // workout index waiting for a weekday
const toast = ref('')

function copyTo(workout, dayId) {
  saveToDay(dayId, workout)
  picking.value = null
  toast.value = `Copied to ${WEEKDAYS.find(d => d.id === dayId).long}`
  setTimeout(() => { toast.value = '' }, 2400)
}
</script>

<template>
  <div class="user">
    <header class="user__head">
      <button class="user__back" aria-label="Back" @click="router.back()">←</button>
      <span class="user__eyebrow">Athlete</span>
    </header>

    <EmptyState
      v-if="!person"
      icon="🔍"
      title="No such athlete"
      :description="`Nobody here goes by @${handle}.`"
    />

    <template v-else>
      <Card padding="lg" class="hero">
        <div class="hero__top">
          <Avatar :src="person.avatar" :alt="person.name" size="xl" ring="accent" />
          <router-link v-if="isMe(person)" to="/profile" class="hero__self">That's you ›</router-link>
        </div>
        <div class="hero__id">
          <h1 class="hero__name">{{ person.name }}</h1>
          <p class="hero__handle">
            @{{ person.username }}<template v-if="person.sport"> · {{ person.sport }}</template>
          </p>
          <p v-if="person.bio" class="hero__bio">{{ person.bio }}</p>
        </div>

        <div class="rank" :style="{ '--rank-color': tier.color }">
          <span class="rank__icon">{{ tier.icon }}</span>
          <div class="rank__info">
            <span class="rank__label">{{ tier.label }} {{ tier.division }}</span>
            <span class="rank__sub">{{ person.dots ? `${tier.dots} DOTS` : 'No ranked lifts yet' }}</span>
          </div>
          <router-link to="/search?tab=ranking" class="rank__link">Leaderboard ›</router-link>
        </div>

        <div v-if="awards.length" class="awards">
          <span v-for="a in awards" :key="a.id" class="awards__chip" :title="`Tier ${a.level}/${a.levels}`">
            {{ a.icon }} {{ a.earnedLabel }}
          </span>
        </div>

        <div class="hero__stats">
          <Stat icon="✅" :value="person.workouts ?? person.stats?.workouts ?? '—'" label="workouts" />
          <Stat icon="🔥" :value="person.streak ?? person.stats?.streakDays ?? '—'" label="day streak" />
          <Stat icon="🏅" :value="person.points?.toLocaleString() ?? '—'" label="points" />
        </div>
      </Card>

      <!-- Their routine, copyable into my week -->
      <section class="block">
        <h2 class="block__h">Workouts</h2>
        <Card v-for="(w, i) in workouts" :key="w.id + i" padding="md" class="wo">
          <div class="wo__top">
            <SportIcon :sport="w.sport" size="md" />
            <div class="wo__id">
              <span class="wo__title">{{ w.title }}</span>
              <span class="wo__meta">{{ w.exercises.length }} exercises · {{ w.durationMin }} min</span>
            </div>
            <button class="wo__copy" @click="picking = picking === i ? null : i">
              {{ picking === i ? 'Cancel' : 'Copy workout' }}
            </button>
          </div>

          <ul class="wo__list">
            <li v-for="ex in w.exercises" :key="ex.id" class="wo__ex">
              <span class="wo__ex-name">{{ ex.name }}</span>
              <span class="wo__ex-sets">{{ ex.sets }} × {{ ex.reps }}</span>
            </li>
          </ul>

          <div v-if="picking === i" class="days">
            <span class="days__lbl">Copy to</span>
            <button v-for="d in WEEKDAYS" :key="d.id" class="days__btn" @click="copyTo(w, d.id)">
              {{ d.label }}
            </button>
          </div>
        </Card>
      </section>

      <!-- Their posts -->
      <section class="block">
        <h2 class="block__h">Posts</h2>
        <Post v-for="p in posts" :key="p.id" :post="p" />
        <EmptyState
          v-if="!posts.length"
          icon="📭"
          title="Nothing posted yet"
          :description="`${person.name} hasn't shared a session here.`"
        />
      </section>
    </template>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }} · <router-link to="/templates" class="toast__link">View plan</router-link></div>
    </Transition>
  </div>
</template>

<style scoped>
.user { display: flex; flex-direction: column; gap: var(--space-5); width: 100%; }

.user__head { display: flex; align-items: center; gap: var(--space-3); }
.user__back {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: var(--fs-md);
  cursor: pointer;
}
.user__back:hover { background: var(--color-surface-hover); }
.user__eyebrow {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}

/* Hero */
.hero { display: flex; flex-direction: column; gap: var(--space-5); }
.hero__top { display: flex; justify-content: space-between; align-items: flex-start; }
.hero__self { font-size: var(--fs-sm); color: var(--color-accent); text-decoration: none; font-weight: var(--fw-semibold); }
.hero__id { display: flex; flex-direction: column; gap: var(--space-2); }
.hero__name { font-size: var(--fs-2xl); font-weight: var(--fw-bold); letter-spacing: -0.02em; }
.hero__handle { color: var(--color-text-dim); font-size: var(--fs-sm); }
.hero__bio { color: var(--color-text-muted); }
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.rank__icon { font-size: 2rem; }
.rank__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-1); }
.rank__label { font-weight: var(--fw-bold); font-size: var(--fs-md); color: var(--rank-color); }
.rank__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }
.rank__link {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--rank-color);
  text-decoration: none;
  white-space: nowrap;
}
.rank__link:hover { text-decoration: underline; }

.awards { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.awards__chip {
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 0.65rem;
  font-weight: var(--fw-semibold);
}

/* Sections */
.block { display: flex; flex-direction: column; gap: var(--space-3); }
.block__h {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Workout card */
.wo { display: flex; flex-direction: column; gap: var(--space-3); }
.wo__top { display: flex; align-items: center; gap: var(--space-3); }
.wo__id { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.wo__title { font-weight: var(--fw-semibold); color: var(--color-text); }
.wo__meta { font-size: var(--fs-xs); color: var(--color-text-dim); }
.wo__copy {
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
  color: var(--color-accent-ink);
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--t-fast) var(--ease);
}
.wo__copy:hover { background: var(--color-accent-hover); }
.wo__list { display: flex; flex-direction: column; gap: var(--space-1); }
.wo__ex {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--fs-sm);
  padding: var(--space-1) 0;
  border-bottom: 1px solid var(--color-border);
}
.wo__ex:last-child { border-bottom: none; }
.wo__ex-name { color: var(--color-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wo__ex-sets { color: var(--color-text-dim); font-variant-numeric: tabular-nums; white-space: nowrap; }

.days {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}
.days__lbl {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
}
.days__btn {
  padding: 0.2rem var(--space-3);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.days__btn:hover { background: var(--color-accent-soft); border-color: var(--color-accent); color: var(--color-accent); }

/* Toast */
.toast {
  position: fixed;
  bottom: calc(var(--footer-h) + var(--space-3));
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: var(--color-bg);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}
.toast__link { color: var(--color-bg); text-decoration: underline; }
.toast-enter-active, .toast-leave-active { transition: all var(--t-med) var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (max-width: 480px) {
  .wo__top { flex-wrap: wrap; }
  .wo__copy { width: 100%; }
}
</style>
