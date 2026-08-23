<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { step } from '@/storyNav'
import Icon from '@/components/Icon.vue'

const props = defineProps({
  stories: { type: Array, required: true },
  startIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['close'])

const DURATION = 5000
const TICK = 50

const userIdx = ref(props.startIndex)
const itemIdx = ref(0)
const progress = ref(0)
const held = ref(false)
const typing = ref(false)
const comment = ref('')
const toast = ref('')
const root = ref(null)

const story = computed(() => props.stories[userIdx.value])
const item = computed(() => story.value?.items[itemIdx.value])
const prevStory = computed(() => props.stories[userIdx.value - 1])
const nextStory = computed(() => props.stories[userIdx.value + 1])
const paused = computed(() => held.value || typing.value)

let timer = null
let toastTimer = null

function play() {
  clearInterval(timer)
  progress.value = 0
  timer = setInterval(() => {
    if (paused.value) return
    progress.value += TICK / DURATION
    if (progress.value >= 1) next()
  }, TICK)
}

function go(dir) {
  const at = step(props.stories, userIdx.value, itemIdx.value, dir)
  if (!at) return emit('close')
  userIdx.value = at.userIdx
  itemIdx.value = at.itemIdx
  play()
}

const next = () => go(1)
const prev = () => go(-1)

function jumpTo(i) {
  userIdx.value = i
  itemIdx.value = 0
  play()
}

function flash(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 1600)
}

function toggleLike() {
  item.value.liked = !item.value.liked
  item.value.likes += item.value.liked ? 1 : -1
}

// ponytail: Web Share where supported, clipboard everywhere else. No custom share sheet.
async function share() {
  const url = `${location.origin}/?story=${story.value.id}&item=${item.value.id}`
  try {
    if (navigator.share) await navigator.share({ title: story.value.user.name, url })
    else {
      await navigator.clipboard.writeText(url)
      flash('Link copied')
    }
  } catch {
    // user dismissed the share sheet, or clipboard denied — nothing to recover
  }
}

// ponytail: no API yet, the comment is acknowledged and dropped.
function sendComment() {
  if (!comment.value.trim()) return
  comment.value = ''
  flash('Reply sent')
}

function onKey(e) {
  if (e.key === 'Escape') return emit('close')
  if (e.target.tagName === 'INPUT') return
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

// Mark seen as soon as a user's story opens.
watch(story, (s) => { if (s) s.seen = true }, { immediate: true })

onMounted(() => {
  play()
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
  root.value?.focus()
})

onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(toastTimer)
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="root"
      class="viewer"
      role="dialog"
      aria-modal="true"
      :aria-label="`${story.user.name}'s story`"
      tabindex="-1"
    >
      <button class="viewer__close" aria-label="Close" @click="emit('close')">✕</button>

      <button
        v-if="prevStory"
        class="peek peek--prev"
        :aria-label="`${prevStory.user.name}'s story`"
        @click="jumpTo(userIdx - 1)"
      >
        <img :src="prevStory.items[0].image" alt="" class="peek__img" />
        <span class="peek__name">{{ prevStory.user.username }}</span>
      </button>

      <div
        class="viewer__stage"
        @pointerdown="held = true"
        @pointerup="held = false"
        @pointercancel="held = false"
      >
        <div class="viewer__bars">
          <span v-for="(it, i) in story.items" :key="it.id" class="bar">
            <span
              class="bar__fill"
              :style="{ width: i < itemIdx ? '100%' : i === itemIdx ? `${progress * 100}%` : '0%' }"
            />
          </span>
        </div>

        <header class="viewer__head">
          <img :src="story.user.avatar" :alt="story.user.name" class="viewer__avatar" />
          <span class="viewer__name">{{ story.user.name }}</span>
          <span class="viewer__when">{{ item.when }}</span>
        </header>

        <img :src="item.image" :alt="item.caption" class="viewer__image" />

        <button class="tap tap--prev" aria-label="Previous" @click.stop="prev" />
        <button class="tap tap--next" aria-label="Next" @click.stop="next" />

        <button class="arrow arrow--prev" aria-label="Previous" @click.stop="prev">‹</button>
        <button class="arrow arrow--next" aria-label="Next" @click.stop="next">›</button>

        <div class="foot" @pointerdown.stop>
          <p v-if="item.caption" class="foot__caption">{{ item.caption }}</p>

          <form class="acts" @submit.prevent="sendComment">
            <input
              v-model="comment"
              class="acts__input"
              type="text"
              :placeholder="`Reply to ${story.user.username}…`"
              :aria-label="`Reply to ${story.user.username}`"
              @focus="typing = true"
              @blur="typing = false"
            />
            <button
              type="button"
              class="acts__btn"
              :class="{ 'acts__btn--liked': item.liked }"
              :aria-pressed="item.liked"
              :aria-label="item.liked ? 'Unlike' : 'Like'"
              @click="toggleLike"
            >
              <Icon name="heart" size="1.35rem" />
              <span class="acts__count">{{ item.likes }}</span>
            </button>
            <button type="button" class="acts__btn" aria-label="Share" @click="share">
              <Icon name="send" size="1.35rem" />
            </button>
          </form>

          <p v-if="toast" class="foot__toast" role="status">{{ toast }}</p>
        </div>
      </div>

      <button
        v-if="nextStory"
        class="peek peek--next"
        :aria-label="`${nextStory.user.name}'s story`"
        @click="jumpTo(userIdx + 1)"
      >
        <img :src="nextStory.items[0].image" alt="" class="peek__img" />
        <span class="peek__name">{{ nextStory.user.username }}</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.viewer {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  outline: none;
}

.viewer__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 5;
  background: none;
  border: none;
  color: #fff;
  font-size: var(--fs-xl);
  cursor: pointer;
  opacity: 0.8;
}
.viewer__close:hover { opacity: 1; }

