import { StyleSheet, View } from 'react-native'
import { PLACEMENT_SESSIONS, REVIEW_TIER, TIERS } from '@/domain/ranking'
import { colors, radius, space } from '@/ui/theme'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import Dialog from '../molecules/Dialog'

const reviewTier = TIERS.find(t => t.id === REVIEW_TIER)

const B = ({ children }) => <Text variant="small" weight="semibold">{children}</Text>

function Step({ n, title, children, code }) {
  return (
    <Row gap={3} align="flex-start">
      <View style={styles.stepN}><Text variant="dim" weight="bold" color={colors.accent}>{n}</Text></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="small" weight="semibold">{title}</Text>
        <Text variant="muted">{children}</Text>
        {!!code && <Text variant="dim" color={colors.textMuted} style={styles.code}>{code}</Text>}
      </View>
    </Row>
  )
}

function Bullets({ items }) {
  return (
    <View style={{ gap: space[1] }}>
      {items.map((it, i) => (
        <Row key={i} align="flex-start">
          <Text variant="dim">•</Text>
          <Text variant="muted" style={{ flex: 1 }}>{it}</Text>
        </Row>
      ))}
    </View>
  )
}

export default function RankInfo({ open, onClose }) {
  return (
    <Dialog open={!!open} onClose={onClose} title="How ranks work">
      <Text variant="muted">
        Your rank measures <B>strength, not activity</B>. Logging more sessions does not move it —
        lifting more, relative to your own bodyweight, does. It is a rating you keep: no monthly reset,
        no decay for taking time off. Once earned, it is yours until you beat it.
      </Text>

      <Step n={1} title="Every set becomes an estimated 1RM" code="100 kg × 5 reps → 116.7 kg">
        Weight × (1 + reps ÷ 30). Reps above 12 count as 12 — past that the estimate lies.
      </Step>
      <Step n={2} title="Bodyweight moves count your body" code="Pull-up @ 75 kg bodyweight + 20 kg → 95 kg">
        Pull-ups lift 100% of you, dips 95%, push-ups 64%. Added plates stack on top.
      </Step>
      <Step n={3} title="Three patterns, best lift of each" code="best push + best pull + best legs = your total">
        Push, pull and legs — your best ever in each, whenever you hit it. A pattern you never train
        counts as zero, so you cannot rank up on bench alone.
      </Step>
      <Step n={4} title="Your total is scaled to your body">
        We convert it to <B>DOTS</B>, the powerlifting standard that adjusts for bodyweight and
        sex. A 60 kg and a 95 kg athlete can hold the same rank — the lighter one just needs less on the bar.
      </Step>

      <Text weight="semibold" style={styles.h}>Tiers</Text>
      <View style={{ gap: 2 }}>
        {TIERS.map(t => (
          <Row key={t.id} style={[styles.tier, { backgroundColor: t.color + '1a' }]}>
            <Text>{t.icon}</Text>
            <Text variant="small" weight="semibold" color={t.color}>{t.label}</Text>
            <Text variant="dim" style={{ marginLeft: 'auto' }}>{t.min}+ DOTS</Text>
          </Row>
        ))}
      </View>
      <Text variant="dim">
        Each tier splits into four divisions (IV → I). The bar under your rank is your progress through the
        current division.
      </Text>

      <Text weight="semibold" style={styles.h}>{reviewTier.icon} {reviewTier.label} and above: community review</Text>
      <Text variant="muted">
        From {reviewTier.label} up, scores are not taken on trust. Every lift that counts toward your total
        needs a video attached, and the community reviews it:
      </Text>
      <Bullets items={[
        'Attach a clip to the set — full lift, plates visible, no cuts.',
        <>Reviewers at your tier or higher vote it <B>valid</B> or <B>invalid</B>.</>,
        'A lift needs a clear majority to keep counting. Rejected lifts drop out of your total and your rank recalculates.',
        `Unreviewed lifts still show on your profile — they just do not score above ${reviewTier.label}.`,
      ]} />
      <Text variant="dim">Below {reviewTier.label} nothing changes: log it and it counts.</Text>

      <Text weight="semibold" style={styles.h}>House rules</Text>
      <Bullets items={[
        <><B>Placement:</B> {PLACEMENT_SESSIONS} logged sessions before a rank appears.</>,
        <><B>No reset, no decay:</B> seasons do not wipe it and time off does not cost it. Come back after a year and your rank is where you left it.</>,
        <><B>It only goes up:</B> a bad session cannot drop you — the score reads your best lift, not your last one.</>,
        <><B>Sanity cap:</B> a set over 5× your bodyweight is treated as a typo and ignored.</>,
      ]} />
      <Text variant="dim">
        Bodyweight is the one thing that moves it both ways: gain weight and the same bar scores fewer
        DOTS, lose weight and it scores more.
      </Text>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  h: { marginTop: space[2] },
  stepN: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  code: { alignSelf: 'flex-start', marginTop: space[1], paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.surface2 },
  tier: { padding: space[2], borderRadius: radius.sm },
})
