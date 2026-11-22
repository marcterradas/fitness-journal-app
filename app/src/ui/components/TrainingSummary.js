import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { journalEntries, SPORT_TYPES, ymd } from '@/api/mock/data/workouts'
import { colors, fs, fw, radius, space, sportColor } from '@/ui/theme'

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
    <View style={st.ts}>
      <View style={st.block}>
        <View style={st.head}>
          <Text style={st.h}>Last {WEEKS} weeks</Text>
          <Text style={st.meta}>{activeDays} active days</Text>
        </View>
        <View style={st.heat}>
          <View style={st.col}>
            {DAY_LABELS.map((l, i) => <Text key={i} style={st.day}>{l}</Text>)}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.grid}>
            {grid.map((week, w) => (
              <View key={w} style={st.col}>
                {week.map(d => <View key={d.key} style={[st.cell, { backgroundColor: LEVEL_BG[d.level] }]} />)}
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={st.legend}>
          <Text style={st.legendText}>Rest</Text>
          {LEVEL_BG.map((bg, l) => <View key={l} style={[st.cell, { backgroundColor: bg }]} />)}
          <Text style={st.legendText}>75+ min</Text>
        </View>
      </View>

      <View style={st.block}>
        <Text style={st.h}>Training split</Text>
        <View style={st.bar}>
          {split.map(sp => <View key={sp.id} style={{ width: `${sp.pct}%`, backgroundColor: sportColor(sp.id) }} />)}
        </View>
        <View style={st.splitLegend}>
          {split.map(sp => (
            <View key={sp.id} style={st.item}>
              <View style={[st.dot, { backgroundColor: sportColor(sp.id) }]} />
              <Text style={st.label}>{sp.label}</Text>
              <Text style={st.pct}>{sp.pct}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const st = StyleSheet.create({
  ts: { gap: space[5] },
  block: { gap: space[3] },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[3] },
  h: { fontSize: fs.xs, fontWeight: fw.semibold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.7 },
  meta: { fontSize: fs.xs, color: colors.textDim, fontVariant: ['tabular-nums'] },

  heat: { flexDirection: 'row', gap: space[2] },
  col: { gap: 3 },
  grid: { gap: 3 },
  day: { fontSize: 10, color: colors.textDim, height: 12, lineHeight: 12 },
  cell: { width: 12, height: 12, borderRadius: 3 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendText: { fontSize: 10, color: colors.textDim },

  bar: { flexDirection: 'row', gap: 2, height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  splitLegend: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[2], columnGap: space[3] },
  item: { flexDirection: 'row', alignItems: 'center', gap: space[2], minWidth: 130, flexGrow: 1, flexBasis: 130 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { flex: 1, fontSize: fs.xs, color: colors.textMuted },
  pct: { fontSize: fs.xs, color: colors.text, fontVariant: ['tabular-nums'] },
})
