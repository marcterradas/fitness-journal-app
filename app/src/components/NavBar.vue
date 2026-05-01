<script setup>
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'

const router = useRouter()

function go(path) { router.push(path) }
</script>

<template>
  <header class="navbar">
    <button class="navbar__brand" @click="go('/')" type="button">
      <span class="navbar__logo">JF</span>
      <span class="navbar__name">Journal Fit</span>
    </button>

    <div class="navbar__actions">
      <button class="navbar__btn" @click="go('/messages')" aria-label="Messages" title="Messages">
        <Icon name="message" />
      </button>
      <button class="navbar__btn" @click="go('/notifications')" aria-label="Notifications" title="Notifications">
        <Icon name="bell" />
        <span class="navbar__dot" aria-hidden="true" />
      </button>
      <button class="navbar__btn" @click="go('/settings')" aria-label="Settings" title="Settings">
        <Icon name="gear" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--color-border);
  width: 100%;
  margin-bottom: var(--space-3);
}

.navbar__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
}
.navbar__logo {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--fw-black);
  font-size: var(--fs-xs);
  letter-spacing: -0.02em;
}
.navbar__name {
  font-weight: var(--fw-bold);
  font-size: var(--fs-md);
  letter-spacing: -0.01em;
}

.navbar__actions { display: flex; gap: var(--space-1); }

.navbar__btn {
  position: relative;
  background: none;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: background var(--t-fast) var(--ease), color var(--t-fast) var(--ease);
}
.navbar__btn:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.navbar__dot {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-accent);
  border-radius: 50%;
  border: 2px solid var(--color-bg);
}
</style>
