import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Chip from '../atoms/Chip'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import { trend } from '@/domain/journal'
import { parseYmd } from '@/domain/dates'
import { colors, radius, space } from '@/ui/theme'

const fmtDate = (d) => parseYmd(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

// Top-set progress per exercise. Props: series ([{ id, name, unit, points: [{ date, value }] }]).
// ponytail: old SVG line chart → column bars (no SVG lib); tap a bar instead of hover. Upgrade: react-native-svg.
export default function ExerciseProgress({ series }) {
  const [selectedId, setSelectedId] = useState(series[0].id)
  const [picked, setPicked] = useState(null)

  const exercise = series.find(e => e.id === selectedId)
  const pts = exercise.points
  const { min, max, span, diff, pct } = trend(pts)
  const activeIdx = picked ?? pts.length - 1
  const active = pts[activeIdx]

  return (
    <View style={{ gap: space[3] }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }}>
        {series.map(e => (
          <Chip key={e.id} size="sm" active={e.id === selectedId} onPress={() => { setSelectedId(e.id); setPicked(null) }}>
            {e.name}
          </Chip>
        ))}
      </ScrollView>

      <Row gap={3} justify="space-between" align="flex-start">
        <View style={{ flex: 1 }}>
          <Text weight="semibold">{exercise.name}</Text>
          <Text variant="dim">Top set · last {pts.length} weeks</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <Text variant="h2">{active.value}<Text variant="dim"> {exercise.unit}</Text></Text>
          <Text variant="dim" color={diff < 0 ? colors.danger : colors.accent}>
            {diff >= 0 ? '+' : ''}{diff}{exercise.unit} ({pct}%)
          </Text>
        </View>
      </Row>

      <View>
        <Text variant="dim" style={st.axis}>{max}{exercise.unit}</Text>
        <View style={st.chart}>
          {pts.map((p, i) => (
            <Pressable key={i} style={st.col} onPress={() => setPicked(picked === i ? null : i)}>
              {/* min still shows a stub (15%) so the lowest week is visible */}
              <View style={[st.bar, { height: `${15 + ((p.value - min) / span) * 85}%` }, i === activeIdx && st.barActive]} />
            </Pressable>
          ))}
        </View>
        <Row justify="space-between" style={{ marginTop: 4 }}>
          <Text variant="dim" style={st.axis}>{fmtDate(pts[0].date)}</Text>
          <Text variant="dim" style={st.axis}>{fmtDate(pts.at(-1).date)}</Text>
        </Row>
      </View>

      <Text variant="dim">{fmtDate(active.date)} · {active.value}{exercise.unit}</Text>
    </View>
  )
}

const st = StyleSheet.create({
  chart: { height: 100, flexDirection: 'row', alignItems: 'flex-end', gap: 3, borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 4 },
  col: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { backgroundColor: colors.accentSoft, borderTopLeftRadius: radius.sm / 2, borderTopRightRadius: radius.sm / 2, borderTopWidth: 2, borderTopColor: colors.accent },
  barActive: { backgroundColor: colors.accent },
  axis: { fontSize: 10 },
})
