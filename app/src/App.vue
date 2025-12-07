<script setup>
import AppFooter from './Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showFooter = computed(() => route.path !== '/login')
</script>

<template>
  <div class="app">
    <router-view></router-view>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<style scoped>
  .app {
    padding: 2rem;
    padding-bottom: 6rem;
  }
</style>
