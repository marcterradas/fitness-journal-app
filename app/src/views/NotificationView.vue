<script setup>
import { ref } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';

const notifications = ref([
    {
        id: 1,
        type: 'like',
        user: 'Alice Johnson',
        avatar: 'https://i.pravatar.cc/150?u=alice',
        action: 'liked your workout',
        content: 'Upper Body Power',
        time: '5 minutes ago',
        read: false
    },
    {
        id: 2,
        type: 'comment',
        user: 'Coach Mike',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        action: 'commented on your post',
        content: 'Great form on those squats! Keep it up.',
        time: '1 hour ago',
        read: false
    },
    {
        id: 3,
        type: 'follow',
        user: 'Sarah Fit',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        action: 'started following you',
        content: null,
        time: '2 hours ago',
        read: true
    },
    {
        id: 4,
        type: 'achievement',
        user: null,
        avatar: null,
        action: 'You completed 5 workouts this week!',
        content: '🎉 Keep up the great work!',
        time: 'Yesterday',
        read: true
    },
    {
        id: 5,
        type: 'message',
        user: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?u=john',
        action: 'sent you a message',
        content: 'Hey, want to hit the gym tomorrow?',
        time: 'Yesterday',
        read: true
    },
    {
        id: 6,
        type: 'like',
        user: 'Emma Wilson',
        avatar: 'https://i.pravatar.cc/150?u=emma',
        action: 'liked your workout',
        content: 'Leg Day Destruction',
        time: '2 days ago',
        read: true
    }
]);

function getNotificationIcon(type) {
    switch (type) {
        case 'like':
            return '❤️';
        case 'comment':
            return '💬';
        case 'follow':
            return '👤';
        case 'achievement':
            return '🏆';
        case 'message':
            return '✉️';
        default:
            return '🔔';
    }
}

function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
        notification.read = true;
    }
}

function markAllAsRead() {
    notifications.value.forEach(n => n.read = true);
}
</script>

<template>
    <div class="notification-view">
        <div class="notification-header">
            <SectionTitle>Notifications</SectionTitle>
            <button class="mark-all-btn" @click="markAllAsRead">
                Mark all as read
            </button>
        </div>

        <div class="notifications-list">
            <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-item"
                :class="{ 'notification-item--unread': !notification.read }"
                @click="markAsRead(notification.id)"
            >
                <div class="notification-item__icon">
                    <img 
                        v-if="notification.avatar" 
                        :src="notification.avatar" 
                        :alt="notification.user"
                        class="notification-item__avatar"
                    />
                    <span v-else class="notification-item__emoji">
                        {{ getNotificationIcon(notification.type) }}
                    </span>
                </div>
                
                <div class="notification-item__content">
                    <div class="notification-item__text">
                        <span v-if="notification.user" class="notification-item__user">
                            {{ notification.user }}
                        </span>
                        <span class="notification-item__action">
                            {{ notification.action }}
                        </span>
                    </div>
                    
                    <p v-if="notification.content" class="notification-item__details">
                        {{ notification.content }}
                    </p>
                    
                    <span class="notification-item__time">{{ notification.time }}</span>
                </div>
                
                <div v-if="!notification.read" class="notification-item__badge"></div>
            </div>
        </div>

        <div v-if="notifications.length === 0" class="no-notifications">
            <p>You have no new notifications.</p>
        </div>
    </div>
</template>

<style scoped>
.notification-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.mark-all-btn {
    background: none;
    border: none;
    color: #1976d2;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.5rem;
    white-space: nowrap;
    transition: color 0.2s;
}

.mark-all-btn:hover {
    color: #1565c0;
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: #222;
    border-radius: 1rem;
    padding: 1rem;
    border: 1px solid #333;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.notification-item:hover {
    background-color: #2a2a2a;
    border-color: #444;
}

.notification-item--unread {
    background-color: #1a2332;
    border-color: #1976d2;
}

.notification-item__icon {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-item__avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.notification-item__emoji {
    font-size: 2rem;
}

.notification-item__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.notification-item__text {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    color: #fff;
    font-size: 1rem;
    line-height: 1.4;
}

.notification-item__user {
    font-weight: bold;
}

.notification-item__action {
    color: #ccc;
}

.notification-item__details {
    color: #aaa;
    font-size: 0.9rem;
    margin: 0;
}

.notification-item__time {
    font-size: 0.8rem;
    color: #666;
}

.notification-item__badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #1976d2;
    border-radius: 50%;
}

.no-notifications {
    text-align: center;
    color: #666;
    margin-top: 2rem;
    font-size: 1.1rem;
    padding: 2rem;
    background-color: #222;
    border-radius: 1rem;
}
</style>