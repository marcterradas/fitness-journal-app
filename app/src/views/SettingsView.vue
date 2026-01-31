<script setup>
import { ref } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const settings = ref({
    notifications: {
        push: true,
        email: false,
        workoutReminders: true
    },
    privacy: {
        profileVisible: true,
        showWorkouts: true
    },
    display: {
        darkMode: true,
        compactView: false
    }
});

function toggleSetting(category, key) {
    settings.value[category][key] = !settings.value[category][key];
}

function handleLogout() {
    router.push('/login');
}
</script>

<template>
    <div class="settings-view">
        <SectionTitle>Settings</SectionTitle>

        <div class="settings-section">
            <h2 class="settings-section__title">Notifications</h2>
            <div class="settings-list">
                <div class="setting-item" @click="toggleSetting('notifications', 'push')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Push Notifications</span>
                        <span class="setting-item__description">Receive push notifications for updates</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.notifications.push }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>

                <div class="setting-item" @click="toggleSetting('notifications', 'email')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Email Notifications</span>
                        <span class="setting-item__description">Receive email updates</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.notifications.email }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>

                <div class="setting-item" @click="toggleSetting('notifications', 'workoutReminders')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Workout Reminders</span>
                        <span class="setting-item__description">Get reminders for scheduled workouts</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.notifications.workoutReminders }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h2 class="settings-section__title">Privacy</h2>
            <div class="settings-list">
                <div class="setting-item" @click="toggleSetting('privacy', 'profileVisible')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Public Profile</span>
                        <span class="setting-item__description">Make your profile visible to others</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.privacy.profileVisible }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>

                <div class="setting-item" @click="toggleSetting('privacy', 'showWorkouts')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Show Workouts</span>
                        <span class="setting-item__description">Display your workouts to followers</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.privacy.showWorkouts }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h2 class="settings-section__title">Display</h2>
            <div class="settings-list">
                <div class="setting-item" @click="toggleSetting('display', 'darkMode')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Dark Mode</span>
                        <span class="setting-item__description">Use dark theme</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.display.darkMode }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>

                <div class="setting-item" @click="toggleSetting('display', 'compactView')">
                    <div class="setting-item__info">
                        <span class="setting-item__label">Compact View</span>
                        <span class="setting-item__description">Show more content on screen</span>
                    </div>
                    <div class="setting-item__toggle" :class="{ 'setting-item__toggle--active': settings.display.compactView }">
                        <div class="setting-item__toggle-thumb"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h2 class="settings-section__title">Account</h2>
            <div class="settings-list">
                <button class="setting-button setting-button--danger" @click="handleLogout">
                    Log Out
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding-bottom: 2rem;
}

.settings-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.settings-section__title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.9rem;
    margin: 0;
}

.settings-list {
    background-color: #222;
    border-radius: 1rem;
    overflow: hidden;
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    border-bottom: 1px solid #333;
    cursor: pointer;
    transition: background-color 0.2s;
}

.setting-item:last-child {
    border-bottom: none;
}

.setting-item:hover {
    background-color: #2a2a2a;
}

.setting-item__info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.setting-item__label {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
}

.setting-item__description {
    font-size: 0.85rem;
    color: #888;
}

.setting-item__toggle {
    width: 3rem;
    height: 1.75rem;
    background-color: #444;
    border-radius: 1rem;
    position: relative;
    transition: background-color 0.3s;
    flex-shrink: 0;
}

.setting-item__toggle--active {
    background-color: #1976d2;
}

.setting-item__toggle-thumb {
    width: 1.25rem;
    height: 1.25rem;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    transition: transform 0.3s;
}

.setting-item__toggle--active .setting-item__toggle-thumb {
    transform: translateX(1.25rem);
}

.setting-button {
    width: 100%;
    padding: 1rem;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 0;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: left;
}

.setting-button:hover {
    background-color: #3a3a3a;
}

.setting-button--danger {
    color: #f44336;
}

.setting-button--danger:hover {
    background-color: #3a1a1a;
}
</style>