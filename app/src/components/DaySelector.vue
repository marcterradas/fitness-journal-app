<script setup>
import Button from '@/components/Button.vue';

defineProps({
  formattedDate: {
    type: String,
    required: true
  }
})

defineEmits(['previous', 'next'])
</script>

<template>
  <div class="day-selector">
    <Button class="day-selector__button" @click="$emit('previous')" aria-label="Previous day">
      &larr;
    </Button>
    <span class="day-selector__date">{{ formattedDate }}</span>
    <Button class="day-selector__button" @click="$emit('next')" aria-label="Next day">
      &rarr;
    </Button>
  </div>
</template>

<style scoped>
.day-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  width: 100%;
}

.day-selector__button {
  background-color: transparent;
  color: #fff;
}

.day-selector__date {
  font-size: 1rem;
}
</style>