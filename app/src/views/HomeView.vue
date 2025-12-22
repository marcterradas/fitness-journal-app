<template>
  <div class="home">
    <h1 class="home__title">Welcome back, Alex!</h1>
    
    <div class="home__stats">
      <div class="stat-card">
        <h3 class="stat-card__value">7</h3>
        <p class="stat-card__label">Workouts This Week</p>
      </div>
      <div class="stat-card">
        <h3 class="stat-card__value">12.5k</h3>
        <p class="stat-card__label">Total Weight Lifted (lbs)</p>
      </div>
      <div class="stat-card">
        <h3 class="stat-card__value">4h 30m</h3>
        <p class="stat-card__label">Time Trained</p>
      </div>
      <div class="stat-card">
        <h3 class="stat-card__value">23</h3>
        <p class="stat-card__label">Day Streak 🔥</p>
      </div>
    </div>

    <section class="home__section">
      <h2 class="home__section-title">Recent Workouts</h2>
      <div class="workout-list">
        <div class="workout" v-for="workout in recentWorkouts" :key="workout.id">
          <div class="workout__info">
            <h3 class="workout__name">{{ workout.name }}</h3>
            <p class="workout__meta">{{ workout.date }} • {{ workout.duration }}</p>
          </div>
          <div class="workout__stats">
            <span class="workout__stat">{{ workout.exercises }} exercises</span>
            <span class="workout__stat">{{ workout.volume }} lbs</span>
          </div>
        </div>
      </div>
    </section>

    <section class="motivation">
      <h2 class="motivation__title">💪 Keep Going!</h2>
      <p class="motivation__quote">"The only bad workout is the one that didn't happen."</p>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recentWorkouts = ref([
  { id: 1, name: 'Upper Body Strength', date: 'Today', duration: '45 min', exercises: 6, volume: 3250 },
  { id: 2, name: 'Leg Day', date: 'Yesterday', duration: '60 min', exercises: 5, volume: 5200 },
  { id: 3, name: 'Core & Cardio', date: '2 days ago', duration: '30 min', exercises: 4, volume: 800 },
])
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.home__title {
  margin-bottom: 30px;
  color: #e4e4e7;
}

.home__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.5);
}

.stat-card__value {
  font-size: 2.5em;
  margin: 0 0 10px 0;
}

.stat-card__label {
  margin: 0;
  opacity: 0.9;
}

.home__section {
  margin-bottom: 40px;
}

.home__section-title {
  margin-bottom: 20px;
  color: #e4e4e7;
}

.workout-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.workout {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.workout:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
  border-color: #3f3f46;
}

.workout__info {
  flex: 1;
}

.workout__name {
  margin: 0 0 8px 0;
  color: #e4e4e7;
}

.workout__meta {
  margin: 0;
  color: #a1a1aa;
  font-size: 0.9em;
}

.workout__stats {
  display: flex;
  gap: 20px;
}

.workout__stat {
  color: #a1a1aa;
}

.motivation {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

.motivation__title {
  margin: 0 0 10px 0;
}

.motivation__quote {
  margin: 0;
  font-style: italic;
  font-size: 1.1em;
}
</style>