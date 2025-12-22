<script setup>
const username = "AlexFit";
const avatarUrl = "https://i.pravatar.cc/150?img=12";
const content = "Just finished a great workout! 💪 Hit a new PR on the bench press today. Feeling stronger every day. #fitness #gym #motivation";
</script>

<template>
  <div class="post">
    <div class="post-header">
      <img :src="avatarUrl" alt="User Avatar" class="avatar" />
      <span class="username">{{ username }}</span>
    </div>
    
    <div class="post-content">
      <p>{{ content }}</p>
    </div>

    <div class="post-footer">
      <button class="action-btn">
        <img src="/heart.svg" alt="Like" width="16" height="16" />
      </button>
      <button class="action-btn">
        <img src="/message.svg" alt="Comment" width="16" height="16" />
      </button>
      <button class="action-btn">
        <img src="/send.svg" alt="Share" width="16" height="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.post {
  background-color: #1a1a1a;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  border: 1px solid #333;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  border: 2px solid #42b883;
}

.username {
  font-weight: bold;
  color: #fff;
  font-size: 1rem;
}

.post-content {
  margin-bottom: 1rem;
  color: #e0e0e0;
  line-height: 1.5;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #333;
  padding-top: 0.75rem;
}

.action-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #333;
  color: #fff;
}
</style>
