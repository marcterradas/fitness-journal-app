<script setup>
import Avatar from '@/components/Avatar.vue'

defineProps({
  stories: { type: Array, required: true },
  showAdd: { type: Boolean, default: false },
})
</script>

<template>
  <div class="stories hide-scrollbar">
    <button v-if="showAdd" class="story story--add" type="button">
      <span class="story__add-icon">+</span>
      <span class="story__label">New</span>
    </button>
    <button
      v-for="s in stories"
      :key="s.id"
      class="story"
      type="button"
    >
      <span class="story__ring">
        <span class="story__cover" :style="{ backgroundImage: `url(${s.cover})` }">
          <span class="story__emoji">{{ s.emoji }}</span>
        </span>
      </span>
      <span class="story__label">{{ s.title }}</span>
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
  align-items: center;
  justify-content: center;
}
.story__cover {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid var(--color-bg);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 4px;
}
.story__emoji {
  background: var(--color-bg);
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
.story--add {
  border: 2px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
}
.story--add .story__add-icon,
.story__add-icon {
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
.story--add { border: none; }
</style>
