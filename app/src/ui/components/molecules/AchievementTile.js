import { StyleSheet, View } from 'react-native'
import { colors, radius, space } from '@/ui/theme'
import Text from '../atoms/Text'

// `style` lets the parent size the tile inside its wrap grid.
export default function AchievementTile({ a, style }) {
  return (
    <View style={[st.ach, !a.earned && st.locked, a.done && st.done, style]}>
      <Text style={{ fontSize: 24 }}>{a.earned ? a.icon : '🔒'}</Text>
      <Text variant="dim" color={colors.text} weight="semibold" align="center" numberOfLines={2}>{a.label}</Text>

      {/* Rung pips: how far up this ladder you are at a glance */}
      <View style={st.pips}>
        {Array.from({ length: a.levels }, (_, i) => (
          <View key={i} style={[st.pip, i < a.level && st.pipOn]} />
        ))}
      </View>

      {!a.done && (
        <View style={st.track}><View style={[st.bar, { width: `${a.progress * 100}%` }]} /></View>
      )}
      <Text variant="dim" style={st.meta}>{a.done ? 'Maxed out' : a.valueLabel}</Text>
    </View>
  )
}

const st = StyleSheet.create({
  ach: {
    alignItems: 'center', gap: space[1], padding: space[3],
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  locked: { opacity: 0.55 },
  done: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  pips: { flexDirection: 'row', gap: 3 },
  pip: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  pipOn: { backgroundColor: colors.accent, borderColor: 'transparent' },
  track: { width: '100%', height: 3, borderRadius: 999, backgroundColor: colors.surface2, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.accent },
  meta: { fontSize: 10, fontVariant: ['tabular-nums'] },
})
