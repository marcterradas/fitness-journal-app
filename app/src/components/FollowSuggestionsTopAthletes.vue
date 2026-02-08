<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'

const suggestions = ref([
  { id: 1, name: 'Isabella Cruz', username: 'isabella_cycle', avatar: 'https://i.pravatar.cc/150?u=isabella', following: false },
  { id: 2, name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas', following: false },
  { id: 3, name: 'Charlotte Young', username: 'charlotte_y', avatar: 'https://i.pravatar.cc/150?u=charlotte', following: false },
  { id: 4, name: 'Benjamin Hall', username: 'benji_balance', avatar: 'https://i.pravatar.cc/150?u=benjamin', following: false }
])

function toggleFollow(user) {
  user.following = !user.following
}
</script>

<template>
  <div class="follow-suggestions">
    <div class="follow-suggestions__header">
      <h3 class="follow-suggestions__title">Suggested top athletes</h3>
    </div>

    <div class="follow-suggestions__list">
      <div v-for="user in suggestions" :key="user.id" class="suggestion-item">
        <img :src="user.avatar" :alt="user.name" class="suggestion-item__avatar" />
        <div class="suggestion-item__info">
          <div class="suggestion-item__name">{{ user.name }}</div>
          <div class="suggestion-item__username">@{{ user.username }}</div>
        </div>
        <Button
          :class="['follow-btn', { 'follow-btn--following': user.following }]"
          @click="toggleFollow(user)"
        >
          {{ user.following ? 'Following' : 'Follow' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.follow-suggestions {
  background-color: #222;
  border-radius: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  border: 1px solid #333;
}

.follow-suggestions__title {
  margin: 0 0 0.75rem 0;
  color: #ccc;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-top: 1px solid transparent;
}

.suggestion-item + .suggestion-item {
  border-top: 1px solid #2b2b2b;
}

.suggestion-item__avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
}

.suggestion-item__info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.suggestion-item__name {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
}

.suggestion-item__username {
  color: #888;
  font-size: 0.85rem;
}

.follow-btn {
  padding: 0.4rem 0.8rem;
  background-color: #1976d2;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
}

.follow-btn--following {
  background-color: #333;
  color: #ddd;
}

@media (min-width: 900px) {
  .follow-suggestions {
    max-width: 320px;
    padding: 0.75rem;
  }

  .follow-suggestions__title {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .suggestion-item {
    gap: 0.5rem;
    padding: 0.4rem 0;
  }

  .suggestion-item__avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 1px;
  }

  .suggestion-item__name {
    font-size: 0.95rem;
  }

  .suggestion-item__username {
    font-size: 0.8rem;
  }

  .follow-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.9rem;
  }
}
</style>