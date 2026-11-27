import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Avatar from '../atoms/Avatar'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import UserLink from '../molecules/UserLink'
import { tierFromDots } from '@/domain/ranking'
import { myVote, tallyOf, vote } from '@/api/mock/reviewsStore'
import { colors, fs, radius, space } from '@/ui/theme'

// `reason`: Home shows it because you follow the athlete; Explore shows the whole queue.
export default function ReviewCard({ sub, reason = '', onVote }) {
  // reviews.js is plain module state, so bump local state to re-render after voting.
  const [, bump] = useState(0)
  const tier = tierFromDots(sub.athlete.dots)
  const cast = myVote(sub.id)
  const tally = tallyOf(sub)

  function cast_(verdict) {
    vote(sub.id, verdict)
    bump(n => n + 1)
    onVote?.(verdict)
  }

  return (
    <Card>
      <Row justify="space-between">
        <Text variant="dim" weight="bold" color={tier.color} style={{ letterSpacing: 0.5 }}>🎥 COMMUNITY REVIEW</Text>
        <Text variant="dim">{sub.submittedAgo}</Text>
      </Row>

      {!!reason && <Text variant="dim">{reason}</Text>}

      <Row gap={3}>
        <Avatar src={sub.athlete.avatar} size="md" ring="accent" />
        <View>
          <UserLink user={sub.athlete} style={{ fontSize: fs.sm }}>{sub.athlete.name}</UserLink>
          <Text variant="dim" color={tier.color}>
            {tier.icon} {tier.label} {tier.division} · {tier.dots} DOTS
          </Text>
        </View>
      </Row>

      <View style={{ gap: 2 }}>
        <Text variant="h2" style={styles.nums}>{sub.weightKg} kg × {sub.reps}</Text>
        <Text variant="dim" color={colors.textMuted}>{sub.exercise} · at {sub.athlete.bodyweightKg} kg bodyweight</Text>
      </View>

      {/* ponytail: placeholder frame — real clips land when uploads exist */}
      <View style={styles.video}>
        <Text variant="muted" style={{ fontSize: 28 }}>▶</Text>
        <Text variant="dim" color={colors.textMuted} style={styles.dur}>0:{sub.videoSeconds}</Text>
      </View>

      <Text variant="muted">Full lift, plates visible, no cuts? Your vote decides whether it counts toward their rank.</Text>

      <Row>
        <Button size="sm" disabled={!!cast} onPress={() => cast_('valid')} style={{ flex: 1 }}>👍 Approve</Button>
        <Button variant="danger" size="sm" disabled={!!cast} onPress={() => cast_('invalid')} style={{ flex: 1 }}>👎 Deny</Button>
      </Row>

      <View style={{ gap: space[1] }}>
        <View style={styles.track}>
          <View style={[styles.bar, { width: `${tally.progress * 100}%`, backgroundColor: tier.color }]} />
        </View>
        <Text variant="dim">
          {tally.valid} approve · {tally.invalid} deny · {Math.max(0, sub.votes.needed - tally.cast)} votes to close
        </Text>
      </View>

      {!!cast && (
        <Text variant="small" weight="semibold" color={colors.accent}>{cast === 'valid' ? '👍 Approved' : '👎 Denied'} — vote recorded, +1 review.</Text>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  nums: { fontVariant: ['tabular-nums'] },
  video: {
    height: 140, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
  },
  dur: {
    position: 'absolute', right: space[2], bottom: space[2], paddingHorizontal: 6, paddingVertical: 1,
    borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.55)', fontSize: 10, overflow: 'hidden',
  },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: radius.pill },
})
