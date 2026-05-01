<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'

const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/',        icon: 'house',  label: 'Home' },
  { path: '/journal', icon: 'book',   label: 'Journal' },
  { path: '/search',  icon: 'search', label: 'Explore' },
  { path: '/profile', icon: 'user',   label: 'Me' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <footer class="footer">
    <nav class="footer__nav">
      <button
        v-for="t in tabs"
        :key="t.path"
        class="footer__item"
        :class="{ 'footer__item--active': activePath === t.path }"
        @click="router.push(t.path)"
      >
        <Icon :name="t.icon" size="1.4rem" />
        <span class="footer__label">{{ t.label }}</span>
      </button>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(11, 13, 16, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-border);
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.footer__nav {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  max-width: var(--layout-max);
  margin: 0 auto;
  padding: var(--space-2) var(--space-3);
}

.footer__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-dim);
  padding: var(--space-2) var(--space-1);
  border-radius: var(--radius-md);
  transition: all var(--t-fast) var(--ease);
}
.footer__item:hover {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
}
.footer__item--active { color: var(--color-accent); }

.footer__label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
}
</style>
