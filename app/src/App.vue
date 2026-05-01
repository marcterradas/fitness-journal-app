<script setup>
import AppFooter from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<template>
  <div class="app">
    <main class="app__main">
      <NavBar v-if="!isLoginPage" />
      <router-view />
    </main>
    <AppFooter v-if="!isLoginPage" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

.app__main {
  display: flex;
  flex-direction: column;
  padding: var(--space-3) var(--space-4) calc(var(--footer-h) + var(--space-6));
  width: 100%;
  max-width: var(--layout-max);
  gap: var(--space-3);
}

@media (min-width: 600px) {
  .app__main {
    padding: var(--space-4) var(--space-5) calc(var(--footer-h) + var(--space-8));
  }
}
</style>
