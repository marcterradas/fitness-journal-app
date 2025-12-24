<script setup>
// TODO: fetch post data from API.
const username = "Marc";
const avatarUrl = "https://i.pravatar.cc?u=placeholder";
const content = "Just finished a great workout! 💪";
</script>

<template>
  <div class="post">
    <div class="post__header">
      <img :src="avatarUrl" alt="User Avatar" class="post__avatar" />
      <span class="post__username">{{ username }}</span>
    </div>
      <p class="post__content">{{ content }}</p>
    <div class="post__footer">
      <button class="post__action-btn">
        <img class="post__action-icon" src="/heart.svg" alt="Like" />
      </button>
      <button class="post__action-btn">
        <img class="post__action-icon" src="/message.svg" alt="Comment" />
      </button>
      <button class="post__action-btn">
        <img class="post__action-icon" src="/send.svg" alt="Share" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.post {
  background-color: #222;
  border-radius: 1rem;
  padding: 1rem;
  width: 100%;
}

.post__header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.post__avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.post__username {
  font-weight: bold;
  color: #fff;
  font-size: 1.25rem;
}

.post__content {
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.25rem;
}

.post__footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #333;
  padding-top: 0.5rem;
  gap: 0.5rem;
}

.post__action-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.post__action-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
