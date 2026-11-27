import { Image, StyleSheet, View } from 'react-native'
import { EXERCISE_MEDIA_CREDIT } from '@/api/mock/data/exercises'
import { colors, fs, radius, space } from '@/ui/theme'
import Badge from '../atoms/Badge'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import Dialog from '../molecules/Dialog'

// Open whenever `exercise` is set; onClose clears it in the parent.
export default function ExerciseModal({ exercise, onClose }) {
  const e = exercise
  return (
    <Dialog open={!!e} onClose={onClose} title={e?.name} sub={e && `${e.bodyPart} · ${e.equipment}`}>
      {!!e && (
        <>
          {/* ponytail: still frame stands in for the demo clip; swap for expo-video when clips exist.
              Image paths are web-root (/exercises/*.jpg) — need app/public/ or bundled assets to show. */}
          <View style={styles.video}>
            <Image source={e.image} style={styles.frame} resizeMode="contain" />
            <View style={styles.play}><Text variant="muted" style={{ fontSize: fs.lg }}>▶</Text></View>
            <Text variant="dim" color={colors.textMuted} style={styles.soon}>Demo video coming soon</Text>
          </View>

          <Row wrap>
            <Badge tone="accent" icon="🎯">{e.muscle}</Badge>
            {e.secondary.map(m => <Badge key={m}>{m}</Badge>)}
          </Row>

          <View style={{ gap: space[2] }}>
            {e.steps.map((s, i) => (
              <Row key={i} align="flex-start">
                <Text variant="small" weight="bold" color={colors.accent} style={{ minWidth: 18 }}>{i + 1}.</Text>
                <Text variant="muted" style={{ flex: 1, lineHeight: 21 }}>{s}</Text>
              </Row>
            ))}
          </View>

          <Text variant="dim" style={{ fontSize: 10 }}>{EXERCISE_MEDIA_CREDIT}</Text>
        </>
      )}
    </Dialog>
  )
}

const styles = StyleSheet.create({
  video: {
    height: 200, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  frame: { width: 180, height: 180 },
  play: {
    position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.border,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  soon: {
    position: 'absolute', bottom: space[2], paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill,
    overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.6)', fontSize: 10,
  },
})
