<script setup>
  import Post from '@/components/Post.vue';
</script>

<template>
  <div class="home">
    <Post />
    <Post />
    <Post />
  </div>
</template>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
  }
</style>