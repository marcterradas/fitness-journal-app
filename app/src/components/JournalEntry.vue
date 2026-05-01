<script setup>
import { computed } from 'vue'
import Card from '@/components/Card.vue'
import Badge from '@/components/Badge.vue'
import SportIcon from '@/components/SportIcon.vue'
import { MOODS } from '@/mock/workouts'

const props = defineProps({
  entry: { type: Object, required: true },
})

const mood = computed(() => MOODS.find(m => m.id === props.entry.mood))

const formattedDate = computed(() => {
  const d = new Date(props.entry.date)
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(d)
})

function rpeColor(rpe) {
  if (rpe >= 8) return 'var(--color-danger)'
  if (rpe >= 6) return 'var(--color-warning)'
  if (rpe >= 4) return 'var(--color-accent)'
  return 'var(--color-secondary)'
}
</script>

<template>
  <Card padding="md" class="entry">
    <div class="entry__head">
      <SportIcon :sport="entry.sport" size="md" />
      <div class="entry__main">
        <div class="entry__row">
          <h3 class="entry__title">{{ entry.title }}</h3>
          <span class="entry__date">{{ formattedDate }}</span>
        </div>
        <div class="entry__meta">
          <Badge :tone="entry.sport">{{ entry.sport }}</Badge>
          <Badge v-if="mood" tone="mood" :icon="mood.emoji">{{ mood.label }}</Badge>
          <span v-if="entry.durationMin" class="entry__chip">⏱ {{ entry.durationMin }} min</span>
          <span v-if="entry.distanceKm" class="entry__chip">📍 {{ entry.distanceKm }} km</span>
          <span v-if="entry.volumeKg" class="entry__chip">🏋️ {{ entry.volumeKg.toLocaleString() }} kg</span>
        </div>
      </div>
    </div>

    <p v-if="entry.notes" class="entry__notes">{{ entry.notes }}</p>

    <div v-if="entry.rpe" class="entry__rpe">
      <span class="entry__rpe-label">Effort (RPE)</span>
      <div class="entry__rpe-bar">
        <div
          class="entry__rpe-fill"
          :style="{ width: `${(entry.rpe / 10) * 100}%`, background: rpeColor(entry.rpe) }"
        />
      </div>
      <span class="entry__rpe-value">{{ entry.rpe }}/10</span>
    </div>
  </Card>
</template>

<style scoped>
.entry { display: flex; flex-direction: column; gap: var(--space-3); }
.entry__head { display: flex; gap: var(--space-3); align-items: flex-start; }
.entry__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.entry__row { display: flex; justify-content: space-between; gap: var(--space-3); align-items: baseline; }
.entry__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}
.entry__date { font-size: var(--fs-xs); color: var(--color-text-dim); white-space: nowrap; }
.entry__meta { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
.entry__chip {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  padding: 0.2rem 0.5rem;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  font-variant-numeric: tabular-nums;
}
.entry__notes {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  line-height: 1.5;
  padding-left: calc(2.5rem + var(--space-3));
  border-left: 2px solid var(--color-border);
  margin-left: 1.25rem;
  padding: var(--space-2) 0 var(--space-2) var(--space-3);
}
.entry__rpe {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--fs-xs);
}
.entry__rpe-label { color: var(--color-text-dim); white-space: nowrap; }
.entry__rpe-bar {
  flex: 1;
  height: 6px;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.entry__rpe-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width var(--t-med) var(--ease);
}
.entry__rpe-value {
  color: var(--color-text);
  font-weight: var(--fw-semibold);
  font-variant-numeric: tabular-nums;
}
</style>
