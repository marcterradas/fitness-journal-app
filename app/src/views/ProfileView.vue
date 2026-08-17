<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Stat from '@/components/Stat.vue'
import Chip from '@/components/Chip.vue'
import Post from '@/components/Post.vue'
import TrainingSummary from '@/components/TrainingSummary.vue'

import { currentUser, RANKS, SEXES, getUserRank, bmi, bmiLabel, ageFrom } from '@/mock/user'
import { SPORT_TYPES } from '@/mock/workouts'
import { userPosts, achievements } from '@/mock/social'

const router = useRouter()

// ponytail: same object as the mock, so edits stick while navigating
const user = reactive(currentUser)

const rank = computed(() => getUserRank(user.stats.workouts))
const nextRank = computed(() => RANKS[RANKS.findIndex(r => r.id === rank.value.id) + 1] || null)

const tab = ref('posts')
const earned = computed(() => achievements.filter(a => a.earned).length)

const age = computed(() => ageFrom(user.birthDate))
const bmiValue = computed(() => bmi(user.weightKg, user.heightCm))
const sportLabel = computed(() => SPORT_TYPES.find(s => s.id === user.primarySport)?.label || '—')

/* ---- Edit profile ---- */
const editOpen = ref(false)
const form = reactive({})
const toast = ref('')

const EDITABLE = [
  'name', 'username', 'avatar', 'bio', 'location',
  'birthDate', 'sex', 'heightCm', 'weightKg', 'primarySport',
]

function openEdit() {
  for (const k of EDITABLE) form[k] = user[k]
  form.weeklyGoal = user.stats.weeklyGoal
  editOpen.value = true
}

const canSave = computed(() => form.name?.trim() && form.username?.trim())

function saveProfile() {
  if (!canSave.value) return
  for (const k of EDITABLE) user[k] = typeof form[k] === 'string' ? form[k].trim() : form[k]
  user.stats.weeklyGoal = Number(form.weeklyGoal) || user.stats.weeklyGoal
  editOpen.value = false
  toast.value = 'Profile updated'
  setTimeout(() => { toast.value = '' }, 2000)
}
</script>

