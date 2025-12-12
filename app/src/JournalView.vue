<template>
  <div class="journal">
    <div class="journal__header">
      <h1 class="journal__title">Workout Journal</h1>
      <button class="journal__add-button">+ New Workout</button>
    </div>

    <div class="journal__entries">
      <article class="entry" v-for="entry in journalEntries" :key="entry.id">
        <header class="entry__header">
          <div class="entry__info">
            <h2 class="entry__title">{{ entry.title }}</h2>
            <p class="entry__meta">{{ entry.date }} • {{ entry.duration }}</p>
          </div>
          <span class="entry__badge">{{ entry.type }}</span>
        </header>
        
        <div class="entry__exercises">
          <div class="exercise" v-for="exercise in entry.exercises" :key="exercise.name">
            <h3 class="exercise__name">{{ exercise.name }}</h3>
            <div class="exercise__sets">
              <span v-for="(set, idx) in exercise.sets" :key="idx" class="exercise__set">
                {{ set.reps }} reps @ {{ set.weight }} lbs
              </span>
            </div>
          </div>
        </div>

        <footer class="entry__notes" v-if="entry.notes">
          <p class="entry__notes-text"><strong>Notes:</strong> {{ entry.notes }}</p>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const journalEntries = ref([
  {
    id: 1,
    title: 'Upper Body Strength',
    date: 'Dec 12, 2025',
    duration: '45 min',
    type: 'Strength',
    exercises: [
      { 
        name: 'Bench Press', 
        sets: [
          { reps: 8, weight: 185 },
          { reps: 8, weight: 185 },
          { reps: 6, weight: 195 }
        ]
      },
      { 
        name: 'Dumbbell Rows', 
        sets: [
          { reps: 10, weight: 70 },
          { reps: 10, weight: 70 },
          { reps: 8, weight: 75 }
        ]
      },
      { 
        name: 'Shoulder Press', 
        sets: [
          { reps: 10, weight: 95 },
          { reps: 10, weight: 95 },
          { reps: 8, weight: 95 }
        ]
      }
    ],
    notes: 'Felt strong today! Increased weight on bench press last set.'
  },
  {
    id: 2,
    title: 'Leg Day',
    date: 'Dec 11, 2025',
    duration: '60 min',
    type: 'Strength',
    exercises: [
      { 
        name: 'Back Squats', 
        sets: [
          { reps: 5, weight: 225 },
          { reps: 5, weight: 245 },
          { reps: 5, weight: 265 },
          { reps: 3, weight: 275 }
        ]
      },
      { 
        name: 'Romanian Deadlifts', 
        sets: [
          { reps: 8, weight: 185 },
          { reps: 8, weight: 185 },
          { reps: 8, weight: 185 }
        ]
      },
      { 
        name: 'Leg Press', 
        sets: [
          { reps: 12, weight: 360 },
          { reps: 12, weight: 360 },
          { reps: 10, weight: 380 }
        ]
      }
    ],
    notes: 'Hit a new PR on squats! 275x3 💪'
  },
  {
    id: 3,
    title: 'Core & Cardio',
    date: 'Dec 10, 2025',
    duration: '30 min',
    type: 'Cardio',
    exercises: [
      { 
        name: 'Treadmill Run', 
        sets: [{ reps: '20 min', weight: 0 }]
      },
      { 
        name: 'Plank', 
        sets: [
          { reps: '60 sec', weight: 0 },
          { reps: '60 sec', weight: 0 },
          { reps: '45 sec', weight: 0 }
        ]
      },
      { 
        name: 'Russian Twists', 
        sets: [
          { reps: 20, weight: 25 },
          { reps: 20, weight: 25 },
          { reps: 20, weight: 25 }
        ]
      }
    ],
    notes: 'Good recovery day. Felt refreshed after the run.'
  }
])
</script>

<style scoped>
.journal {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.journal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.journal__title {
  margin: 0;
  color: #e4e4e7;
}

.journal__add-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: transform 0.2s;
}

.journal__add-button:hover {
  transform: translateY(-2px);
}

.journal__entries {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.entry {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.entry__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #27272a;
}

.entry__info {
  flex: 1;
}

.entry__title {
  margin: 0 0 8px 0;
  color: #e4e4e7;
}

.entry__meta {
  margin: 0;
  color: #a1a1aa;
  font-size: 0.9em;
}

.entry__badge {
  background: #667eea;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.entry__exercises {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.exercise__name {
  margin: 0 0 10px 0;
  color: #e4e4e7;
  font-size: 1.1em;
}

.exercise__sets {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.exercise__set {
  background: #27272a;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9em;
  color: #d4d4d8;
}

.entry__notes {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #27272a;
}

.entry__notes-text {
  margin: 0;
  color: #a1a1aa;
  font-style: italic;
}
</style>