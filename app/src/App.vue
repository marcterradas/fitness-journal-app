<script setup>
import AppFooter from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isLogginPage = computed(() => route.path === '/login')
</script>

<template>
  <div class="app">
    <main class="content">
      <NavBar v-if="!isLogginPage" />
      <router-view></router-view>
      <AppFooter v-if="!isLogginPage" />
    </main>
  </div>
</template>

<style scoped>
  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1440px;
    gap: 1rem;
  }
</style>
