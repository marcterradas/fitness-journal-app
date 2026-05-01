<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  size: { type: String, default: 'md' },
  ring: { type: String, default: 'none' },
})
</script>

<template>
  <span :class="['avatar', `avatar--${size}`, `avatar--ring-${ring}`]">
    <img :src="src" :alt="alt" class="avatar__img" />
  </span>
</template>

<style scoped>
.avatar {
  display: inline-block;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.avatar--xs { width: 1.5rem; height: 1.5rem; }
.avatar--sm { width: 2rem; height: 2rem; }
.avatar--md { width: 2.75rem; height: 2.75rem; }
.avatar--lg { width: 4rem; height: 4rem; }
.avatar--xl { width: 6rem; height: 6rem; }

.avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.avatar--ring-accent {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.avatar--ring-story {
  background: linear-gradient(135deg, var(--color-accent), var(--sport-cardio));
  padding: 2px;
}
.avatar--ring-story .avatar__img {
  border: 2px solid var(--color-bg);
}
</style>
