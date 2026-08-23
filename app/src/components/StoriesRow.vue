<script setup>
defineProps({
  stories: { type: Array, required: true },
  showAdd: { type: Boolean, default: false },
})
defineEmits(['open'])
</script>

<template>
  <div class="stories hide-scrollbar">
    <button v-if="showAdd" class="story" type="button">
      <span class="story__add">+</span>
      <span class="story__label">New</span>
    </button>

    <button
      v-for="(s, i) in stories"
      :key="s.id"
      class="story"
      type="button"
      @click="$emit('open', i)"
    >
      <span class="story__ring" :class="{ 'story__ring--seen': s.seen }">
        <img :src="s.user.avatar" :alt="s.user.name" class="story__avatar" />
      </span>
      <span class="story__label">{{ s.user.username }}</span>
    </button>
  </div>
</template>

<style scoped>
.stories {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding: var(--space-2) 0;
}
.story {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  width: 4.5rem;
}
.story__ring {
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, var(--color-accent), var(--sport-cardio));
  display: flex;
}
.story__ring--seen { background: var(--color-border-strong); }
.story__avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-bg);
}
.story__add {
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 2px dashed var(--color-border-strong);
}
.story__label {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
