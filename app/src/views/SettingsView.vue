<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { currentUser } from '@/mock/user'

const router = useRouter()

// ponytail: local state only, no persistence. Wire to a store/API when settings must survive reload.
const settings = ref({ push: true, publicProfile: true, units: 'metric' })

const toggles = [
  { key: 'push',          label: 'Push notifications' },
  { key: 'publicProfile', label: 'Public profile' },
]

const links = [
  { label: 'Help & support' },
  { label: 'Terms & privacy' },
]

function logout() { router.push('/login') }
</script>

<template>
  <div class="settings">
    <header class="settings__head">
      <button class="settings__back" @click="router.back()" aria-label="Back">←</button>
      <h1 class="settings__title">Settings</h1>
    </header>

    <ul class="list">
      <li class="item">
        <button class="row" @click="router.push('/profile')">
          <Avatar :src="currentUser.avatar" :alt="currentUser.name" size="md" />
          <span class="row__main">
            <span class="row__label">{{ currentUser.name }}</span>
            <span class="row__sub">@{{ currentUser.username }}</span>
          </span>
          <span class="row__chev" aria-hidden="true">›</span>
        </button>
      </li>

      <li v-for="t in toggles" :key="t.key" class="item">
        <button
          class="row"
          role="switch"
          :aria-checked="settings[t.key]"
          @click="settings[t.key] = !settings[t.key]"
        >
          <span class="row__main"><span class="row__label">{{ t.label }}</span></span>
          <span class="toggle" :class="{ 'toggle--on': settings[t.key] }" aria-hidden="true">
            <span class="toggle__thumb" />
          </span>
        </button>
      </li>

      <li class="item">
        <div class="row row--static">
          <span class="row__main"><span class="row__label">Units</span></span>
          <span class="seg" role="radiogroup" aria-label="Units">
            <button
              v-for="u in ['metric', 'imperial']"
              :key="u"
              class="seg__opt"
              :class="{ 'seg__opt--on': settings.units === u }"
              role="radio"
              :aria-checked="settings.units === u"
              @click="settings.units = u"
            >{{ u === 'metric' ? 'kg · km' : 'lb · mi' }}</button>
          </span>
        </div>
      </li>

      <li v-for="l in links" :key="l.label" class="item">
        <button class="row">
          <span class="row__main"><span class="row__label">{{ l.label }}</span></span>
          <span class="row__chev" aria-hidden="true">›</span>
        </button>
      </li>

      <li class="item">
        <button class="row" @click="logout">
          <span class="row__main"><span class="row__label row__label--danger">Log out</span></span>
        </button>
      </li>
    </ul>

    <p class="settings__version">Journal Fit · v0.1</p>
  </div>
</template>

<style scoped>
.settings { display: flex; flex-direction: column; gap: var(--space-5); width: 100%; }

.settings__head { display: flex; align-items: center; gap: var(--space-3); }
.settings__back {
  width: 2.25rem; height: 2.25rem;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
}
.settings__back:hover { color: var(--color-text); background: var(--color-surface-2); }
.settings__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.02em;
}

.list { display: flex; flex-direction: column; }
.item + .item { border-top: 1px solid var(--color-border); }

.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4) 0;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.row--static { cursor: default; }

.row__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.row__label { font-size: var(--fs-md); color: var(--color-text); }
.row__label--danger { color: var(--color-danger); }
.row__sub { font-size: var(--fs-sm); color: var(--color-text-dim); }
.row__chev { color: var(--color-text-dim); font-size: var(--fs-lg); flex-shrink: 0; }

.toggle {
  width: 2.6rem;
  height: 1.5rem;
  flex-shrink: 0;
  position: relative;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  transition: all var(--t-fast) var(--ease);
}
.toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.1rem;
  height: 1.1rem;
  background: var(--color-text-muted);
  border-radius: 50%;
  transition: all var(--t-fast) var(--ease);
}
.toggle--on { background: var(--color-accent); border-color: var(--color-accent); }
.toggle--on .toggle__thumb { transform: translateX(1.1rem); background: var(--color-accent-ink); }

.seg { display: flex; gap: var(--space-1); flex-shrink: 0; }
.seg__opt {
  background: none;
  border: none;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  color: var(--color-text-dim);
  font: inherit;
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: all var(--t-fast) var(--ease);
}
.seg__opt:hover { color: var(--color-text); }
.seg__opt--on {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: var(--fw-semibold);
}

.settings__version {
  text-align: center;
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
}
</style>
