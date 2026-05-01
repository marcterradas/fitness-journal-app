<template>
  <h1 class="section-title">
    <slot />
  </h1>
</template>

<style scoped>
.section-title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--color-text);
}
</style>
