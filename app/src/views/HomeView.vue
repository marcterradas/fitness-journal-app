<script setup>
  import Post from '@/components/Post.vue';
  import SectionTitle from '@/components/SectionTitle.vue';
</script>

<template>
  <SectionTitle>Home</SectionTitle>
  <div class="home">
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