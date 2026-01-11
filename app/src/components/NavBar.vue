<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToMessages() {
  router.push('/messages')
}

function goToNotifications() {
  router.push('/notifications')
}
</script>

<template>
  <header class="navbar">
      <button class="navbar__icon-button" aria-label="Messages" title="Messages" type="button" @click="goToMessages">
        <img class="navbar__icon" src="/message.svg" alt="Messages" />
      </button>

      <button class="navbar__icon-button" aria-label="Notifications" title="Notifications" type="button" @click="goToNotifications">
        <img class="navbar__icon" src="/bell.svg" alt="Notifications" />
      </button>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid var(--pico-muted-border-color);
  width: 100%;
  padding: 0 1rem;
}

.navbar__brand {
   text-decoration: none;
}

.navbar__icon-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.navbar__icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}
</style>