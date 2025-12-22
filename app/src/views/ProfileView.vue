<template>
    <div class="profile">
        <header class="profile__header">
            <div class="profile__avatar">{{ user.initials }}</div>
            <div class="profile__info">
                <h1 class="profile__name">{{ user.name }}</h1>
                <p class="profile__username">@{{ user.username }}</p>
                <p class="profile__bio">{{ user.bio }}</p>
            </div>
            <button class="profile__edit-button">Edit Profile</button>
        </header>

        <div class="profile__stats">
            <div class="stat-card">
                <h3 class="stat-card__value">{{ user.stats.totalWorkouts }}</h3>
                <p class="stat-card__label">Total Workouts</p>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__value">{{ user.stats.followers }}</h3>
                <p class="stat-card__label">Followers</p>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__value">{{ user.stats.following }}</h3>
                <p class="stat-card__label">Following</p>
            </div>
            <div class="stat-card">
                <h3 class="stat-card__value">{{ user.stats.currentStreak }}</h3>
                <p class="stat-card__label">Day Streak 🔥</p>
            </div>
        </div>

        <section class="profile__section">
            <h2 class="profile__section-title">🏆 Achievements</h2>
            <div class="achievement-grid">
                <div class="achievement" v-for="achievement in achievements" :key="achievement.id">
                    <span class="achievement__icon">{{ achievement.icon }}</span>
                    <h3 class="achievement__title">{{ achievement.title }}</h3>
                    <p class="achievement__description">{{ achievement.description }}</p>
                    <span class="achievement__date">{{ achievement.date }}</span>
                </div>
            </div>
        </section>

        <section class="profile__section">
            <h2 class="profile__section-title">💪 Personal Records</h2>
            <div class="pr-list">
                <div class="pr" v-for="pr in personalRecords" :key="pr.exercise">
                    <div class="pr__info">
                        <h3 class="pr__name">{{ pr.exercise }}</h3>
                        <p class="pr__weight">{{ pr.weight }} lbs</p>
                    </div>
                    <span class="pr__date">{{ pr.date }}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({
    name: 'Alex Rodriguez',
    username: 'alex_fitness',
    initials: 'AR',
    bio: '🏋️ Fitness enthusiast | 💪 Powerlifting | 🥗 Clean eating advocate | Sharing my journey to inspire others',
    stats: {
        totalWorkouts: 342,
        followers: 1247,
        following: 389,
        currentStreak: 23
    }
})

const achievements = ref([
    { 
        id: 1, 
        icon: '🔥', 
        title: '3 Week Streak', 
        description: 'Worked out for 21 days straight',
        date: 'Earned today'
    },
    { 
        id: 2, 
        icon: '🎯', 
        title: '100 Workouts', 
        description: 'Completed 100 total workouts',
        date: 'Nov 15, 2025'
    },
    { 
        id: 3, 
        icon: '⚡', 
        title: 'Early Bird', 
        description: 'Completed 20 morning workouts',
        date: 'Oct 28, 2025'
    },
    { 
        id: 4, 
        icon: '💎', 
        title: 'Consistency King', 
        description: 'Worked out 5 days a week for a month',
        date: 'Oct 1, 2025'
    }
])

const personalRecords = ref([
    { exercise: 'Bench Press', weight: 225, date: 'Dec 5, 2025' },
    { exercise: 'Squat', weight: 315, date: 'Dec 11, 2025' },
    { exercise: 'Deadlift', weight: 405, date: 'Nov 22, 2025' },
    { exercise: 'Overhead Press', weight: 155, date: 'Nov 30, 2025' }
])
</script>

<style scoped>
.profile {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.profile__header {
    display: flex;
    gap: 30px;
    align-items: flex-start;
    margin-bottom: 40px;
    background: #18181b;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    border: 1px solid #27272a;
}

.profile__avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
}

.profile__info {
    flex: 1;
}

.profile__name {
    margin: 0 0 5px 0;
    color: #e4e4e7;
}

.profile__username {
    margin: 0 0 15px 0;
    color: #667eea;
    font-weight: 600;
}

.profile__bio {
    margin: 0;
    color: #a1a1aa;
    line-height: 1.6;
}

.profile__edit-button {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.profile__edit-button:hover {
    background: #667eea;
    color: white;
}

.profile__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: #18181b;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    border: 1px solid #27272a;
}

.stat-card__value {
    font-size: 2.5em;
    margin: 0 0 10px 0;
    color: #667eea;
}

.stat-card__label {
    margin: 0;
    color: #a1a1aa;
}

.profile__section {
    margin-bottom: 40px;
}

.profile__section-title {
    margin-bottom: 20px;
    color: #e4e4e7;
}

.achievement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

.achievement {
    background: #18181b;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    text-align: center;
    border: 1px solid #27272a;
}

.achievement__icon {
    font-size: 3em;
    display: block;
    margin-bottom: 10px;
}

.achievement__title {
    margin: 0 0 8px 0;
    color: #e4e4e7;
}

.achievement__description {
    margin: 0 0 10px 0;
    color: #a1a1aa;
    font-size: 0.9em;
}

.achievement__date {
    color: #71717a;
    font-size: 0.85em;
}

.pr-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.pr {
    background: #18181b;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #27272a;
}

.pr__info {
    flex: 1;
}

.pr__name {
    margin: 0 0 5px 0;
    color: #e4e4e7;
}

.pr__weight {
    margin: 0;
    font-size: 1.3em;
    font-weight: bold;
    color: #667eea;
}

.pr__date {
    color: #71717a;
    font-size: 0.9em;
}
</style>