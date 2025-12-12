<template>
    <div class="social">
        <h1 class="social__title">Activity Feed</h1>

        <div class="feed">
            <article class="post" v-for="post in feedPosts" :key="post.id">
                <header class="post__header">
                    <div class="post__user">
                        <div class="post__avatar">{{ post.user.initials }}</div>
                        <div class="post__user-info">
                            <h3 class="post__user-name">{{ post.user.name }}</h3>
                            <p class="post__time">{{ post.time }}</p>
                        </div>
                    </div>
                </header>

                <div class="post__content">
                    <h2 class="post__title">{{ post.workout.title }}</h2>
                    <div class="post__summary">
                        <span class="post__stat">⏱️ {{ post.workout.duration }}</span>
                        <span class="post__stat">🏋️ {{ post.workout.exercises }} exercises</span>
                        <span class="post__stat">💪 {{ post.workout.volume }} lbs total</span>
                    </div>
                    <p class="post__caption" v-if="post.caption">{{ post.caption }}</p>
                </div>

                <footer class="post__actions">
                    <button :class="['post__button', { 'post__button--active': post.liked }]" @click="toggleLike(post.id)">
                        ❤️ {{ post.likes }}
                    </button>
                    <button class="post__button">
                        💬 {{ post.comments }}
                    </button>
                    <button class="post__button">
                        🔥 Kudos
                    </button>
                </footer>
            </article>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const feedPosts = ref([
    {
        id: 1,
        user: { name: 'Sarah Johnson', initials: 'SJ' },
        time: '2 hours ago',
        workout: {
            title: 'Morning HIIT Session',
            duration: '30 min',
            exercises: 8,
            volume: 2400
        },
        caption: 'Started the day right! Feeling energized 💪',
        likes: 24,
        comments: 5,
        liked: false
    },
    {
        id: 2,
        user: { name: 'Mike Chen', initials: 'MC' },
        time: '5 hours ago',
        workout: {
            title: 'Heavy Deadlift Day',
            duration: '75 min',
            exercises: 4,
            volume: 8900
        },
        caption: 'Hit a new PR! 455 lbs x 3 reps 🔥 Finally broke through that plateau!',
        likes: 67,
        comments: 12,
        liked: true
    },
    {
        id: 3,
        user: { name: 'Emma Davis', initials: 'ED' },
        time: '8 hours ago',
        workout: {
            title: 'Upper Body Pump',
            duration: '50 min',
            exercises: 7,
            volume: 4200
        },
        caption: 'Arms are toast! But that\'s how you know it was a good one 💯',
        likes: 31,
        comments: 8,
        liked: false
    },
    {
        id: 4,
        user: { name: 'James Wilson', initials: 'JW' },
        time: '12 hours ago',
        workout: {
            title: 'Leg Day Massacre',
            duration: '65 min',
            exercises: 6,
            volume: 6800
        },
        caption: 'Squats, lunges, and leg press. Can\'t feel my legs anymore 😅',
        likes: 42,
        comments: 9,
        liked: true
    },
    {
        id: 5,
        user: { name: 'Lisa Martinez', initials: 'LM' },
        time: '1 day ago',
        workout: {
            title: 'Yoga & Stretching',
            duration: '45 min',
            exercises: 12,
            volume: 0
        },
        caption: 'Recovery day done right. Mind and body feeling refreshed 🧘‍♀️',
        likes: 28,
        comments: 4,
        liked: false
    }
])

const toggleLike = (postId) => {
    const post = feedPosts.value.find(p => p.id === postId)
    if (post) {
        post.liked = !post.liked
        post.likes += post.liked ? 1 : -1
    }
}
</script>

<style scoped>
.social {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
}

.social__title {
    margin-bottom: 30px;
    color: #e4e4e7;
}

.feed {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.post {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.post__header {
    margin-bottom: 15px;
}

.post__user {
    display: flex;
    gap: 12px;
    align-items: center;
}

.post__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2em;
    flex-shrink: 0;
}

.post__user-info {
    flex: 1;
}

.post__user-name {
    margin: 0;
    color: #e4e4e7;
    font-size: 1em;
}

.post__time {
    margin: 2px 0 0 0;
    color: #71717a;
    font-size: 0.85em;
}

.post__content {
    margin-bottom: 15px;
}

.post__title {
    margin: 0 0 12px 0;
    color: #e4e4e7;
    font-size: 1.3em;
}

.post__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 12px;
}

.post__stat {
    background: #27272a;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.9em;
    color: #d4d4d8;
}

.post__caption {
    margin: 12px 0 0 0;
    color: #d4d4d8;
    line-height: 1.5;
}

.post__actions {
    display: flex;
    gap: 15px;
    padding-top: 15px;
    border-top: 1px solid #27272a;
}

.post__button {
    background: #27272a;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95em;
    transition: all 0.2s;
    color: #d4d4d8;
}

.post__button:hover {
    background: #3f3f46;
}

.post__button--active {
    background: #ff4444;
    color: white;
}
</style>