import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'
import { AppHeader, Card, Post, ProgressRing, ReviewCard, Row, Screen, StoriesRow, StoryViewer, Text } from '@/ui/components'
import { feedPosts, stories, motivationalQuotes } from '@/api/mock/data/social'
import { currentUser } from '@/api/mock/data/user'
import { weeklyProgress } from '@/api/mock/data/workouts'
import { followedReviews } from '@/api/mock/reviewsStore'
import { colors, fs, sport, space } from '@/ui/theme'

// ponytail: the desktop aside (Challenges, Your reviews, FollowSuggestionsForYou) is dropped —
// it was hidden below 960px and Screen caps at 720. Upgrade: render it under the week card if wanted.
export default function HomeScreen() {
  const { weeklyDone, weeklyGoal, streakDays, minutesThisWeek } = currentUser.stats
  const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length]
  // Index of the story being viewed, or null when the viewer is closed.
  const [openStory, setOpenStory] = useState(null)

  return (
    <Screen>
      <AppHeader />

      <View style={st.storiesBar}>
        <StoriesRow stories={stories} showAdd onOpen={setOpenStory} />
      </View>

      {openStory !== null && (
        <StoryViewer stories={stories} startIndex={openStory} onClose={() => setOpenStory(null)} />
      )}

      <Card padding="md" style={{ gap: 0 }}>
        <Row gap={4}>
          <ProgressRing value={weeklyDone / weeklyGoal} size={64} stroke={6}>
            <Text variant="small" weight="bold">{weeklyDone}/{weeklyGoal}</Text>
          </ProgressRing>
          <View style={st.weekRight}>
            <Row>
              {weeklyProgress.map(d => (
                <View key={d.day} style={st.wday}>
                  <View style={[st.dot, d.done && { backgroundColor: sport[d.sport], borderColor: 'transparent' }]} />
                  <Text variant="dim" style={{ fontSize: 10 }}>{d.day[0]}</Text>
                </View>
              ))}
            </Row>
            <Text variant="dim" color={colors.textMuted}>🔥 {streakDays} day streak · ⏱ {minutesThisWeek} min this week</Text>
          </View>
          <Link href="/journal" style={st.link}>Journal ›</Link>
        </Row>
        <Text variant="dim" style={st.quote}>“{quote}”</Text>
      </Card>

      <View style={st.feed}>
        {/* Only lifts from high-tier athletes you follow interrupt the feed; the rest live in Explore. */}
        {followedReviews().map(s => (
          <ReviewCard key={s.id} sub={s} reason={`You follow ${s.athlete.name} — their lift needs verifying`} />
        ))}
        {feedPosts.map(p => <Post key={p.id} post={p} />)}
      </View>
    </Screen>
  )
}

const st = StyleSheet.create({
  storiesBar: { marginHorizontal: -space[4], paddingHorizontal: space[4], borderBottomWidth: 1, borderBottomColor: colors.border },
  weekRight: { flex: 1, minWidth: 0, gap: space[2] },
  wday: { alignItems: 'center', gap: 3 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  link: { fontSize: fs.xs, color: colors.accent },
  quote: {
    marginTop: space[3], paddingTop: space[3], borderTopWidth: 1, borderTopColor: colors.border,
    fontStyle: 'italic',
  },
  feed: { gap: space[4], marginTop: space[2] },
})
