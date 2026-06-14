<script setup>
import { ref, computed, nextTick } from 'vue'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'
import SportIcon from '@/components/SportIcon.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

const localKudos = ref(props.post.kudos)
const liked = ref(props.post.kudoed)
const showCommentInput = ref(false)
const commentText = ref('')
const showAllComments = ref(false)
const localComments = ref([...props.post.comments])
const activeMedia = ref(0)
const trackRef = ref(null)
const commentInputRef = ref(null)

const media = computed(() =>
  props.post.media ?? (props.post.image ? [{ type: 'image', url: props.post.image }] : [])
)

const visibleComments = computed(() =>
  showAllComments.value ? localComments.value : localComments.value.slice(0, 2)
)
const hiddenCount = computed(() => Math.max(0, localComments.value.length - 2))

const exercises = computed(() => {
  if (!props.post.exercises?.length) return []
  const rows = props.post.exercises.map(ex => ({
    ...ex,
    vol: ex.sets * ex.reps * (ex.weightKg || 1),
  }))
  const max = Math.max(...rows.map(r => r.vol))
  return rows.map(r => ({ ...r, pct: Math.max(10, Math.round((r.vol / max) * 100)) }))
})

const totalVolumeKg = computed(() =>
  exercises.value.reduce((sum, ex) => sum + ex.sets * ex.reps * (ex.weightKg || 0), 0)
)

function toggleKudos() {
  liked.value ? (localKudos.value -= 1) : (localKudos.value += 1)
  liked.value = !liked.value
}

async function toggleCommentInput() {
  showCommentInput.value = !showCommentInput.value
  if (showCommentInput.value) {
    await nextTick()
    commentInputRef.value?.focus()
  }
}

function addComment() {
  const text = commentText.value.trim()
  if (!text) return
  localComments.value.push({
    user: 'Marc Terradas',
    avatar: 'https://i.pravatar.cc/300?u=marc',
    text,
  })
  commentText.value = ''
  showCommentInput.value = false
  showAllComments.value = true
}

function onTrackScroll() {
  const el = trackRef.value
  if (!el) return
  activeMedia.value = Math.round(el.scrollLeft / el.offsetWidth)
}

function goToMedia(i) {
  const el = trackRef.value
  if (!el) return
  el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' })
  activeMedia.value = i
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
        <div class="post__row post__row--sub">
          <span class="post__handle">@{{ post.user.username }}</span>
          <span v-if="post.type === 'workout'" class="post__type-tag">Workout</span>
        </div>
      </div>
      <SportIcon v-if="post.sport" :sport="post.sport" size="sm" />
    </header>

    <div class="post__body">
      <h3 v-if="post.title" class="post__title">{{ post.title }}</h3>
      <p v-if="post.text" class="post__text">{{ post.text }}</p>
      <div v-if="post.badge" class="post__badge-row">
        <Badge tone="accent" :icon="post.badge.icon">{{ post.badge.label }}</Badge>
      </div>
    </div>

    <div v-if="media.length" class="post__media">
      <div
        ref="trackRef"
        class="media-track"
        @scroll.passive="onTrackScroll"
      >
        <div v-for="(m, i) in media" :key="i" class="media-slide">
          <video
            v-if="m.type === 'video'"
            :src="m.url"
            :poster="m.thumb"
            class="media-item"
            controls
            playsinline
          />
          <img
            v-else
            :src="m.url"
            :alt="post.title || 'Post media'"
            class="media-item"
            loading="lazy"
          />
        </div>
      </div>

      <template v-if="media.length > 1">
        <button
          v-if="activeMedia > 0"
          class="media-arrow media-arrow--prev"
          @click="goToMedia(activeMedia - 1)"
          aria-label="Previous"
        >&#8249;</button>
        <button
          v-if="activeMedia < media.length - 1"
          class="media-arrow media-arrow--next"
          @click="goToMedia(activeMedia + 1)"
          aria-label="Next"
        >&#8250;</button>

        <div class="media-counter">
          {{ activeMedia + 1 }}/{{ media.length }}
        </div>

        <div class="media-dots" aria-hidden="true">
          <button
            v-for="(_, i) in media"
            :key="i"
            :class="['media-dot', { 'media-dot--active': i === activeMedia }]"
            @click="goToMedia(i)"
          />
        </div>
      </template>
    </div>

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
      <div v-if="post.stats.calories" class="post__stat">
        <span class="post__stat-v">{{ post.stats.calories }}</span>
        <span class="post__stat-l">kcal</span>
      </div>
    </div>

    <div v-if="exercises.length" class="post__exercises">
      <div class="exs-header">
        <span class="exs-title">Exercises</span>
        <span v-if="totalVolumeKg" class="exs-volume">{{ totalVolumeKg.toLocaleString() }} kg total</span>
      </div>
      <div class="exs-list">
        <div v-for="ex in exercises" :key="ex.name" class="ex-row">
          <div class="ex-top">
            <span class="ex-name">{{ ex.name }}</span>
            <span v-if="ex.pr" class="ex-pr">PR</span>
            <span class="ex-sets">{{ ex.sets }}×{{ ex.reps }}{{ ex.weightKg ? ` · ${ex.weightKg} kg` : '' }}</span>
          </div>
          <div class="ex-bar-track">
            <div
              class="ex-bar"
              :class="{ 'ex-bar--pr': ex.pr }"
              :style="{ width: ex.pct + '%' }"
            />
          </div>
        </div>
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
      <button
        :class="['post__btn', { 'post__btn--active': showCommentInput }]"
        @click="toggleCommentInput"
        aria-label="Comment"
      >
        <span class="post__btn-icon">💬</span>
        <span class="post__btn-count">{{ localComments.length }}</span>
      </button>
      <button class="post__btn post__btn--share" aria-label="Share">
        <span class="post__btn-icon">📤</span>
      </button>
    </div>

    <div v-if="localComments.length || showCommentInput" class="post__comments">
      <div v-for="(c, i) in visibleComments" :key="i" class="comment">
        <Avatar :src="c.avatar" :alt="c.user" size="xs" />
        <div class="comment__bubble">
          <span class="comment__name">{{ c.user }}</span>
          <span class="comment__text">{{ c.text }}</span>
        </div>
      </div>

      <button
        v-if="hiddenCount > 0 && !showAllComments"
        class="post__more-comments"
        @click="showAllComments = true"
      >
        View {{ hiddenCount }} more {{ hiddenCount === 1 ? 'comment' : 'comments' }}
      </button>

      <div v-if="showCommentInput" class="comment-input-row">
        <Avatar src="https://i.pravatar.cc/300?u=marc" alt="Me" size="xs" />
        <input
          ref="commentInputRef"
          v-model="commentText"
          class="comment-input"
          placeholder="Add a comment…"
          @keydown.enter.prevent="addComment"
        />
        <button
          class="comment-submit"
          :disabled="!commentText.trim()"
          @click="addComment"
        >
          Post
        </button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.post { overflow: hidden; }

/* Header */
.post__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}
.post__who { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.post__row { display: flex; align-items: baseline; gap: var(--space-1); }
.post__row--sub { align-items: center; }
.post__name { font-weight: var(--fw-semibold); color: var(--color-text); }
.post__when { font-size: var(--fs-xs); color: var(--color-text-dim); }
.post__handle { font-size: var(--fs-xs); color: var(--color-text-dim); }
.post__type-tag {
  font-size: 0.65rem;
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  padding: 1px 6px;
  border-radius: var(--radius-pill);
}

/* Body */
.post__body {
  padding: 0 var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.post__title { font-size: var(--fs-lg); font-weight: var(--fw-semibold); color: var(--color-text); }
.post__text { color: var(--color-text); line-height: 1.55; }
.post__badge-row { margin-top: var(--space-1); }

/* Media */
.post__media { position: relative; }

.media-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.media-track::-webkit-scrollbar { display: none; }

.media-slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.media-item {
  width: 100%;
  max-height: 460px;
  object-fit: cover;
  display: block;
}

.media-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.48);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background var(--t-fast) var(--ease), opacity var(--t-fast) var(--ease);
  z-index: 1;
}
.media-arrow:hover { background: rgba(0, 0, 0, 0.72); }
.media-arrow--prev { left: var(--space-3); }
.media-arrow--next { right: var(--space-3); }

