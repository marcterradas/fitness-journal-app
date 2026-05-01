<script setup>
import { ref } from 'vue'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'
import SportIcon from '@/components/SportIcon.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

const localKudos = ref(props.post.kudos)
const liked = ref(props.post.kudoed)

function toggleKudos() {
  if (liked.value) localKudos.value -= 1
  else localKudos.value += 1
  liked.value = !liked.value
}
</script>

<template>
  <Card padding="none" class="post">
    <header class="post__head">
      <Avatar :src="post.user.avatar" :alt="post.user.name" size="md" />
      <div class="post__who">
        <div class="post__row">
          <span class="post__name">{{ post.user.name }}</span>
          <span class="post__when">· {{ post.when }}</span>
        </div>
        <span class="post__handle">@{{ post.user.username }}</span>
      </div>
      <SportIcon :sport="post.sport" size="sm" />
    </header>

    <div class="post__body">
      <h3 v-if="post.title" class="post__title">{{ post.title }}</h3>
      <p class="post__text">{{ post.text }}</p>
      <div v-if="post.badge" class="post__badge-row">
        <Badge tone="accent" :icon="post.badge.icon">{{ post.badge.label }}</Badge>
      </div>
    </div>

    <img
      v-if="post.image"
      :src="post.image"
      :alt="post.title"
      class="post__image"
      loading="lazy"
    />

    <div v-if="post.stats" class="post__stats">
      <div v-if="post.stats.distanceKm" class="post__stat">
        <span class="post__stat-v">{{ post.stats.distanceKm }}</span>
        <span class="post__stat-l">km</span>
      </div>
      <div v-if="post.stats.durationMin" class="post__stat">
        <span class="post__stat-v">{{ post.stats.durationMin }}</span>
        <span class="post__stat-l">min</span>
      </div>
      <div v-if="post.stats.paceMinKm" class="post__stat">
        <span class="post__stat-v">{{ post.stats.paceMinKm }}</span>
        <span class="post__stat-l">/km</span>
      </div>
    </div>

    <div class="post__actions">
      <button
        :class="['post__btn', { 'post__btn--active': liked }]"
        @click="toggleKudos"
        aria-label="Give kudos"
      >
        <span class="post__btn-icon">{{ liked ? '💚' : '🤍' }}</span>
        <span class="post__btn-count">{{ localKudos }}</span>
      </button>
      <button class="post__btn" aria-label="Comment">
        <span class="post__btn-icon">💬</span>
        <span class="post__btn-count">{{ post.comments.length }}</span>
      </button>
      <button class="post__btn" aria-label="Share">
        <span class="post__btn-icon">📤</span>
      </button>
    </div>

    <div v-if="post.comments.length" class="post__comments">
      <div v-for="(c, i) in post.comments" :key="i" class="comment">
        <Avatar :src="c.avatar" :alt="c.user" size="xs" />
        <div class="comment__bubble">
          <span class="comment__name">{{ c.user }}</span>
          <span class="comment__text">{{ c.text }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.post { overflow: hidden; }

.post__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}
.post__who { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.post__row { display: flex; align-items: baseline; gap: var(--space-1); }
.post__name { font-weight: var(--fw-semibold); color: var(--color-text); }
.post__when { font-size: var(--fs-xs); color: var(--color-text-dim); }
.post__handle { font-size: var(--fs-xs); color: var(--color-text-dim); }

.post__body {
  padding: 0 var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.post__title { font-size: var(--fs-lg); font-weight: var(--fw-semibold); color: var(--color-text); }
.post__text { color: var(--color-text); line-height: 1.5; }
.post__badge-row { margin-top: var(--space-1); }

.post__image {
  width: 100%;
  max-height: 460px;
  object-fit: cover;
  display: block;
}

.post__stats {
  display: flex;
  gap: var(--space-6);
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}
.post__stat { display: flex; flex-direction: column; align-items: flex-start; }
.post__stat-v { font-size: var(--fs-lg); font-weight: var(--fw-bold); color: var(--color-text); }
.post__stat-l { font-size: var(--fs-xs); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; }

.post__actions {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-top: 1px solid var(--color-border);
}
.post__btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
  font-size: var(--fs-sm);
}
.post__btn:hover { background: var(--color-surface-2); color: var(--color-text); }
.post__btn--active { color: var(--color-accent); }
.post__btn-icon { font-size: var(--fs-md); }
.post__btn-count { font-variant-numeric: tabular-nums; font-weight: var(--fw-medium); }

.post__comments {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-elevated);
}
.comment { display: flex; gap: var(--space-2); align-items: flex-start; }
.comment__bubble {
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--fs-sm);
  flex: 1;
}
.comment__name { font-weight: var(--fw-semibold); color: var(--color-text); margin-right: var(--space-2); }
.comment__text { color: var(--color-text-muted); }
</style>
