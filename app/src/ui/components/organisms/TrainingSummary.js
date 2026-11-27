import { ScrollView, StyleSheet, View } from 'react-native'
import { journalEntries, SPORT_TYPES, ymd } from '@/api/mock/data/workouts'
import { colors, radius, space, sportColor } from '@/ui/theme'
import Row from '../atoms/Row'
import Text from '../atoms/Text'

const WEEKS = 12
const DAY_LABELS = ['M', '', 'W', '', 'F', '', 'S']
// 0 = rest, 1–4 = intensity buckets (old CSS color-mix of accent over surface-2)
const LEVEL_BG = [colors.surface2, 'rgba(182,243,107,0.3)', 'rgba(182,243,107,0.5)', 'rgba(182,243,107,0.75)', colors.accent]

// ponytail: mock entries are the only source, computed once per render — swap for an API call, keep the shape
function buildGrid() {
  const byDate = new Map()
  for (const e of journalEntries) {
    const prev = byDate.get(e.date)
    byDate.set(e.date, { minutes: (prev?.minutes || 0) + (e.durationMin || 0) })
  }
  const end = new Date()
  end.setHours(0, 0, 0, 0)
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7)) // to Sunday of this week
  const start = new Date(end)
  start.setDate(end.getDate() - (WEEKS * 7 - 1))

  // oldest → newest, one column per week, Mon first
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = new Date(start)
      day.setDate(start.getDate() + w * 7 + d)
      const key = ymd(day)
      const hit = byDate.get(key)
      const level = !hit ? 0 : hit.minutes >= 75 ? 4 : hit.minutes >= 50 ? 3 : hit.minutes >= 25 ? 2 : 1
      return { key, level }
    })
  )
}

function buildSplit() {
  const total = journalEntries.reduce((a, e) => a + (e.durationMin || 0), 0) || 1
  return SPORT_TYPES
    .map(sp => {
      const min = journalEntries.filter(e => e.sport === sp.id).reduce((a, e) => a + (e.durationMin || 0), 0)
      return { ...sp, min, pct: Math.round((min / total) * 100) }
    })
    .filter(sp => sp.min)
    .sort((a, b) => b.min - a.min)
}

export default function TrainingSummary() {
  const grid = buildGrid()
  const split = buildSplit()
  const activeDays = grid.flat().filter(d => d.level).length

  return (
    <View style={{ gap: space[5] }}>
      <View style={st.block}>
        <Row gap={3} align="baseline" justify="space-between">
          <Text variant="overline" color={colors.textMuted}>Last {WEEKS} weeks</Text>
          <Text variant="dim" style={st.nums}>{activeDays} active days</Text>
        </Row>
        <Row align="flex-start">
          <View style={st.col}>
            {DAY_LABELS.map((l, i) => <Text key={i} variant="dim" style={st.day}>{l}</Text>)}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.grid}>
            {grid.map((week, w) => (
              <View key={w} style={st.col}>
                {week.map(d => <View key={d.key} style={[st.cell, { backgroundColor: LEVEL_BG[d.level] }]} />)}
              </View>
            ))}
          </ScrollView>
        </Row>
        <Row gap={1}>
          <Text variant="dim" style={st.tiny}>Rest</Text>
          {LEVEL_BG.map((bg, l) => <View key={l} style={[st.cell, { backgroundColor: bg }]} />)}
          <Text variant="dim" style={st.tiny}>75+ min</Text>
        </Row>
      </View>

      <View style={st.block}>
        <Text variant="overline" color={colors.textMuted}>Training split</Text>
        <View style={st.bar}>
          {split.map(sp => <View key={sp.id} style={{ width: `${sp.pct}%`, backgroundColor: sportColor(sp.id) }} />)}
        </View>
        <View style={st.splitLegend}>
          {split.map(sp => (
            <Row key={sp.id} style={st.item}>
              <View style={[st.dot, { backgroundColor: sportColor(sp.id) }]} />
              <Text variant="dim" color={colors.textMuted} style={{ flex: 1 }}>{sp.label}</Text>
              <Text variant="dim" color={colors.text} style={st.nums}>{sp.pct}%</Text>
            </Row>
          ))}
        </View>
      </View>
    </View>
  )
}

const st = StyleSheet.create({
  block: { gap: space[3] },
  nums: { fontVariant: ['tabular-nums'] },
  col: { gap: 3 },
  grid: { gap: 3 },
  tiny: { fontSize: 10 },
  day: { fontSize: 10, height: 12, lineHeight: 12 },
  cell: { width: 12, height: 12, borderRadius: 3 },
  bar: { flexDirection: 'row', gap: 2, height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  splitLegend: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[2], columnGap: space[3] },
  item: { minWidth: 130, flexGrow: 1, flexBasis: 130 },
  dot: { width: 8, height: 8, borderRadius: 4 },
})
