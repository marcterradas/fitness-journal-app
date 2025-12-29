<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  date: {
    type: Date,
    required: true
  }
})

  const router = useRouter()

const status = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const checkDate = new Date(props.date)
  checkDate.setHours(0, 0, 0, 0)

  if (checkDate < today) return 'completed'
  if (checkDate.getTime() === today.getTime()) return 'active'
  return 'upcoming'
})

function goToWorkout() {
  router.push('/workout')
}

const exercises = ['Pull ups', 'Dips', 'Rows', 'Military Press']
</script>

<template>
  <div class="workout-card">
    <div class="workout-card__status-container">
      <button v-if="status === 'completed'" class="workout-card__action workout-card__action--completed" disabled>
        <span>Workout Completed</span>
      </button>
      <button v-else-if="status === 'active'" class="workout-card__action workout-card__action--start" @click="goToWorkout">
        Start Workout
      </button>
      <button v-else class="workout-card__action workout-card__action--upcoming" disabled>
        <span>Upcoming Workout</span>
      </button>
    </div>
    
    <div class="workout-card__exercises">
      <h3 class="workout-card__exercises-title">Workout Summary</h3>
      <ul class="workout-card__exercises-list">
        <li v-for="exercise in exercises" :key="exercise" class="workout-card__exercises-item">{{ exercise }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.workout-card {
  background-color: #222;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.workout-card__status-container {
  display: flex;
  justify-content: center;
}

.workout-card__action {
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.workout-card__action--completed {
  background-color: #2e7d32;
}

.workout-card__action--start {
  background-color: #1976d2;
  cursor: pointer;
}

.workout-card__action--start:hover {
  background-color: #1565c0;
}

.workout-card__action--upcoming {
  background-color: #424242;
  color: #aaa;
  cursor: not-allowed;
}

.workout-card__exercises-title {
  margin: 0 0 1rem 0;
  color: #888;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.workout-card__exercises-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.workout-card__exercises-item {
  padding: 0.8rem 0;
  border-bottom: 1px solid #333;
  color: #eee;
  font-size: 1.1rem;
}

.workout-card__exercises-item:last-child {
  border-bottom: none;
}
</style>
