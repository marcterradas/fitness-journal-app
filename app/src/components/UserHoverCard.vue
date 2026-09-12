<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import Avatar from '@/components/Avatar.vue'
import { tierFromDots, UNRANKED } from '@/ranking'
import { personOf, isMe } from '@/mock/directory'
import { topAchievements } from '@/achievements'

const props = defineProps({
  // id, @handle, or any object carrying one of them
  user: { type: [Object, String], required: true },
})

const open = ref(false)
const root = ref(null)
const pos = ref({ top: 0, left: 0 })
let timer = null

const W = 260   // panel width, kept in sync with .uh__pop
const GAP = 6

const person = computed(() => personOf(props.user))
const tier = computed(() => (person.value?.dots ? tierFromDots(person.value.dots) : UNRANKED))
const awards = computed(() => topAchievements(person.value))

// Hover-only affordance: on touch the panel would fight the tap, so it never opens there.
const canHover = () => window.matchMedia?.('(hover: hover)').matches ?? false

// Teleported to <body> and fixed-positioned: feed cards and the board clip their own overflow.
function place() {
  const r = root.value.getBoundingClientRect()
  const left = Math.max(8, Math.min(r.left, window.innerWidth - W - 8))
  const below = window.innerHeight - r.bottom
  const top = below > 260 || r.top < 260 ? r.bottom + GAP : r.top - GAP
  pos.value = { top, left, flip: below <= 260 && r.top >= 260 }
}

function show() {
  if (!person.value || !canHover()) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    place()
    open.value = true
    window.addEventListener('scroll', hide, { once: true, capture: true })
  }, 220)
}
function hide() {
  clearTimeout(timer)
  open.value = false
}
onBeforeUnmount(() => { clearTimeout(timer); window.removeEventListener('scroll', hide, true) })
</script>

<template>
  <span ref="root" class="uh" @mouseenter="show" @mouseleave="hide" @focusin="show" @focusout="hide">
    <slot />

    <Teleport to="body">
      <Transition name="uh-fade">
        <span
          v-if="open"
          class="uh__pop"
          role="tooltip"
          :style="{ top: pos.top + 'px', left: pos.left + 'px', transform: pos.flip ? 'translateY(-100%)' : null }"
        >
          <span class="uh__head">
            <Avatar :src="person.avatar" :alt="person.name" size="md" />
            <span class="uh__id">
              <span class="uh__name">{{ person.name }}</span>
              <span class="uh__handle">@{{ person.username }}<template v-if="person.sport"> · {{ person.sport }}</template></span>
            </span>
          </span>

          <span class="uh__tier" :style="{ '--tier-color': tier.color }">
            <span class="uh__tier-icon">{{ tier.icon }}</span>
            <span class="uh__tier-main">
              <span class="uh__tier-label">{{ tier.label }} {{ tier.division }}</span>
              <span class="uh__tier-sub">{{ person.dots ? `${tier.dots} DOTS` : 'No ranked lifts yet' }}</span>
            </span>
            <span v-if="tier.next" class="uh__tier-next">+{{ tier.toNext }} to {{ tier.next.label }}</span>
          </span>

          <span v-if="person.workouts || person.streak || person.points" class="uh__stats">
            <span v-if="person.workouts">✅ {{ person.workouts }}</span>
            <span v-if="person.streak">🔥 {{ person.streak }}d</span>
            <span v-if="person.points">🏅 {{ person.points.toLocaleString() }} pts</span>
          </span>

          <span v-if="awards.length" class="uh__awards">
            <span v-for="a in awards" :key="a.id" class="uh__award" :title="`Tier ${a.level}/${a.levels} · next: ${a.label}`">
              {{ a.icon }} {{ a.earnedLabel }}
            </span>
          </span>

          <router-link v-if="isMe(person)" to="/profile" class="uh__cta">Your profile ›</router-link>
          <router-link v-else :to="`/u/${person.username}`" class="uh__cta">See profile ›</router-link>
        </span>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.uh { display: inline-flex; }
</style>

<!-- ponytail: the panel lives on <body>, so its styles cannot be scoped -->
<style>
.uh__pop {
  position: fixed;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 260px;
  padding: var(--space-3);
  background: var(--color-bg-elevated, var(--color-surface));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.35));
  cursor: default;
}
.uh__head { display: flex; align-items: center; gap: var(--space-3); }
.uh__id { display: flex; flex-direction: column; min-width: 0; }
.uh__name { font-weight: var(--fw-semibold); font-size: var(--fs-sm); }
.uh__handle { font-size: var(--fs-xs); color: var(--color-text-dim); }

.uh__tier {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border-left: 3px solid var(--tier-color);
}
.uh__tier-icon { font-size: 1.1rem; }
.uh__tier-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.uh__tier-label { font-size: var(--fs-xs); font-weight: var(--fw-bold); color: var(--tier-color); }
.uh__tier-sub { font-size: 0.65rem; color: var(--color-text-dim); }
.uh__tier-next { font-size: 0.65rem; color: var(--color-text-dim); white-space: nowrap; }

.uh__stats { display: flex; gap: var(--space-3); font-size: var(--fs-xs); color: var(--color-text-muted); }

.uh__awards { display: flex; flex-wrap: wrap; gap: var(--space-1); }
.uh__award {
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 0.65rem;
  font-weight: var(--fw-semibold);
}

.uh__cta { font-size: var(--fs-xs); color: var(--color-accent); text-decoration: none; }
.uh__cta:hover { text-decoration: underline; }

/* opacity only — the inline transform carries the flip-above offset */
.uh-fade-enter-active, .uh-fade-leave-active { transition: opacity var(--t-fast) var(--ease); }
.uh-fade-enter-from, .uh-fade-leave-to { opacity: 0; }

@media (hover: none) { .uh__pop { display: none; } }
</style>
