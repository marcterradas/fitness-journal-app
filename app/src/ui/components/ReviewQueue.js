import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Card, Chip, EmptyState } from '@/ui/components/ui'
import ReviewCard from '@/ui/components/ReviewCard'
import { REVIEW_TIER, TIERS } from '@/domain/ranking'
import { reviewerStats } from '@/api/mock/data/leaderboard'
import { pendingReviews, reviewedCount, reviewerBadge } from '@/api/mock/reviewsStore'
import { colors, fs, fw, radius, space } from '@/ui/theme'

const reviewTier = TIERS.find(t => t.id === REVIEW_TIER)

export default function ReviewQueue() {
  const [filter, setFilter] = useState('all')
  // Snapshot the queue once so a voted card stays visible with its "vote recorded" line.
  const [all] = useState(pendingReviews)
  const [, bump] = useState(0)
  const badge = reviewerBadge()
  const followingCount = all.filter(s => s.athlete.followed).length
  const queue = filter === 'following' ? all.filter(s => s.athlete.followed) : all

  return (
    <View style={styles.root}>
      {/* Reward for contributing: the badge ladder, driven by lifetime reviews. */}
      <Card>
        <View style={styles.head}>
          <Text style={{ fontSize: 28 }}>{badge.earned?.icon ?? '🔍'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{badge.earned?.label ?? 'Not a reviewer yet'}</Text>
            <Text style={styles.sub}>
              {reviewedCount().toLocaleString()} lifts reviewed · {Math.round(reviewerStats.agreementRate * 100)}% agreement
            </Text>
          </View>
          <Text style={styles.rank}>
            #{reviewerStats.rank.toLocaleString()}
            <Text style={styles.sub}> of {reviewerStats.totalReviewers.toLocaleString()}</Text>
          </Text>
        </View>

        {!!badge.next && (
          <View style={{ gap: space[1] }}>
            <View style={styles.track}><View style={[styles.bar, { width: `${badge.progress * 100}%` }]} /></View>
            <Text style={styles.sub}>{badge.toNext} more to {badge.next.icon} {badge.next.label}</Text>
          </View>
        )}

        <View style={styles.badges}>
          {badge.all.map(b => (
            <Text key={b.id} style={[styles.badge, b.earned && styles.badgeOn]}>{b.icon} {b.label}</Text>
          ))}
        </View>
      </Card>

      <Text style={styles.why}>
        {reviewTier.icon} {reviewTier.label} and above must film their scoring lifts. The community votes;
        a lift only counts toward a rank once it passes.
      </Text>

      <View style={styles.tabs}>
        <Chip active={filter === 'all'} onPress={() => setFilter('all')}>🌍 All ({all.length})</Chip>
        <Chip active={filter === 'following'} onPress={() => setFilter('following')}>👥 Following ({followingCount})</Chip>
      </View>

      {queue.length ? (
        <View style={{ gap: space[4] }}>
          {queue.map(s => (
            <ReviewCard
              key={s.id}
              sub={s}
              reason={s.athlete.followed ? `You follow ${s.athlete.name}` : ''}
              onVote={() => bump(n => n + 1)}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="✅" title="Queue clear" description="No lifts waiting on your vote. New submissions land here as they come in." />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: space[4] },
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  label: { color: colors.text, fontWeight: fw.semibold },
  sub: { fontSize: fs.xs, fontWeight: fw.medium, color: colors.textDim },
  rank: { color: colors.text, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  badge: {
    paddingVertical: 3, paddingHorizontal: 10, borderRadius: radius.pill, overflow: 'hidden',
    fontSize: fs.xs, fontWeight: fw.semibold, backgroundColor: colors.surface2, color: colors.textDim, opacity: 0.55,
  },
  badgeOn: { backgroundColor: colors.accentSoft, color: colors.accent, opacity: 1 },
  why: { fontSize: fs.sm, color: colors.textMuted },
  tabs: { flexDirection: 'row', gap: space[2] },
})
