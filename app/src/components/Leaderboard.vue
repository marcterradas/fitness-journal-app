<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import Chip from '@/components/Chip.vue'
import RankInfo from '@/components/RankInfo.vue'
import UserHoverCard from '@/components/UserHoverCard.vue'
import UserLink from '@/components/UserLink.vue'
import { TIERS, tierFromDots, needsReview } from '@/ranking'
import { friendsBoard, globalBoard, POINTS_FORMULA } from '@/mock/leaderboard'

const tab = ref('friends')
const infoOpen = ref(false)

const rows = computed(() => (tab.value === 'friends' ? friendsBoard : globalBoard.top))
const podium = computed(() => rows.value.slice(0, 3))
const rest = computed(() => rows.value.slice(3))

const MEDALS = ['🥇', '🥈', '🥉']

function tier(u) {
  return tierFromDots(u.dots)
}
</script>

<template>
  <div class="ranking">
    <div class="ranking__tabs">
      <Chip :active="tab === 'friends'" @click="tab = 'friends'">👥 Friends</Chip>
      <Chip :active="tab === 'global'" @click="tab = 'global'">🌍 Global</Chip>
      <span class="ranking__sub">All-time · never resets</span>
    </div>

    <!-- Podium -->
    <Card padding="lg" class="podium">
      <div
        v-for="(u, i) in [podium[1], podium[0], podium[2]]"
        :key="u.id"
        class="podium__spot"
        :class="{ 'podium__spot--first': u === podium[0], 'podium__spot--me': u.me }"
      >
        <span class="podium__medal">{{ MEDALS[podium.indexOf(u)] }}</span>
        <UserHoverCard :user="u">
          <Avatar
            :src="u.avatar"
            :alt="u.name"
            :size="u === podium[0] ? 'xl' : 'lg'"
            :ring="u === podium[0] ? 'accent' : undefined"
          />
        </UserHoverCard>
        <UserLink :user="u" class="podium__name">{{ u.me ? 'You' : u.name.split(' ')[0] }}</UserLink>
        <span class="podium__points">{{ u.points.toLocaleString() }} pts</span>
        <span class="podium__tier" :title="`${tier(u).label} ${tier(u).division} · ${tier(u).dots} DOTS`">
          {{ tier(u).icon }} {{ tier(u).label }} {{ tier(u).division }}
        </span>
      </div>
    </Card>

    <!-- Rest of the board -->
    <Card padding="none" class="board">
      <div
        v-for="(u, i) in rest"
        :key="u.id"
        class="board__row"
        :class="{ 'board__row--me': u.me }"
      >
        <span class="board__pos">{{ i + 4 }}</span>
        <UserHoverCard :user="u">
          <Avatar :src="u.avatar" :alt="u.name" size="sm" />
        </UserHoverCard>
        <div class="board__who">
          <span class="board__name" tabindex="0">
            <UserLink :user="u">{{ u.me ? 'You' : u.name }}</UserLink>
            <span class="board__tier" :title="`${tier(u).label} ${tier(u).division} · ${tier(u).dots} DOTS`">{{ tier(u).icon }}</span>
          </span>
          <span class="board__meta"><UserLink :user="u">@{{ u.username }}</UserLink> · 🔥 {{ u.streak }}d</span>
        </div>
        <span
          class="board__delta"
          :class="{ 'board__delta--up': u.delta > 0, 'board__delta--down': u.delta < 0 }"
        >{{ u.delta > 0 ? `▲${u.delta}` : u.delta < 0 ? `▼${-u.delta}` : '–' }}</span>
        <span class="board__points">{{ u.points.toLocaleString() }}</span>
      </div>

      <template v-if="tab === 'global'">
        <div class="board__gap">···</div>
        <div class="board__row board__row--me">
          <span class="board__pos">{{ globalBoard.me.rank.toLocaleString() }}</span>
          <Avatar :src="globalBoard.me.avatar" alt="You" size="sm" />
          <div class="board__who">
            <span class="board__name">You <span class="board__tier" :title="`${tier(globalBoard.me).label} ${tier(globalBoard.me).division}`">{{ tier(globalBoard.me).icon }}</span></span>
            <span class="board__meta">top {{ Math.ceil((globalBoard.me.rank / globalBoard.totalAthletes) * 100) }}% of {{ globalBoard.totalAthletes.toLocaleString() }} athletes</span>
          </div>
          <span class="board__delta board__delta--up">▲{{ globalBoard.me.delta }}</span>
          <span class="board__points">{{ globalBoard.me.points.toLocaleString() }}</span>
        </div>
      </template>
    </Card>

    <!-- Tiers -->
    <Card padding="md" class="tiers">
      <div class="tiers__head">
        <span class="tiers__title">Tiers · strength score</span>
        <button type="button" class="tiers__how" @click="infoOpen = true">How ranks work ›</button>
      </div>
      <div class="tiers__list">
        <div v-for="r in TIERS" :key="r.id" class="tiers__item" :style="{ '--tier-color': r.color }">
          <span class="tiers__icon">{{ r.icon }}</span>
          <span class="tiers__label">{{ r.label }}</span>
          <span v-if="needsReview(r.id)" class="tiers__review" title="Lifts reviewed by the community">🎥</span>
          <span class="tiers__min">{{ r.min }}+</span>
        </div>
      </div>
    </Card>

    <p class="ranking__formula">{{ POINTS_FORMULA }}</p>
    <p class="ranking__formula">
      Tier = best push + pull + legs 1RM, scaled to bodyweight &amp; sex (DOTS) ·
      🎥 from Diamond up, lifts are community-reviewed
    </p>

    <RankInfo :open="infoOpen" @close="infoOpen = false" />
  </div>
