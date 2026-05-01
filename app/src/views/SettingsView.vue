<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import { currentUser } from '@/mock/user'

const router = useRouter()

const settings = ref({
  notifications: { push: true, email: false, workoutReminders: true, kudos: true },
  privacy:       { profileVisible: true, showWorkouts: true, allowDm: true },
  display:       { darkMode: true, compactView: false, units: 'metric' },
})

function toggle(group, key) { settings.value[group][key] = !settings.value[group][key] }
function setUnits(v) { settings.value.display.units = v }
function logout() { router.push('/login') }

const sections = [
  {
    id: 'notifications',
    title: 'Notifications',
    icon: '🔔',
    items: [
      { key: 'push',             label: 'Push notifications',  desc: 'Updates on your device' },
      { key: 'email',            label: 'Email digest',         desc: 'Weekly summary in your inbox' },
      { key: 'workoutReminders', label: 'Workout reminders',    desc: 'Nudges for scheduled sessions' },
      { key: 'kudos',            label: 'Kudos & comments',     desc: 'When friends react to your posts' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: '🔒',
    items: [
      { key: 'profileVisible', label: 'Public profile', desc: 'Anyone can find and follow you' },
      { key: 'showWorkouts',   label: 'Show workouts',  desc: 'Display sessions to followers' },
      { key: 'allowDm',        label: 'Allow DMs',      desc: 'Let people you don\'t follow message you' },
    ],
  },
  {
    id: 'display',
    title: 'Display',
    icon: '🎨',
    items: [
      { key: 'darkMode',    label: 'Dark mode',     desc: 'Use the dark theme' },
      { key: 'compactView', label: 'Compact view',  desc: 'Show more content on screen' },
    ],
  },
]
</script>

<template>
  <div class="settings">
    <header class="settings__head">
      <button class="settings__back" @click="router.back()" aria-label="Back">←</button>
      <div class="settings__title-wrap">
        <span class="settings__eyebrow">Account</span>
        <h1 class="settings__title">Settings</h1>
      </div>
    </header>

    <Card padding="md" class="profile-row" @click="router.push('/profile')">
      <Avatar :src="currentUser.avatar" :alt="currentUser.name" size="lg" ring="accent" />
      <div class="profile-row__info">
        <span class="profile-row__name">{{ currentUser.name }}</span>
        <span class="profile-row__handle">@{{ currentUser.username }}</span>
        <span class="profile-row__edit">Tap to edit profile →</span>
      </div>
    </Card>

    <section
      v-for="s in sections"
      :key="s.id"
      class="section"
    >
      <h2 class="section__title">
        <span class="section__icon">{{ s.icon }}</span>
        {{ s.title }}
      </h2>
      <Card padding="none">
        <ul class="list">
          <li
            v-for="item in s.items"
            :key="item.key"
            class="row"
            @click="toggle(s.id, item.key)"
          >
            <div class="row__info">
              <span class="row__label">{{ item.label }}</span>
              <span class="row__desc">{{ item.desc }}</span>
            </div>
            <span
              class="toggle"
              :class="{ 'toggle--on': settings[s.id][item.key] }"
              role="switch"
              :aria-checked="settings[s.id][item.key]"
            >
              <span class="toggle__thumb" />
            </span>
          </li>
        </ul>
      </Card>
    </section>

    <section class="section">
      <h2 class="section__title">
        <span class="section__icon">📏</span>
        Units
      </h2>
      <Card padding="none">
        <div class="seg">
          <button
            class="seg__opt"
            :class="{ 'seg__opt--on': settings.display.units === 'metric' }"
            @click="setUnits('metric')"
          >Metric (kg, km)</button>
          <button
            class="seg__opt"
            :class="{ 'seg__opt--on': settings.display.units === 'imperial' }"
            @click="setUnits('imperial')"
          >Imperial (lb, mi)</button>
        </div>
      </Card>
    </section>

    <section class="section">
      <h2 class="section__title">
        <span class="section__icon">⚙️</span>
        Account
      </h2>
      <Card padding="none">
        <ul class="list">
          <li class="row row--link">
            <span class="row__label">Help & support</span>
            <span class="row__chev">›</span>
          </li>
          <li class="row row--link">
            <span class="row__label">Terms & privacy</span>
            <span class="row__chev">›</span>
          </li>
          <li class="row row--link" @click="logout">
            <span class="row__label row__label--danger">Log out</span>
            <span class="row__chev">›</span>
          </li>
        </ul>
      </Card>
    </section>

    <p class="settings__version">Journal Fit · v0.1</p>
  </div>
</template>

<style scoped>
.settings { display: flex; flex-direction: column; gap: var(--space-5); width: 100%; }

.settings__head { display: flex; align-items: center; gap: var(--space-3); }
.settings__back {
  width: 2.5rem; height: 2.5rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.settings__title-wrap { flex: 1; min-width: 0; }
.settings__eyebrow {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.settings__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--color-text);
}

/* Profile row */
.profile-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.profile-row:hover { background: var(--color-surface-2); }
.profile-row__info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.profile-row__name { font-size: var(--fs-lg); font-weight: var(--fw-semibold); color: var(--color-text); }
.profile-row__handle { font-size: var(--fs-sm); color: var(--color-text-dim); }
.profile-row__edit { font-size: var(--fs-xs); color: var(--color-accent); margin-top: var(--space-1); }

/* Section */
.section { display: flex; flex-direction: column; gap: var(--space-2); }
.section__title {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-1);
}
.section__icon { font-size: var(--fs-md); }

.list { display: flex; flex-direction: column; }
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.row:last-child { border-bottom: none; }
.row:hover { background: var(--color-surface-2); }
.row__info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.row__label { font-size: var(--fs-md); color: var(--color-text); font-weight: var(--fw-medium); }
.row__desc { font-size: var(--fs-xs); color: var(--color-text-dim); }
.row__label--danger { color: var(--color-danger); }
.row__chev { color: var(--color-text-dim); font-size: var(--fs-lg); }

/* Toggle */
.toggle {
  width: 2.75rem;
  height: 1.6rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  position: relative;
  flex-shrink: 0;
  transition: all var(--t-fast) var(--ease);
}
.toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.2rem;
  height: 1.2rem;
  background: var(--color-text-muted);
  border-radius: 50%;
  transition: all var(--t-fast) var(--ease);
}
.toggle--on {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.toggle--on .toggle__thumb {
  transform: translateX(1.15rem);
  background: var(--color-accent-ink);
}

/* Segmented */
.seg { display: flex; }
.seg__opt {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  cursor: pointer;
  border-right: 1px solid var(--color-border);
  transition: all var(--t-fast) var(--ease);
}
.seg__opt:last-child { border-right: none; }
.seg__opt:hover { background: var(--color-surface-2); color: var(--color-text); }
.seg__opt--on {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: var(--fw-semibold);
}

.settings__version {
  text-align: center;
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  padding: var(--space-2) 0;
}
</style>
