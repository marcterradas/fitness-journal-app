<script setup>
import StoriesRow from '@/components/StoriesRow.vue'
import Post from '@/components/Post.vue'
import Card from '@/components/Card.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import FollowSuggestionsForYou from '@/components/FollowSuggestionsForYou.vue'
import { feedPosts, stories, challenges, motivationalQuotes } from '@/mock/social'
import { currentUser } from '@/mock/user'
import { weeklyProgress } from '@/mock/workouts'

const { weeklyDone, weeklyGoal, streakDays, minutesThisWeek } = currentUser.stats
const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length]
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
        <Card padding="md" class="week">
          <div class="aside-head">
            <h3 class="aside-title">Your week</h3>
            <router-link to="/journal" class="aside-link">Journal ›</router-link>
          </div>
          <div class="week__body">
            <ProgressRing :value="weeklyDone / weeklyGoal" :size="72" :stroke="7">
              <span class="week__count">{{ weeklyDone }}/{{ weeklyGoal }}</span>
            </ProgressRing>
            <div class="week__right">
              <div class="week__days">
                <div v-for="d in weeklyProgress" :key="d.day" class="wday" :title="d.done ? `${d.day} — ${d.sport}` : d.day">
                  <span
                    class="wday__dot"
                    :class="{ 'wday__dot--done': d.done }"
                    :style="d.done ? { background: `var(--sport-${d.sport})` } : {}"
                  />
                  <span class="wday__l">{{ d.day[0] }}</span>
                </div>
              </div>
              <span class="week__meta">🔥 {{ streakDays }} day streak · ⏱ {{ minutesThisWeek }} min</span>
            </div>
          </div>
        </Card>

        <Card padding="md" class="chal">
          <div class="aside-head">
            <h3 class="aside-title">Challenges</h3>
            <router-link to="/ranking" class="aside-link">Leaderboard ›</router-link>
          </div>
          <div v-for="c in challenges" :key="c.id" class="chal__row">
            <span class="chal__emoji">{{ c.emoji }}</span>
            <div class="chal__main">
              <span class="chal__title">{{ c.title }}</span>
              <div class="chal__track">
                <div class="chal__bar" :style="{ width: (c.progress * 100) + '%' }" />
              </div>
              <span class="chal__sub">{{ Math.round(c.progress * 100) }}% · {{ c.daysLeft }}d left · {{ c.members.toLocaleString() }} in</span>
            </div>
          </div>
        </Card>

        <FollowSuggestionsForYou />

        <Card padding="md" variant="ghost" class="quote">
          <p class="quote__text">“{{ quote }}”</p>
        </Card>
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
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.aside-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.aside-title {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-dim);
}
.aside-link {
  font-size: var(--fs-xs);
  color: var(--color-accent);
  text-decoration: none;
}
.aside-link:hover { text-decoration: underline; }

/* Your week */
.week__body { display: flex; align-items: center; gap: var(--space-4); }
.week__count { font-size: var(--fs-sm); font-weight: var(--fw-bold); font-variant-numeric: tabular-nums; }
.week__right { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); min-width: 0; }
.week__days { display: flex; gap: var(--space-2); }
.wday { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.wday__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
}
.wday__dot--done { border-color: transparent; }
.wday__l { font-size: 0.65rem; color: var(--color-text-dim); }
.week__meta { font-size: var(--fs-xs); color: var(--color-text-muted); }

/* Challenges */
.chal__row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-2) 0;
}
.chal__row + .chal__row { border-top: 1px solid var(--color-border); }
.chal__emoji { font-size: 1.2rem; }
.chal__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.chal__title { font-size: var(--fs-sm); font-weight: var(--fw-semibold); }
.chal__track {
  height: 4px;
  background: var(--color-surface-2);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.chal__bar { height: 100%; background: var(--color-accent); border-radius: var(--radius-pill); }
.chal__sub { font-size: var(--fs-xs); color: var(--color-text-dim); }

/* Quote */
.quote__text {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  font-style: italic;
  text-align: center;
  line-height: 1.6;
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
