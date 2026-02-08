<script setup>
  import Post from '@/components/Post.vue';
  import SectionTitle from '@/components/SectionTitle.vue';
  import FollowSuggestionsForYou from '@/components/FollowSuggestionsForYou.vue';
  import FollowSuggestionsTopAthletes from '@/components/FollowSuggestionsTopAthletes.vue';
</script>

<template>
  <SectionTitle>Home</SectionTitle>
  <div class="home">
    <main class="home__content">
      <Post />
    </main>

    <aside class="home__sidebar">
      <FollowSuggestionsForYou />
      <FollowSuggestionsTopAthletes />
    </aside>
  </div>
</template>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 1rem;
  }

  .home__content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .home__sidebar {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 900px) {
    .home {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .home__content {
      max-width: 820px;
      margin-right: 0;
      align-items: stretch;
    }

    .home__sidebar {
      width: 320px;
      flex: 0 0 320px;
      position: sticky;
      top: 80px;
      align-self: flex-start;
    }
  }
</style>