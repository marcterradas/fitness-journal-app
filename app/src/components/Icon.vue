<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: String, default: '1.15rem' },
})
</script>

<template>
  <span
    class="icon"
    :style="{ '--mask-url': `url(/${name}.svg)`, width: size, height: size }"
    aria-hidden="true"
  />
</template>

<style scoped>
.icon {
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: var(--mask-url) no-repeat center / contain;
          mask: var(--mask-url) no-repeat center / contain;
  flex-shrink: 0;
}
</style>
