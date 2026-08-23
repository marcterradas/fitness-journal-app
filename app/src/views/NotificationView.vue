<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()

const notifications = ref([
  { id: 1, type: 'like',        user: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alice', action: 'liked your workout', content: 'Upper Body Power', time: '5 min ago', read: false },
  { id: 2, type: 'comment',     user: 'Coach Mike',    avatar: 'https://i.pravatar.cc/150?u=mike',  action: 'commented on your post', content: 'Great form on those squats! Keep it up.', time: '1 h ago', read: false },
  { id: 3, type: 'follow',      user: 'Sarah Fit',     avatar: 'https://i.pravatar.cc/150?u=sarah', action: 'started following you', content: null, time: '2 h ago', read: true },
  { id: 4, type: 'achievement', user: null,            avatar: null,                                action: 'You completed 5 workouts this week', content: null, time: 'Yesterday', read: true },
  { id: 5, type: 'message',     user: 'John Doe',      avatar: 'https://i.pravatar.cc/150?u=john',  action: 'sent you a message', content: 'Hey, want to hit the gym tomorrow?', time: 'Yesterday', read: true },
  { id: 6, type: 'like',        user: 'Emma Wilson',   avatar: 'https://i.pravatar.cc/150?u=emma',  action: 'liked your workout', content: 'Leg Day Destruction', time: '2 d ago', read: true },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function markRead(id) {
  const n = notifications.value.find(x => x.id === id)
  if (n) n.read = true
}

function markAllRead() {
  notifications.value.forEach(n => { n.read = true })
}
</script>

<template>
  <div class="notify">
    <header class="notify__head">
      <button class="notify__back" @click="router.back()" aria-label="Back">←</button>
      <h1 class="notify__title">Notifications</h1>
      <button v-if="unreadCount" class="notify__mark" @click="markAllRead">Mark all read</button>
    </header>

    <ul v-if="notifications.length" class="list">
      <li v-for="n in notifications" :key="n.id" class="item">
        <button class="item__btn" :class="{ 'item__btn--unread': !n.read }" @click="markRead(n.id)">
          <Avatar v-if="n.avatar" :src="n.avatar" :alt="n.user || ''" size="md" />
          <span v-else class="item__glyph" aria-hidden="true">🏆</span>

          <span class="item__main">
            <span class="item__text">
              <strong v-if="n.user">{{ n.user }}</strong>
              {{ n.action }}
            </span>
            <span v-if="n.content" class="item__content">{{ n.content }}</span>
            <span class="item__time">{{ n.time }}</span>
          </span>

          <span v-if="!n.read" class="item__dot" role="img" aria-label="Unread" />
        </button>
      </li>
    </ul>

    <EmptyState v-else icon="🔕" title="All caught up" description="Nothing here right now." />
  </div>
</template>

<style scoped>
.notify { display: flex; flex-direction: column; gap: var(--space-5); width: 100%; }

.notify__head { display: flex; align-items: center; gap: var(--space-3); }
.notify__back {
  width: 2.25rem; height: 2.25rem;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 50%;
}
.notify__back:hover { color: var(--color-text); background: var(--color-surface-2); }
.notify__title {
  flex: 1;
  min-width: 0;
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.02em;
}
.notify__mark {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
}
.notify__mark:hover { color: var(--color-accent); }

.list { display: flex; flex-direction: column; }

.item + .item { border-top: 1px solid var(--color-border); }

.item__btn {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4) 0;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.item__glyph {
  width: 2.5rem; height: 2.5rem;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: var(--color-surface-2);
  border-radius: 50%;
  font-size: 1.15rem;
}

.item__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }

.item__text {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  line-height: 1.45;
}
.item__text strong { color: var(--color-text); font-weight: var(--fw-semibold); }

.item__content {
  color: var(--color-text-dim);
  font-size: var(--fs-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item__time { font-size: var(--fs-xs); color: var(--color-text-dim); }

.item__dot {
  flex-shrink: 0;
  align-self: center;
  width: 0.4rem;
  height: 0.4rem;
  background: var(--color-accent);
  border-radius: 50%;
}

.item__btn--unread .item__text { color: var(--color-text); }
</style>
