import { Image, StyleSheet, Text, View } from 'react-native'
import { Dialog } from '@/ui/components/RankInfo'
import { EXERCISE_MEDIA_CREDIT } from '@/api/mock/data/exercises'
import { colors, fs, fw, radius, space } from '@/ui/theme'

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
            <View style={styles.play}><Text style={{ color: colors.textMuted, fontSize: fs.lg }}>▶</Text></View>
            <Text style={styles.soon}>Demo video coming soon</Text>
          </View>

          <View style={styles.chips}>
            <Text style={[styles.chip, styles.chipMain]}>🎯 {e.muscle}</Text>
            {e.secondary.map(m => <Text key={m} style={styles.chip}>{m}</Text>)}
          </View>

          <View style={{ gap: space[2] }}>
            {e.steps.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: space[2] }}>
                <Text style={styles.n}>{i + 1}.</Text>
                <Text style={styles.step}>{s}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.credit}>{EXERCISE_MEDIA_CREDIT}</Text>
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
    overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.6)', fontSize: 10, color: colors.textMuted,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    paddingVertical: 3, paddingHorizontal: 10, borderRadius: radius.pill, overflow: 'hidden',
    backgroundColor: colors.surface2, color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.semibold,
  },
  chipMain: { backgroundColor: colors.accentSoft, color: colors.accent },
  n: { color: colors.accent, fontWeight: fw.bold, fontSize: fs.sm, minWidth: 18 },
  step: { flex: 1, color: colors.textMuted, fontSize: fs.sm, lineHeight: 21 },
  credit: { color: colors.textDim, fontSize: 10 },
})
