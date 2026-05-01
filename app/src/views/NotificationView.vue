<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Chip from '@/components/Chip.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()

const filter = ref('all')

const notifications = ref([
  { id: 1, type: 'like',        user: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alice', action: 'liked your workout', content: 'Upper Body Power', time: '5 min ago', read: false },
  { id: 2, type: 'comment',     user: 'Coach Mike',    avatar: 'https://i.pravatar.cc/150?u=mike',  action: 'commented on your post', content: 'Great form on those squats! Keep it up.', time: '1 h ago', read: false },
  { id: 3, type: 'follow',      user: 'Sarah Fit',     avatar: 'https://i.pravatar.cc/150?u=sarah', action: 'started following you', content: null, time: '2 h ago', read: true },
  { id: 4, type: 'achievement', user: null,            avatar: null,                                action: 'You completed 5 workouts this week!', content: 'Keep up the great work!', time: 'Yesterday', read: true },
  { id: 5, type: 'message',     user: 'John Doe',      avatar: 'https://i.pravatar.cc/150?u=john',  action: 'sent you a message', content: 'Hey, want to hit the gym tomorrow?', time: 'Yesterday', read: true },
  { id: 6, type: 'like',        user: 'Emma Wilson',   avatar: 'https://i.pravatar.cc/150?u=emma',  action: 'liked your workout', content: 'Leg Day Destruction', time: '2 d ago', read: true },
])

const filtered = computed(() => {
  if (filter.value === 'unread') return notifications.value.filter(n => !n.read)
  if (filter.value === 'all') return notifications.value
  return notifications.value.filter(n => n.type === filter.value)
})

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filters = [
  { id: 'all',         label: 'All' },
  { id: 'unread',      label: 'Unread' },
  { id: 'like',        label: '❤️ Likes' },
  { id: 'comment',     label: '💬 Comments' },
  { id: 'follow',      label: '👤 Follows' },
  { id: 'achievement', label: '🏆 Achievements' },
]

function iconFor(type) {
  return ({ like: '💚', comment: '💬', follow: '👋', achievement: '🏆', message: '✉️' })[type] || '🔔'
}

function toneFor(type) {
  return ({ like: 'mood', comment: 'accent', follow: 'cycling', achievement: 'warning', message: 'success' })[type] || 'neutral'
}

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
      <div class="notify__title-wrap">
        <span class="notify__eyebrow">Activity</span>
        <h1 class="notify__title">
          Notifications
          <span v-if="unreadCount" class="notify__count">{{ unreadCount }}</span>
        </h1>
      </div>
      <button
        v-if="unreadCount"
        class="notify__mark"
        @click="markAllRead"
      >Mark all read</button>
    </header>

    <div class="notify__filters hide-scrollbar">
      <Chip
        v-for="f in filters"
        :key="f.id"
        :active="filter === f.id"
        size="sm"
        @click="filter = f.id"
      >{{ f.label }}</Chip>
    </div>

    <Card v-if="filtered.length" padding="none">
      <ul class="list">
        <li
          v-for="n in filtered"
          :key="n.id"
          class="item"
          :class="{ 'item--unread': !n.read }"
          @click="markRead(n.id)"
        >
          <div class="item__icon-wrap">
            <Avatar v-if="n.avatar" :src="n.avatar" :alt="n.user || ''" size="md" />
            <span v-else class="item__emoji">{{ iconFor(n.type) }}</span>
            <span class="item__type-badge" :data-tone="toneFor(n.type)">{{ iconFor(n.type) }}</span>
          </div>

          <div class="item__main">
            <p class="item__text">
              <span v-if="n.user" class="item__user">{{ n.user }}</span>
              <span class="item__action">{{ n.action }}</span>
            </p>
            <p v-if="n.content" class="item__content">{{ n.content }}</p>
            <span class="item__time">{{ n.time }}</span>
          </div>

          <span v-if="!n.read" class="item__dot" aria-label="Unread" />
        </li>
      </ul>
    </Card>

    <EmptyState
      v-else
      icon="🔕"
      title="All caught up"
      :description="filter === 'unread' ? 'No unread notifications.' : 'Nothing here right now.'"
    />
  </div>
</template>

<style scoped>
.notify { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }

.notify__head { display: flex; align-items: center; gap: var(--space-3); }
.notify__back {
  width: 2.5rem; height: 2.5rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.notify__title-wrap { flex: 1; min-width: 0; }
.notify__eyebrow {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.notify__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.notify__count {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-size: var(--fs-xs);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  font-weight: var(--fw-bold);
}
.notify__mark {
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-accent);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--t-fast) var(--ease);
}
.notify__mark:hover { border-color: var(--color-accent); background: var(--color-accent-soft); }

.notify__filters {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
}

.list { display: flex; flex-direction: column; }

.item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
  position: relative;
}
.item:last-child { border-bottom: none; }
.item:hover { background: var(--color-surface-2); }
.item--unread { background: var(--color-secondary-soft); }
.item--unread:hover { background: color-mix(in srgb, var(--color-secondary) 20%, var(--color-surface)); }

.item__icon-wrap {
  position: relative;
  flex-shrink: 0;
}
.item__emoji {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  border-radius: 50%;
  font-size: 1.5rem;
}
.item__type-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px solid var(--color-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
}

.item__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.item__text { color: var(--color-text); font-size: var(--fs-sm); line-height: 1.4; }
.item__user { font-weight: var(--fw-semibold); margin-right: var(--space-1); }
.item__action { color: var(--color-text-muted); }
.item__content {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-top: 2px;
}
.item__time {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  margin-top: var(--space-1);
}

.item__dot {
  position: absolute;
  top: 50%;
  right: var(--space-4);
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-accent);
  border-radius: 50%;
}
</style>
