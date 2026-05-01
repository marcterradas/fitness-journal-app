<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/Card.vue'
import Chip from '@/components/Chip.vue'
import Stat from '@/components/Stat.vue'
import EmptyState from '@/components/EmptyState.vue'
import JournalEntry from '@/components/JournalEntry.vue'
import WorkoutCalendar from '@/components/WorkoutCalendar.vue'
import { journalEntries, SPORT_TYPES } from '@/mock/workouts'

const sportFilter = ref('all')

const filtered = computed(() => {
  if (sportFilter.value === 'all') return journalEntries
  return journalEntries.filter(e => e.sport === sportFilter.value)
})

const totals = computed(() => {
  const entries = filtered.value
  return {
    sessions: entries.length,
    minutes: entries.reduce((acc, e) => acc + (e.durationMin || 0), 0),
    distance: entries.reduce((acc, e) => acc + (e.distanceKm || 0), 0).toFixed(1),
  }
})

function setFilter(id) { sportFilter.value = id }
</script>

<template>
  <div class="journal">
    <header class="journal__head">
      <div>
        <h1 class="journal__title">Training journal</h1>
        <p class="journal__sub">Your story, one session at a time.</p>
      </div>
      <button class="journal__new">+ New entry</button>
    </header>

    <Card padding="lg">
      <div class="journal__stats">
        <Stat icon="📔" :value="totals.sessions" label="entries" align="start" />
        <Stat icon="⏱" :value="totals.minutes" label="minutes" align="start" />
        <Stat icon="📍" :value="totals.distance" label="km logged" align="start" />
      </div>
      <div class="journal__cal">
        <WorkoutCalendar :entries="journalEntries" />
      </div>
    </Card>

    <div class="journal__filters hide-scrollbar">
      <Chip :active="sportFilter === 'all'" @click="setFilter('all')">All</Chip>
      <Chip
        v-for="s in SPORT_TYPES"
        :key="s.id"
        :active="sportFilter === s.id"
        @click="setFilter(s.id)"
      >
        {{ s.emoji }} {{ s.label }}
      </Chip>
    </div>

    <section v-if="filtered.length" class="journal__list">
      <JournalEntry v-for="e in filtered" :key="e.id" :entry="e" />
    </section>
    <EmptyState
      v-else
      icon="📓"
      title="No entries yet for this filter"
      description="Try a different sport or log your first session."
    />
  </div>
</template>

<style scoped>
.journal {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
}
.journal__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.journal__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
}
.journal__sub {
  color: var(--color-text-muted);
  margin-top: var(--space-1);
  font-size: var(--fs-sm);
}
.journal__new {
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.journal__new:hover { background: var(--color-accent-hover); }

.journal__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-5);
}

.journal__cal { margin-top: var(--space-2); }

.journal__filters {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-1);
}

.journal__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
