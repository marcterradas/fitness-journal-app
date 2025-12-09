<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="nav">
    <div class="nav__left">
      <RouterLink to="/" class="brand">Fitness Journal</RouterLink>
    </div>

    <div class="nav__right">
      <button class="icon" aria-label="Messages" title="Messages" type="button">
        <img src="/message.svg" alt="Messages" width="20" height="20" />
      </button>

      <button class="icon" aria-label="Notifications" title="Notifications" type="button">
        <img src="/bell.svg" alt="Notifications" width="20" height="20" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--pico-muted-border-color);
  background: var(--pico-background-color);
  position: sticky;
  top: 0;
}

.brand {
  font-weight: 600;
  color: inherit;
  text-decoration: none;
}

.nav__right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.icon {
  background: transparent;
  border: none;
  padding: 0.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: inherit;
}

.icon img {
  display: block;
}

.icon:focus {
  outline: 2px solid Highlight;
  border-radius: 4px;
}
</style>