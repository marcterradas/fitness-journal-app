<script setup>
import { ref } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import { useTimer } from '@/composables/useTimer';
const REST_TIME_SECONDS = 5 * 60;

const exercise = ref({
    name: 'Bench Press',
    sets: [
        { id: 1, weight: 100, reps: 10, completed: false },
        { id: 2, weight: 95, reps: 12, completed: false }
    ]
});

const activeRestIndex = ref(null);
const { 
    formattedTime, 
    isActive: isTimerActive, 
    start: startTimer, 
    stop: stopTimer, 
    reset: resetTimer,
    toggle: toggleTimer 
} = useTimer(REST_TIME_SECONDS);

function handleSetToggle(index) {
    const set = exercise.value.sets[index];
    set.completed = !set.completed;

    if (set.completed) {
        // If this is not the last set, activate the rest timer following this set.
        if (index < exercise.value.sets.length - 1) {
            activateRest(index);
        }
    } else {
        // If we uncheck the set that is currently triggering the active rest, stop it.
        if (activeRestIndex.value === index) {
            stopTimer();
            activeRestIndex.value = null;
        }
    }
}

function activateRest(index) {
    activeRestIndex.value = index;
    resetTimer(REST_TIME_SECONDS);
    startTimer();
}

function formatRestTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
</script>

<template>
    <div class="workout-view">
        <SectionTitle>Workout</SectionTitle>

        <div class="exercise-card">
            <h2 class="exercise-card__title">{{ exercise.name }}</h2>
            
            <div class="timeline">
                <div 
                    v-for="(set, index) in exercise.sets" 
                    :key="set.id" 
                    class="timeline__group"
                >
                    <div 
                        class="workout-set" 
                        :class="{ 'workout-set--completed': set.completed }"
                        @click="handleSetToggle(index)"
                    >
                        <div class="workout-set__indicator">
                            <span class="workout-set__number">{{ index + 1 }}</span>
                            <div class="workout-set__checkbox">
                                <span v-if="set.completed">✓</span>
                            </div>
                        </div>
                        <div class="workout-set__details">
                            <div class="workout-set__stat">
                                <span class="workout-set__value">{{ set.weight }}</span>
                                <span class="workout-set__label">kg</span>
                            </div>
                            <div class="workout-set__stat">
                                <span class="workout-set__value">{{ set.reps }}</span>
                                <span class="workout-set__label">reps</span>
                            </div>
                        </div>
                        <div>
                            <img src="/camera.svg" alt="Record Set" width="25" height="25" />
                        </div>
                    </div>
                    <div v-if="index < exercise.sets.length - 1" class="timeline__connector">
                        <div class="timeline__line"></div>
                        <div 
                            class="rest-timer" 
                            :class="{ 'rest-timer--active': activeRestIndex === index }"
                        >
                            <div class="rest-timer__content">
                                <span class="rest-timer__icon">⏱</span>
                                <span class="rest-timer__time">
                                    {{ activeRestIndex === index ? formattedTime : formatRestTime(REST_TIME_SECONDS) }}
                                </span>
                            </div>
                            <div v-if="activeRestIndex === index" class="rest-timer__controls">
                                <button class="rest-timer__btn" @click.stop="toggleTimer">
                                    {{ isTimerActive ? 'Pause' : 'Resume' }}
                                </button>
                                <button class="rest-timer__btn" @click.stop="resetTimer(REST_TIME_SECONDS)">
                                    Reset
                                </button>
                            </div>
                        </div>
                        <div class="timeline__line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.workout-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
}

.exercise-card {
    background-color: #222;
    border-radius: 1rem;
    padding: 1.5rem;
}

.exercise-card__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #fff;
    padding-left: 0.5rem;
}

.timeline {
    display: flex;
    flex-direction: column;
}

.timeline__group {
    display: flex;
    flex-direction: column;
}

.timeline__connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 4rem;
}

.timeline__line {
    width: 2px;
    background-color: #444;
    flex-grow: 1;
    min-height: 1rem;
}

.workout-set {
    display: flex;
    align-items: center;
    background-color: #333;
    border-radius: 0.75rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    position: relative;
    z-index: 1;
}

.workout-set:hover {
    background-color: #3a3a3a;
}

.workout-set--completed {
    background-color: #1b3320;
    border-color: #2e7d32;
}

.workout-set__indicator {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-right: 2rem;
}

.workout-set__number {
    font-size: 0.9rem;
    color: #888;
    font-weight: bold;
    width: 1.5rem;
}

.workout-set__checkbox {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 2px solid #666;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.workout-set--completed .workout-set__checkbox {
    background-color: #2e7d32;
    border-color: #2e7d32;
}

.workout-set__details {
    display: flex;
    gap: 2rem;
    flex-grow: 1;
    justify-content: space-around;
}

.workout-set__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.workout-set__value {
    font-size: 1.25rem;
    font-weight: bold;
    color: #fff;
}

.workout-set__label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #888;
    margin-top: 0.25rem;
}

.rest-timer {
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin: 0.5rem 0;
}

.rest-timer--active {
    background-color: #1976d2;
    border-color: #1976d2;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.rest-timer__content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.rest-timer__icon {
    font-size: 1rem;
}

.rest-timer__time {
    font-family: monospace;
    font-size: 1rem;
    font-weight: bold;
    color: #ccc;
}

.rest-timer--active .rest-timer__time {
    color: #fff;
    font-size: 1.5rem;
}

.rest-timer__controls {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.rest-timer__btn {
    background-color: rgba(0, 0, 0, 0.2);
    border: none;
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.rest-timer__btn:hover {
    background-color: rgba(0, 0, 0, 0.4);
}
</style>