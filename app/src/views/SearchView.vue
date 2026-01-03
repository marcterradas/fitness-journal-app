<script setup>
import { ref, computed } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import Input from '@/components/Input.vue';

const searchQuery = ref('');
const activeFilter = ref('All');

const filters = ['All', 'Dips', 'Bench Press', 'Squats', 'Pull Ups', 'Deadlift', 'Running'];

const allResults = [
    {
        id: 1,
        title: 'Upper Body Power',
        date: '2 days ago',
        duration: '45 min',
        exercises: ['Bench Press', 'Dips', 'Tricep Extensions'],
        calories: 320
    },
    {
        id: 2,
        title: 'Leg Day Destruction',
        date: '3 days ago',
        duration: '60 min',
        exercises: ['Squats', 'Leg Press', 'Calf Raises'],
        calories: 450
    },
    {
        id: 3,
        title: 'Morning Cardio',
        date: 'Yesterday',
        duration: '30 min',
        exercises: ['Running', 'Stretching'],
        calories: 280
    },
    {
        id: 4,
        title: 'Full Body Circuit',
        date: '1 week ago',
        duration: '50 min',
        exercises: ['Deadlift', 'Pull Ups', 'Push Ups', 'Plank'],
        calories: 380
    },
    {
        id: 5,
        title: 'Chest & Triceps',
        date: '4 days ago',
        duration: '55 min',
        exercises: ['Bench Press', 'Incline Dumbbell Press', 'Dips'],
        calories: 340
    },
    {
        id: 6,
        title: 'Back & Biceps',
        date: '5 days ago',
        duration: '50 min',
        exercises: ['Pull Ups', 'Rows', 'Bicep Curls'],
        calories: 310
    }
];

const filteredResults = computed(() => {
    return allResults.filter(item => {
        const matchesFilter = activeFilter.value === 'All' || item.exercises.some(ex => ex.toLowerCase() === activeFilter.value.toLowerCase());
        const query = searchQuery.value.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(query) || 
                              item.exercises.some(ex => ex.toLowerCase().includes(query));
        return matchesFilter && matchesSearch;
    });
});

function setFilter(filter) {
    activeFilter.value = filter;
}
</script>

<template>
    <div class="search-view">
        <SectionTitle>Search</SectionTitle>
        <div class="search-container">
            <Input 
                id="search-input" 
                v-model="searchQuery" 
                placeholder="Search workouts, exercises..." 
            />
        </div>
        <div class="filters-container">
            <button 
                v-for="filter in filters" 
                :key="filter"
                class="filter-chip"
                :class="{ 'filter-chip--active': activeFilter === filter }"
                @click="setFilter(filter)"
            >
                {{ filter }}
            </button>
        </div>
        <div class="results-container">
            <div v-if="filteredResults.length > 0" class="results-list">
                <div v-for="result in filteredResults" :key="result.id" class="result-card">
                    <div class="result-card__header">
                        <h3 class="result-card__title">{{ result.title }}</h3>
                        <span class="result-card__date">{{ result.date }}</span>
                    </div>
                    <div class="result-card__details">
                        <span>⏱ {{ result.duration }}</span>
                        <span>🔥 {{ result.calories }} kcal</span>
                    </div>
                    <div class="result-card__tags">
                        <span v-for="ex in result.exercises" :key="ex" class="exercise-tag">
                            {{ ex }}
                        </span>
                    </div>
                </div>
            </div>
            <div v-else class="no-results">
                <p>No results found for "{{ searchQuery }}" with filter "{{ activeFilter }}"</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2rem;
}

.search-container {
    width: 100%;
}

.filters-container {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.filters-container::-webkit-scrollbar {
    display: none;
}

.filter-chip {
    background-color: #333;
    color: #aaa;
    border: 1px solid #444;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.filter-chip:hover {
    background-color: #444;
    color: #fff;
}

.filter-chip--active {
    background-color: #1976d2;
    color: white;
    border-color: #1976d2;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.result-card {
    background-color: #222;
    border-radius: 1rem;
    padding: 1.25rem;
    border: 1px solid #333;
    transition: transform 0.2s;
}

.result-card:hover {
    transform: translateY(-2px);
    border-color: #444;
}

.result-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.result-card__title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
    margin: 0;
}

.result-card__date {
    font-size: 0.8rem;
    color: #888;
}

.result-card__details {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #ccc;
    margin-bottom: 1rem;
}

.result-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.exercise-tag {
    background-color: #333;
    color: #ddd;
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
}

.no-results {
    text-align: center;
    color: #666;
    margin-top: 2rem;
    font-size: 1.1rem;
}
</style>