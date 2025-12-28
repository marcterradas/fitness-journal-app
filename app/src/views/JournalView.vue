<script setup>
import DaySelector from '@/components/DaySelector.vue';
import WorkoutCard from '@/components/WorkoutCard.vue';
import { useDateNavigation } from '@/composables/useDateNavigation';
import SectionTitle from '@/components/SectionTitle.vue';

const { currentDate, formattedDate, previousDay, nextDay } = useDateNavigation();
</script>

<template>
  <SectionTitle>Journal</SectionTitle>
  <div class="journal">
    <DaySelector 
      :formattedDate="formattedDate"
      @previous="previousDay"
      @next="nextDay"
    />
    <WorkoutCard :date="currentDate" />
  </div>
</template>

<style scoped>
.journal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
</style>