<template>
  <div class="profile">
    <Card padding="lg" class="hero">
      <div class="hero__top">
        <Avatar :src="user.avatar" :alt="user.name" size="xl" ring="accent" />
        <div class="hero__actions">
          <button class="hero__edit" @click="openEdit">Edit profile</button>
          <button class="hero__gear" title="Settings" aria-label="Settings" @click="router.push('/settings')">⚙️</button>
        </div>
      </div>
      <div class="hero__id">
        <h1 class="hero__name">{{ user.name }}</h1>
        <p class="hero__handle">@{{ user.username }} · 📍 {{ user.location }}</p>
        <p class="hero__bio">{{ user.bio }}</p>
      </div>

      <!-- Rank -->
      <div class="rank" :style="{ '--rank-color': rank.color }">
        <span class="rank__icon">{{ rank.icon }}</span>
        <div class="rank__info">
          <span class="rank__label">{{ rank.label }}</span>
          <span class="rank__sub">
            {{ user.stats.workouts }} workouts
            <template v-if="nextRank"> · {{ nextRank.min - user.stats.workouts }} to {{ nextRank.label }}</template>
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
        <Stat icon="✅" :value="user.stats.workouts" label="workouts" />
        <Stat icon="👥" :value="user.stats.followers" label="followers" />
        <Stat icon="↗️" :value="user.stats.following" label="following" />
        <Stat icon="🔥" :value="user.stats.streakDays" label="day streak" />
      </div>
    </Card>

    <!-- Tabs -->
    <div class="tabs" role="tablist">
      <button
        v-for="t in [
          { id: 'posts', label: `Posts · ${userPosts.length}` },
          { id: 'stats', label: 'Stats' },
          { id: 'awards', label: `Awards · ${earned}` },
        ]"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        class="tabs__btn"
        :class="{ 'tabs__btn--active': tab === t.id }"
        @click="tab = t.id"
      >{{ t.label }}</button>
    </div>

    <!-- Posts -->
    <section v-if="tab === 'posts'" class="profile__posts">
      <Post v-for="p in userPosts" :key="p.id" :post="p" />
    </section>

    <!-- Stats -->
    <template v-else-if="tab === 'stats'">
      <Card padding="lg">
        <TrainingSummary />
      </Card>

      <section>
        <h3 class="section-h">Body & training</h3>
        <Card padding="md">
          <div class="body">
          <div class="body__item">
            <span class="body__v">{{ user.heightCm || '—' }}<span class="body__u">cm</span></span>
            <span class="body__l">Height</span>
          </div>
          <div class="body__item">
            <span class="body__v">{{ user.weightKg || '—' }}<span class="body__u">kg</span></span>
            <span class="body__l">Weight</span>
          </div>
          <div class="body__item">
            <span class="body__v">{{ bmiValue ? bmiValue.toFixed(1) : '—' }}</span>
            <span class="body__l">BMI · {{ bmiLabel(bmiValue) }}</span>
          </div>
          <div class="body__item">
            <span class="body__v">{{ age ?? '—' }}</span>
            <span class="body__l">Years old</span>
          </div>
          <div class="body__item">
            <span class="body__v body__v--text">{{ sportLabel }}</span>
            <span class="body__l">Main sport</span>
          </div>
          <div class="body__item">
            <span class="body__v">{{ user.stats.weeklyDone }}<span class="body__u">/{{ user.stats.weeklyGoal }}</span></span>
            <span class="body__l">Weekly goal</span>
          </div>
          </div>
        </Card>
      </section>
    </template>

    <!-- Awards -->
    <section v-else>
      <div class="ach__head">
        <h3 class="section-h" style="margin:0">Achievements</h3>
        <span class="ach__count">{{ earned }} of {{ achievements.length }} earned</span>
      </div>
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

    <!-- Edit profile sheet -->
    <Transition name="sheet">
      <div v-if="editOpen" class="sheet" @click.self="editOpen = false">
        <form class="sheet__panel" role="dialog" aria-label="Edit profile" @submit.prevent="saveProfile">
          <div class="sheet__handle" />
          <header class="sheet__head">
            <div>
              <span class="sheet__eyebrow">Profile</span>
              <h2 class="sheet__title">Edit profile</h2>
            </div>
            <button type="button" class="sheet__close" @click="editOpen = false" aria-label="Close">×</button>
          </header>

          <div class="sheet__avatar">
            <Avatar :src="form.avatar" :alt="form.name" size="lg" ring="accent" />
            <label class="field">
              <span class="field__label">Avatar URL</span>
              <input v-model="form.avatar" class="field__input" placeholder="https://…" />
            </label>
          </div>

          <div class="field__row">
            <label class="field">
              <span class="field__label">Name</span>
              <input v-model="form.name" class="field__input" required />
            </label>
            <label class="field">
              <span class="field__label">Username</span>
              <input v-model="form.username" class="field__input" required />
            </label>
          </div>

          <label class="field">
            <span class="field__label">Bio</span>
            <textarea v-model="form.bio" rows="2" class="field__input" placeholder="What are you training for?" />
          </label>

          <div class="field__row">
            <label class="field">
              <span class="field__label">Location</span>
              <input v-model="form.location" class="field__input" />
            </label>
            <label class="field">
              <span class="field__label">Date of birth</span>
              <input v-model="form.birthDate" type="date" class="field__input" />
            </label>
          </div>

          <div class="field__row">
            <label class="field">
              <span class="field__label">Height (cm)</span>
              <input v-model.number="form.heightCm" type="number" min="80" max="250" class="field__input" />
            </label>
            <label class="field">
              <span class="field__label">Weight (kg)</span>
              <input v-model.number="form.weightKg" type="number" min="25" max="300" step="0.1" class="field__input" />
            </label>
            <label class="field">
              <span class="field__label">Sessions / week</span>
              <input v-model.number="form.weeklyGoal" type="number" min="1" max="14" class="field__input" />
            </label>
          </div>

          <div class="field">
            <span class="field__label">Main sport</span>
            <div class="field__chips">
              <Chip
                v-for="s in SPORT_TYPES"
                :key="s.id"
                size="sm"
                :active="form.primarySport === s.id"
                @click="form.primarySport = s.id"
              >{{ s.emoji }} {{ s.label }}</Chip>
            </div>
          </div>

          <div class="field">
            <span class="field__label">Sex</span>
            <div class="field__chips">
              <Chip
                v-for="s in SEXES"
                :key="s.id"
                size="sm"
                :active="form.sex === s.id"
                @click="form.sex = s.id"
              >{{ s.label }}</Chip>
            </div>
          </div>

          <p class="sheet__hint">
            BMI preview: {{ bmi(form.weightKg, form.heightCm) ? bmi(form.weightKg, form.heightCm).toFixed(1) : '—' }}
            · {{ bmiLabel(bmi(form.weightKg, form.heightCm)) }}
          </p>

          <div class="sheet__actions">
            <button type="button" class="sheet__btn" @click="editOpen = false">Cancel</button>
            <button type="submit" class="sheet__btn sheet__btn--primary" :disabled="!canSave">Save changes</button>
          </div>
        </form>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
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
.hero__actions { display: flex; align-items: center; gap: var(--space-2); }
.hero__gear {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.hero__gear:hover { background: var(--color-surface-hover); }
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

/* Tabs */
.tabs {
  display: flex;
  gap: var(--space-1);
  padding: 4px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
}
.tabs__btn {
  flex: 1;
  padding: var(--space-2);
  background: transparent;
  border: none;
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.tabs__btn--active { background: var(--color-accent); color: var(--color-accent-ink); }

/* Achievements */
.ach__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.ach__count { font-size: var(--fs-xs); color: var(--color-text-dim); }
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

/* Body & training */
.body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4) var(--space-3);
}
.body__item { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.body__v {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.body__v--text { font-size: var(--fs-md); }
.body__u { font-size: var(--fs-sm); color: var(--color-text-dim); margin-left: 2px; }
.body__l {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Posts */
.profile__posts { display: flex; flex-direction: column; gap: var(--space-4); }

/* Edit sheet */
.sheet {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sheet__panel {
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%;
  max-width: 36rem;
  max-height: 88vh;
  overflow-y: auto;
  padding: var(--space-4) var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: var(--shadow-lg);
}
.sheet__handle {
  width: 2.5rem;
  height: 4px;
  background: var(--color-border-strong);
  border-radius: var(--radius-pill);
  margin: 0 auto var(--space-2);
}
.sheet__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.sheet__eyebrow {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.sheet__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--color-text);
  margin-top: 2px;
}
.sheet__close {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: var(--fs-lg);
  cursor: pointer;
  line-height: 1;
}
.sheet__avatar { display: flex; align-items: center; gap: var(--space-3); }
.sheet__hint {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  background: var(--color-surface);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-variant-numeric: tabular-nums;
}

.field { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 7rem; }
.field__row { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.field__label {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--fw-medium);
}
.field__input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: var(--space-3);
  font-family: inherit;
  font-size: var(--fs-sm);
  outline: none;
  resize: vertical;
  width: 100%;
  transition: border-color var(--t-fast) var(--ease);
}
.field__input:focus { border-color: var(--color-accent); }
.field__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.sheet__actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
.sheet__btn {
  flex: 1;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.sheet__btn:hover { color: var(--color-text); border-color: var(--color-border-strong); }
.sheet__btn--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-ink);
}
.sheet__btn--primary:hover { background: var(--color-accent-hover); border-color: var(--color-accent-hover); }
.sheet__btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }

.sheet-enter-active, .sheet-leave-active { transition: opacity var(--t-med) var(--ease); }
.sheet-enter-active .sheet__panel, .sheet-leave-active .sheet__panel {
  transition: transform var(--t-med) var(--ease);
}
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet__panel, .sheet-leave-to .sheet__panel { transform: translateY(100%); }

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
.toast-enter-active, .toast-leave-active { transition: all var(--t-med) var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (max-width: 480px) {
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .body { grid-template-columns: repeat(2, 1fr); }
}
</style>