/* Adjacent stories — desktop only, too cramped to be useful on a phone */
.peek {
  display: none;
  position: relative;
  width: 10rem;
  height: 17rem;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  opacity: 0.45;
  transition: opacity var(--t-fast) var(--ease);
}
.peek:hover { opacity: 0.75; }
.peek__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.peek__name {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--space-4) var(--space-2) var(--space-2);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  color: #fff;
  font-size: var(--fs-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (min-width: 900px) {
  .peek { display: block; }
}

.viewer__stage {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 26rem;
  background: var(--color-bg);
  overflow: hidden;
}
@media (min-width: 600px) {
  .viewer__stage {
    height: min(92vh, 46rem);
    border-radius: var(--radius-lg);
  }
}

.viewer__image { width: 100%; height: 100%; object-fit: cover; display: block; }

.viewer__bars {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  right: var(--space-3);
  z-index: 3;
  display: flex;
  gap: 3px;
}
.bar {
  flex: 1;
  height: 2px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.bar__fill { display: block; height: 100%; background: #fff; }

.viewer__head {
  position: absolute;
  top: calc(var(--space-3) + 12px);
  left: var(--space-3);
  right: var(--space-3);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  /* keeps white text readable over bright photos */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}
.viewer__avatar { width: 2rem; height: 2rem; border-radius: 50%; object-fit: cover; }
.viewer__name { color: #fff; font-size: var(--fs-sm); font-weight: var(--fw-semibold); }
.viewer__when { color: rgba(255, 255, 255, 0.7); font-size: var(--fs-xs); flex: 1; }

/* Invisible tap halves — the arrows sit on top of these */
.tap {
  position: absolute;
  top: 0;
  bottom: 5.5rem;
  width: 35%;
  z-index: 2;
  background: none;
  border: none;
  cursor: pointer;
}
.tap--prev { left: 0; }
.tap--next { right: 0; width: 65%; }

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 3px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.arrow:hover { background: rgba(0, 0, 0, 0.7); }
.arrow--prev { left: var(--space-3); }
.arrow--next { right: var(--space-3); }

.foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  padding: var(--space-8) var(--space-4) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75) 45%);
}
.foot__caption {
  color: #fff;
  font-size: var(--fs-sm);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
}
.foot__toast {
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--fs-xs);
  text-align: center;
}

.acts { display: flex; align-items: center; gap: var(--space-2); }
.acts__input {
  flex: 1;
  min-width: 0;
  padding: var(--space-2) var(--space-4);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-pill);
  color: #fff;
  font: inherit;
  font-size: var(--fs-sm);
  outline: none;
}
.acts__input::placeholder { color: rgba(255, 255, 255, 0.6); }
.acts__input:focus { border-color: #fff; }

.acts__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: var(--space-1);
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font: inherit;
}
.acts__btn--liked { color: var(--color-mood); }
.acts__count { font-size: var(--fs-xs); font-variant-numeric: tabular-nums; }
</style>
