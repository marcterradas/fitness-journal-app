import { ref, computed } from 'vue'

export function useDateNavigation() {
  const currentDate = ref(new Date())

  const formattedDate = computed(() => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    }).format(currentDate.value)
  })

  function previousDay() {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 1)
    currentDate.value = newDate
  }

  function nextDay() {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 1)
    currentDate.value = newDate
  }

  return {
    currentDate,
    formattedDate,
    previousDay,
    nextDay
  }
}
