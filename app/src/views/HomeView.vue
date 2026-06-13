<script setup>
import StoriesRow from '@/components/StoriesRow.vue'
import Post from '@/components/Post.vue'
import FollowSuggestionsForYou from '@/components/FollowSuggestionsForYou.vue'
import { feedPosts, stories } from '@/mock/social'
</script>

<template>
  <div class="home">
    <section class="stories-bar">
      <StoriesRow :stories="stories" show-add />
    </section>

    <div class="home__body">
      <section class="home__feed">
        <Post v-for="p in feedPosts" :key="p.id" :post="p" />
      </section>

      <aside class="home__aside">
        <FollowSuggestionsForYou />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
}

.stories-bar {
  margin: 0 calc(-1 * var(--space-4));
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
@media (min-width: 600px) {
  .stories-bar {
    margin: 0 calc(-1 * var(--space-5));
    padding: var(--space-2) var(--space-5);
  }
}
@media (min-width: 960px) {
  .stories-bar {
    margin: 0;
    padding: var(--space-2) 0;
  }
}

.home__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.home__feed {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.home__aside {
  width: 100%;
}

@media (min-width: 960px) {
  .home__body {
    flex-direction: row;
    align-items: flex-start;
  }
  .home__feed {
    flex: 1 1 auto;
  }
  .home__aside {
    width: 300px;
    flex: 0 0 300px;
    position: sticky;
    top: var(--space-5);
  }
}
</style>
