<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: 'https://i.pravatar.cc?u=placeholder'
  },
  workoutCount: {
    type: Number,
    default: 0
  },
  followerCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="user-profile">
    <div class="user-profile__header">
      <img :src="avatarUrl" :alt="username" class="user-profile__avatar" />
      <h2 class="user-profile__name">{{ name }}</h2>
      <p class="user-profile__username">@{{ username }}</p>
    </div>

    <div class="user-profile__stats">
      <div class="user-profile__stat-item">
        <span class="user-profile__stat-value">{{ workoutCount }}</span>
        <span class="user-profile__stat-label">Workouts</span>
      </div>
      <div class="user-profile__stat-item">
        <span class="user-profile__stat-value">{{ followerCount }}</span>
        <span class="user-profile__stat-label">Followers</span>
      </div>
      <div class="user-profile__stat-item">
        <span class="user-profile__stat-value">{{ followingCount }}</span>
        <span class="user-profile__stat-label">Following</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  background-color: #222;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.user-profile__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-profile__avatar {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #333;
}

.user-profile__name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.25rem;
}

.user-profile__username {
  font-size: 1rem;
  color: #888;
}

.user-profile__stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #333;
  padding-top: 1.5rem;
}

.user-profile__stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.user-profile__stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
}

.user-profile__stat-label {
  font-size: 0.875rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>