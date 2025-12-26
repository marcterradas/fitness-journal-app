<template>
  <div class="journal">
    <DaySelector 
      :formattedDate="formattedDate"
      @previous="previousDay"
      @next="nextDay"
    />
    <WorkoutCard :date="currentDate" />
  </div>
</template>

<script setup>
import DaySelector from '@/components/DaySelector.vue';
import WorkoutCard from '@/components/WorkoutCard.vue';
import { useDateNavigation } from '@/composables/useDateNavigation';

const { currentDate, formattedDate, previousDay, nextDay } = useDateNavigation();
</script>

<style scoped>
.journal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
</style>