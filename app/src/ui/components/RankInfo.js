import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { PLACEMENT_SESSIONS, REVIEW_TIER, TIERS } from '@/domain/ranking'
import { colors, fs, fw, radius, space } from '@/ui/theme'

const reviewTier = TIERS.find(t => t.id === REVIEW_TIER)

// Centered dialog with header + scrollable body. Also used by ExerciseModal.
export function Dialog({ open, onClose, title, sub, children }) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable swallows taps so only the backdrop closes. */}
        <Pressable style={styles.box} onPress={() => {}}>
          <View style={styles.head}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.title}>{title}</Text>
              {!!sub && <Text style={styles.note}>{sub}</Text>}
            </View>
            <Pressable onPress={onClose} accessibilityLabel="Close" hitSlop={8}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const B = ({ children }) => <Text style={{ color: colors.text, fontWeight: fw.semibold }}>{children}</Text>

function Step({ n, title, children, code }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepN}><Text style={styles.stepNText}>{n}</Text></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.stepT}>{title}</Text>
        <Text style={styles.p}>{children}</Text>
        {!!code && <Text style={styles.code}>{code}</Text>}
      </View>
    </View>
  )
}

function Bullets({ items }) {
  return (
    <View style={{ gap: space[1] }}>
      {items.map((it, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: space[2] }}>
          <Text style={styles.note}>•</Text>
          <Text style={[styles.p, { flex: 1 }]}>{it}</Text>
        </View>
      ))}
    </View>
  )
}

export default function RankInfo({ open, onClose }) {
  return (
    <Dialog open={!!open} onClose={onClose} title="How ranks work">
      <Text style={styles.p}>
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

      <Text style={styles.h}>Tiers</Text>
      <View style={{ gap: 2 }}>
        {TIERS.map(t => (
          <View key={t.id} style={[styles.tier, { backgroundColor: t.color + '1a' }]}>
            <Text>{t.icon}</Text>
            <Text style={{ fontSize: fs.sm, fontWeight: fw.semibold, color: t.color }}>{t.label}</Text>
            <Text style={[styles.note, { marginLeft: 'auto' }]}>{t.min}+ DOTS</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>
        Each tier splits into four divisions (IV → I). The bar under your rank is your progress through the
        current division.
      </Text>

      <Text style={styles.h}>{reviewTier.icon} {reviewTier.label} and above: community review</Text>
      <Text style={styles.p}>
        From {reviewTier.label} up, scores are not taken on trust. Every lift that counts toward your total
        needs a video attached, and the community reviews it:
      </Text>
      <Bullets items={[
        'Attach a clip to the set — full lift, plates visible, no cuts.',
        <>Reviewers at your tier or higher vote it <B>valid</B> or <B>invalid</B>.</>,
        'A lift needs a clear majority to keep counting. Rejected lifts drop out of your total and your rank recalculates.',
        `Unreviewed lifts still show on your profile — they just do not score above ${reviewTier.label}.`,
      ]} />
      <Text style={styles.note}>Below {reviewTier.label} nothing changes: log it and it counts.</Text>

      <Text style={styles.h}>House rules</Text>
      <Bullets items={[
        <><B>Placement:</B> {PLACEMENT_SESSIONS} logged sessions before a rank appears.</>,
        <><B>No reset, no decay:</B> seasons do not wipe it and time off does not cost it. Come back after a year and your rank is where you left it.</>,
        <><B>It only goes up:</B> a bad session cannot drop you — the score reads your best lift, not your last one.</>,
        <><B>Sanity cap:</B> a set over 5× your bodyweight is treated as a typo and ignored.</>,
      ]} />
      <Text style={styles.note}>
        Bodyweight is the one thing that moves it both ways: gain weight and the same bar scores fewer
        DOTS, lose weight and it scores more.
      </Text>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: space[4] },
  box: {
    width: '100%', maxWidth: 560, maxHeight: '85%', backgroundColor: colors.bgElevated,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden',
  },
  head: {
    flexDirection: 'row', alignItems: 'flex-start', gap: space[3], padding: space[4],
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { color: colors.text, fontSize: fs.lg, fontWeight: fw.bold },
  close: { color: colors.textMuted, fontSize: 24, lineHeight: 24, paddingHorizontal: space[1] },
  body: { padding: space[4], gap: space[3] },
  h: { color: colors.text, fontSize: fs.md, fontWeight: fw.semibold, marginTop: space[2] },
  p: { color: colors.textMuted, fontSize: fs.sm },
  note: { color: colors.textDim, fontSize: fs.xs },
  step: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start' },
  stepN: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  stepNText: { color: colors.accent, fontSize: fs.xs, fontWeight: fw.bold },
  stepT: { color: colors.text, fontSize: fs.sm, fontWeight: fw.semibold },
  code: {
    alignSelf: 'flex-start', marginTop: space[1], paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.sm,
    overflow: 'hidden', backgroundColor: colors.surface2, color: colors.textMuted, fontSize: fs.xs,
  },
  tier: { flexDirection: 'row', alignItems: 'center', gap: space[2], padding: space[2], borderRadius: radius.sm },
})
