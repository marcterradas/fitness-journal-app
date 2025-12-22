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
    <NavBar v-if="!isLogginPage" />
    <main class="content">
      <router-view></router-view>
    </main>
    <AppFooter v-if="!isLogginPage" />
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
    padding: 1rem;
    width: 100%;
    max-width: 1440px;
  }
</style>
