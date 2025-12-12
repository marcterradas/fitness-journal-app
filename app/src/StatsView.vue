<template>
    <div class="stats">
        <h1 class="stats__title">Your Statistics</h1>

        <div class="stats__filter">
            <button 
                v-for="period in timePeriods" 
                :key="period"
                :class="['stats__filter-button', { 'stats__filter-button--active': selectedPeriod === period }]"
                @click="selectedPeriod = period"
            >
                {{ period }}
            </button>
        </div>

        <div class="stats__grid">
            <div class="stat-card">
                <h3 class="stat-card__label">Total Workouts</h3>
                <p class="stat-card__value">47</p>
                <span class="stat-card__change stat-card__change--positive">+8 from last month</span>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__label">Total Volume</h3>
                <p class="stat-card__value">156k lbs</p>
                <span class="stat-card__change stat-card__change--positive">+12% from last month</span>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__label">Avg. Duration</h3>
                <p class="stat-card__value">52 min</p>
                <span class="stat-card__change stat-card__change--neutral">Same as last month</span>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__label">Calories Burned</h3>
                <p class="stat-card__value">18,450</p>
                <span class="stat-card__change stat-card__change--positive">+15% from last month</span>
            </div>
        </div>

        <section class="stats__section">
            <h2 class="stats__section-title">Workout Frequency</h2>
            <div class="chart">
                <div class="chart__bars">
                    <div v-for="day in weeklyData" :key="day.day" class="chart__bar-wrapper">
                        <div class="chart__bar" :style="{ height: day.value * 20 + 'px' }">
                            <span class="chart__bar-label">{{ day.value }}</span>
                        </div>
                        <span class="chart__bar-day">{{ day.day }}</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="stats__section">
            <h2 class="stats__section-title">Exercise Progress</h2>
            <div class="progress-list">
                <div class="progress" v-for="exercise in exerciseProgress" :key="exercise.name">
                    <div class="progress__header">
                        <h3 class="progress__name">{{ exercise.name }}</h3>
                        <span class="progress__value">{{ exercise.current }} lbs</span>
                    </div>
                    <div class="progress__bar">
                        <div 
                            class="progress__fill" 
                            :style="{ width: (exercise.current / exercise.goal * 100) + '%' }"
                        ></div>
                    </div>
                    <div class="progress__footer">
                        <span class="progress__label">Start: {{ exercise.start }} lbs</span>
                        <span class="progress__label">Goal: {{ exercise.goal }} lbs</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="stats__section">
            <h2 class="stats__section-title">Muscle Group Distribution</h2>
            <div class="muscle-grid">
                <div v-for="muscle in muscleGroups" :key="muscle.name" class="muscle">
                    <div class="muscle__circle" :style="{ background: muscle.color }">
                        <span class="muscle__percentage">{{ muscle.percentage }}%</span>
                    </div>
                    <p class="muscle__name">{{ muscle.name }}</p>
                    <span class="muscle__count">{{ muscle.workouts }} workouts</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const timePeriods = ['Week', 'Month', 'Year']
const selectedPeriod = ref('Month')

const weeklyData = ref([
    { day: 'Mon', value: 2 },
    { day: 'Tue', value: 1 },
    { day: 'Wed', value: 2 },
    { day: 'Thu', value: 1 },
    { day: 'Fri', value: 2 },
    { day: 'Sat', value: 1 },
    { day: 'Sun', value: 0 }
])

const exerciseProgress = ref([
    { name: 'Bench Press', start: 185, current: 225, goal: 250 },
    { name: 'Squat', start: 225, current: 315, goal: 350 },
    { name: 'Deadlift', start: 315, current: 405, goal: 450 },
    { name: 'Overhead Press', start: 115, current: 155, goal: 185 }
])

const muscleGroups = ref([
    { name: 'Chest', percentage: 22, workouts: 12, color: '#667eea' },
    { name: 'Back', percentage: 20, workouts: 11, color: '#764ba2' },
    { name: 'Legs', percentage: 25, workouts: 14, color: '#f093fb' },
    { name: 'Shoulders', percentage: 15, workouts: 8, color: '#4facfe' },
    { name: 'Arms', percentage: 12, workouts: 7, color: '#43e97b' },
    { name: 'Core', percentage: 6, workouts: 3, color: '#fa709a' }
])
</script>

<style scoped>
.stats {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.stats__title {
    margin-bottom: 30px;
    color: #e4e4e7;
}

.stats__filter {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}

.stats__filter-button {
    background: #18181b;
    border: 2px solid #27272a;
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    color: #a1a1aa;
    transition: all 0.3s;
}

.stats__filter-button:hover {
    border-color: #667eea;
}

.stats__filter-button--active {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

.stats__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: #18181b;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    border: 1px solid #27272a;
}

.stat-card__label {
    margin: 0 0 15px 0;
    color: #a1a1aa;
    font-size: 0.9em;
    font-weight: 600;
    text-transform: uppercase;
}

.stat-card__value {
    margin: 0 0 10px 0;
    font-size: 2.5em;
    font-weight: bold;
    color: #e4e4e7;
}

.stat-card__change {
    font-size: 0.85em;
}

.stat-card__change--positive {
    color: #43e97b;
}

.stat-card__change--neutral {
    color: #71717a;
}

.stats__section {
    background: #18181b;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    margin-bottom: 30px;
    border: 1px solid #27272a;
}

.stats__section-title {
    margin: 0 0 25px 0;
    color: #e4e4e7;
}

.chart__bars {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 200px;
    padding: 20px 0;
    border-bottom: 2px solid #27272a;
}

.chart__bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.chart__bar {
    width: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px 8px 0 0;
    position: relative;
    min-height: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 8px;
}

.chart__bar-label {
    color: white;
    font-weight: bold;
    font-size: 0.9em;
}

.chart__bar-day {
    color: #a1a1aa;
    font-size: 0.9em;
    font-weight: 600;
}

.progress-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.progress__name {
    margin: 0;
    color: #e4e4e7;
}

.progress__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.progress__value {
    font-weight: bold;
    color: #667eea;
    font-size: 1.1em;
}

.progress__bar {
    height: 12px;
    background: #27272a;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress__fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.5s ease;
}

.progress__footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.85em;
}

.progress__label {
    color: #71717a;
}

.muscle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 25px;
}

.muscle {
    text-align: center;
}

.muscle__circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-weight: bold;
    color: white;
}

.muscle__percentage {
    font-size: 1.5em;
}

.muscle__name {
    margin: 0 0 5px 0;
    font-weight: 600;
    color: #e4e4e7;
}

.muscle__count {
    font-size: 0.85em;
    color: #71717a;
}
</style>