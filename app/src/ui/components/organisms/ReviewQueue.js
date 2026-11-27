import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Badge from '../atoms/Badge'
import Card from '../atoms/Card'
import Chip from '../atoms/Chip'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import EmptyState from '../molecules/EmptyState'
import ReviewCard from './ReviewCard'
import { REVIEW_TIER, TIERS } from '@/domain/ranking'
import { reviewerStats } from '@/api/mock/data/leaderboard'
import { pendingReviews, reviewedCount, reviewerBadge } from '@/api/mock/reviewsStore'
import { colors, radius, space } from '@/ui/theme'

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
    <View style={{ gap: space[4] }}>
      {/* Reward for contributing: the badge ladder, driven by lifetime reviews. */}
      <Card>
        <Row gap={3}>
          <Text style={{ fontSize: 28 }}>{badge.earned?.icon ?? '🔍'}</Text>
          <View style={{ flex: 1 }}>
            <Text weight="semibold">{badge.earned?.label ?? 'Not a reviewer yet'}</Text>
            <Text variant="dim" weight="medium">
              {reviewedCount().toLocaleString()} lifts reviewed · {Math.round(reviewerStats.agreementRate * 100)}% agreement
            </Text>
          </View>
          <Text weight="bold" style={styles.nums}>
            #{reviewerStats.rank.toLocaleString()}
            <Text variant="dim" weight="medium"> of {reviewerStats.totalReviewers.toLocaleString()}</Text>
          </Text>
        </Row>

        {!!badge.next && (
          <View style={{ gap: space[1] }}>
            <View style={styles.track}><View style={[styles.bar, { width: `${badge.progress * 100}%` }]} /></View>
            <Text variant="dim" weight="medium">{badge.toNext} more to {badge.next.icon} {badge.next.label}</Text>
          </View>
        )}

        <Row wrap>
          {badge.all.map(b => (
            <View key={b.id} style={!b.earned && { opacity: 0.55 }}>
              <Badge tone={b.earned ? 'accent' : 'neutral'} icon={b.icon}>{b.label}</Badge>
            </View>
          ))}
        </Row>
      </Card>

      <Text variant="muted">
        {reviewTier.icon} {reviewTier.label} and above must film their scoring lifts. The community votes;
        a lift only counts toward a rank once it passes.
      </Text>

      <Row>
        <Chip active={filter === 'all'} onPress={() => setFilter('all')}>🌍 All ({all.length})</Chip>
        <Chip active={filter === 'following'} onPress={() => setFilter('following')}>👥 Following ({followingCount})</Chip>
      </Row>

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
  nums: { fontVariant: ['tabular-nums'] },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill },
})
