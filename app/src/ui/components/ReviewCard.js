import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Card, UserLink } from '@/ui/components/ui'
import { tierFromDots } from '@/domain/ranking'
import { myVote, tallyOf, vote } from '@/api/mock/reviewsStore'
import { colors, fs, fw, radius, space } from '@/ui/theme'

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
      <View style={styles.head}>
        <Text style={[styles.eyebrow, { color: tier.color }]}>🎥 COMMUNITY REVIEW</Text>
        <Text style={styles.dim}>{sub.submittedAgo}</Text>
      </View>

      {!!reason && <Text style={styles.dim}>{reason}</Text>}

      <View style={styles.who}>
        <Avatar src={sub.athlete.avatar} size="md" ring="accent" />
        <View>
          <UserLink user={sub.athlete} style={{ fontSize: fs.sm }}>{sub.athlete.name}</UserLink>
          <Text style={{ fontSize: fs.xs, color: tier.color }}>
            {tier.icon} {tier.label} {tier.division} · {tier.dots} DOTS
          </Text>
        </View>
      </View>

      <View style={{ gap: 2 }}>
        <Text style={styles.weight}>{sub.weightKg} kg × {sub.reps}</Text>
        <Text style={styles.muted}>{sub.exercise} · at {sub.athlete.bodyweightKg} kg bodyweight</Text>
      </View>

      {/* ponytail: placeholder frame — real clips land when uploads exist */}
      <View style={styles.video}>
        <Text style={styles.play}>▶</Text>
        <Text style={styles.dur}>0:{sub.videoSeconds}</Text>
      </View>

      <Text style={styles.ask}>Full lift, plates visible, no cuts? Your vote decides whether it counts toward their rank.</Text>

      <View style={styles.actions}>
        <Button size="sm" disabled={!!cast} onPress={() => cast_('valid')} style={{ flex: 1 }}>👍 Approve</Button>
        <Button variant="danger" size="sm" disabled={!!cast} onPress={() => cast_('invalid')} style={{ flex: 1 }}>👎 Deny</Button>
      </View>

      <View style={{ gap: space[1] }}>
        <View style={styles.track}>
          <View style={[styles.bar, { width: `${tally.progress * 100}%`, backgroundColor: tier.color }]} />
        </View>
        <Text style={styles.dim}>
          {tally.valid} approve · {tally.invalid} deny · {Math.max(0, sub.votes.needed - tally.cast)} votes to close
        </Text>
      </View>

      {!!cast && (
        <Text style={styles.done}>{cast === 'valid' ? '👍 Approved' : '👎 Denied'} — vote recorded, +1 review.</Text>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: fs.xs, fontWeight: fw.bold, letterSpacing: 0.5 },
  dim: { fontSize: fs.xs, color: colors.textDim },
  muted: { fontSize: fs.xs, color: colors.textMuted },
  who: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  weight: { fontSize: fs.xl, fontWeight: fw.bold, color: colors.text, fontVariant: ['tabular-nums'] },
  video: {
    height: 140, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
  },
  play: { fontSize: 28, color: colors.textMuted },
  dur: {
    position: 'absolute', right: space[2], bottom: space[2], paddingHorizontal: 6, paddingVertical: 1,
    borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.55)', fontSize: 10, color: colors.textMuted, overflow: 'hidden',
  },
  ask: { fontSize: fs.sm, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: space[2] },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: radius.pill },
  done: { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.accent },
})
