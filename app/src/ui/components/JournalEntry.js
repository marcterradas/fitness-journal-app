import { StyleSheet, Text, View } from 'react-native'
import { Badge, Card } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
import { MOODS } from '@/domain/catalog'
import { parseYmd } from '@/domain/dates'
import { colors, fs, fw, radius, space } from '@/ui/theme'

function rpeColor(rpe) {
  if (rpe >= 8) return colors.danger
  if (rpe >= 6) return colors.warning
  if (rpe >= 4) return colors.accent
  return colors.secondary
}

// One journal entry card. Props: entry, style.
export default function JournalEntry({ entry, style }) {
  const mood = MOODS.find(m => m.id === entry.mood)
  // 'YYYY-MM-DD' alone parses as UTC; adding a time makes it local midnight.
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .format(parseYmd(entry.date))

  return (
    <Card padding="md" style={style}>
      <View style={st.head}>
        <SportIcon sport={entry.sport} size="md" />
        <View style={st.main}>
          <View style={st.row}>
            <Text style={st.title}>{entry.title}</Text>
            <Text style={st.date}>{date}</Text>
          </View>
          <View style={st.meta}>
            <Badge tone={entry.sport}>{entry.sport}</Badge>
            {mood && <Badge tone="mood" icon={mood.emoji}>{mood.label}</Badge>}
            {!!entry.durationMin && <Text style={st.chip}>⏱ {entry.durationMin} min</Text>}
            {!!entry.distanceKm && <Text style={st.chip}>📍 {entry.distanceKm} km</Text>}
            {!!entry.volumeKg && <Text style={st.chip}>🏋️ {entry.volumeKg.toLocaleString()} kg</Text>}
          </View>
        </View>
      </View>

      {!!entry.notes && <Text style={st.notes}>{entry.notes}</Text>}

      {!!entry.rpe && (
        <View style={st.rpe}>
          <Text style={st.rpeLabel}>Effort (RPE)</Text>
          <View style={st.bar}>
            <View style={[st.fill, { width: `${entry.rpe * 10}%`, backgroundColor: rpeColor(entry.rpe) }]} />
          </View>
          <Text style={st.rpeValue}>{entry.rpe}/10</Text>
        </View>
      )}
    </Card>
  )
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start' },
  main: { flex: 1, minWidth: 0, gap: space[2] },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: space[3], alignItems: 'baseline' },
  title: { flex: 1, fontSize: fs.lg, fontWeight: fw.semibold, color: colors.text },
  date: { fontSize: fs.xs, color: colors.textDim },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], alignItems: 'center' },
  chip: { fontSize: fs.xs, color: colors.textMuted, paddingVertical: 3, paddingHorizontal: 8, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  notes: { color: colors.textMuted, fontSize: fs.sm, lineHeight: 21, borderLeftWidth: 2, borderLeftColor: colors.border, marginLeft: 20, paddingVertical: space[2], paddingLeft: space[3] },
  rpe: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  rpeLabel: { fontSize: fs.xs, color: colors.textDim },
  bar: { flex: 1, height: 6, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  rpeValue: { fontSize: fs.xs, color: colors.text, fontWeight: fw.semibold },
})