.media-counter {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: rgba(0, 0, 0, 0.52);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-variant-numeric: tabular-nums;
  backdrop-filter: blur(6px);
  pointer-events: none;
}

.media-dots {
  position: absolute;
  bottom: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
}

.media-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.38);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background var(--t-fast) var(--ease), width var(--t-fast) var(--ease), border-radius var(--t-fast) var(--ease);
}

.media-dot--active {
  background: #fff;
  width: 18px;
  border-radius: 3px;
}

/* Stats */
.post__stats {
  display: flex;
  gap: var(--space-6);
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}
.post__stat { display: flex; flex-direction: column; align-items: flex-start; }
.post__stat-v { font-size: var(--fs-lg); font-weight: var(--fw-bold); color: var(--color-text); }
.post__stat-l { font-size: var(--fs-xs); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; }

/* Exercises */
.post__exercises {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.exs-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.exs-title {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-dim);
}
.exs-volume {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
}

.exs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ex-row { display: flex; flex-direction: column; gap: 5px; }

.ex-top {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.ex-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--color-text);
  flex: 1;
  min-width: 0;
}
.ex-pr {
  font-size: 0.65rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent-ink);
  background: var(--color-accent);
  padding: 1px 5px;
  border-radius: var(--radius-pill);
  flex-shrink: 0;
}
.ex-sets {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.ex-bar-track {
  height: 4px;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.ex-bar {
  height: 100%;
  background: var(--color-text-dim);
  border-radius: var(--radius-pill);
  transition: width 0.4s var(--ease);
}
.ex-bar--pr { background: var(--color-accent); }

/* Actions */
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

/* Comments */
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

.post__more-comments {
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: var(--fs-sm);
  cursor: pointer;
  padding: var(--space-1) 0;
  text-align: left;
  transition: color var(--t-fast) var(--ease);
}
.post__more-comments:hover { color: var(--color-text-muted); }

/* Comment input */
.comment-input-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-top: var(--space-1);
}

.comment-input {
  flex: 1;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  font-size: var(--fs-sm);
  font-family: inherit;
  outline: none;
  transition: border-color var(--t-fast) var(--ease);
}
.comment-input::placeholder { color: var(--color-text-dim); }
.comment-input:focus { border-color: var(--color-accent); }

.comment-submit {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-pill);
  padding: var(--space-2) var(--space-3);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  font-family: inherit;
  cursor: pointer;
  transition: opacity var(--t-fast) var(--ease);
  white-space: nowrap;
}
.comment-submit:disabled { opacity: 0.35; cursor: default; }
.comment-submit:not(:disabled):hover { opacity: 0.88; }
</style>
