<script setup>
import { useDateNavigation } from '@/composables/useDateNavigation'

const { formattedDate, previousDay, nextDay } = useDateNavigation()
</script>

<template>
  <div class="day-selector">
    <button class="nav-button" @click="previousDay" aria-label="Previous day">
      &larr;
    </button>
    <span class="current-date">{{ formattedDate }}</span>
    <button class="nav-button" @click="nextDay" aria-label="Next day">
      &rarr;
    </button>
  </div>
</template>

<style scoped>
.day-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  width: 100%;
}

.nav-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-date {
  font-size: 1rem;
}
</style>