</template>

<style scoped>
.ranking { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }

.ranking__tabs { display: flex; align-items: center; gap: var(--space-2); }
.ranking__sub { margin-left: auto; color: var(--color-text-dim); font-size: var(--fs-xs); }

/* Podium */
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: var(--space-6);
}
.podium__spot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 0;
}
.podium__spot--first { padding-bottom: var(--space-4); }
.podium__medal { font-size: 1.4rem; }
.podium__name {
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
  max-width: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.podium__spot--me .podium__name { color: var(--color-accent); }
.podium__points {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  font-variant-numeric: tabular-nums;
}
.podium__tier { font-size: var(--fs-xs); color: var(--color-text-dim); }

/* Board */
.board { overflow: hidden; }
.board__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.board__row:last-child { border-bottom: none; }
.board__row--me {
  background: var(--color-accent-soft);
  border-left: 3px solid var(--color-accent);
}
.board__pos {
  min-width: 2rem;
  text-align: center;
  font-weight: var(--fw-bold);
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-sm);
  flex-shrink: 0;
}
.board__who { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.board__name {
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.board__tier { font-size: var(--fs-xs); }
.board__meta { font-size: var(--fs-xs); color: var(--color-text-dim); }
.board__delta {
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-dim);
  flex-shrink: 0;
}
.board__delta--up { color: var(--color-success); }
.board__delta--down { color: var(--color-danger); }
.board__points {
  font-weight: var(--fw-bold);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.board__gap {
  text-align: center;
  color: var(--color-text-dim);
  padding: var(--space-1);
  letter-spacing: 0.3em;
  border-bottom: 1px solid var(--color-border);
}

/* Tiers */
.tiers { display: flex; flex-direction: column; gap: var(--space-3); }
.tiers__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.tiers__how {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-accent);
  white-space: nowrap;
}
.tiers__how:hover { text-decoration: underline; }
.tiers__review { font-size: 0.7rem; }
.tiers__title {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-dim);
}
.tiers__list {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  scrollbar-width: none;
}
.tiers__list::-webkit-scrollbar { display: none; }
.tiers__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid color-mix(in srgb, var(--tier-color) 35%, transparent);
  background: color-mix(in srgb, var(--tier-color) 8%, transparent);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.tiers__icon { font-size: 1.1rem; }
.tiers__label { font-size: var(--fs-xs); font-weight: var(--fw-semibold); color: var(--tier-color); }
.tiers__min { font-size: 0.65rem; color: var(--color-text-dim); font-variant-numeric: tabular-nums; }

.ranking__formula {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  text-align: center;
  padding-bottom: var(--space-2);
}
</style>
