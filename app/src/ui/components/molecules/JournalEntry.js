import { StyleSheet, View } from 'react-native'
import Badge from '../atoms/Badge'
import Card from '../atoms/Card'
import Row from '../atoms/Row'
import SportIcon from '../atoms/SportIcon'
import Text from '../atoms/Text'
import { MOODS } from '@/domain/catalog'
import { parseYmd } from '@/domain/dates'
import { colors, radius, space } from '@/ui/theme'

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
      <Row gap={3} align="flex-start">
        <SportIcon sport={entry.sport} size="md" />
        <View style={st.main}>
          <Row gap={3} align="baseline" justify="space-between">
            <Text variant="h3" weight="semibold" style={{ flex: 1 }}>{entry.title}</Text>
            <Text variant="dim">{date}</Text>
          </Row>
          <Row wrap>
            <Badge tone={entry.sport}>{entry.sport}</Badge>
            {mood && <Badge tone="mood" icon={mood.emoji}>{mood.label}</Badge>}
            {!!entry.durationMin && <Text variant="dim" color={colors.textMuted} style={st.chip}>⏱ {entry.durationMin} min</Text>}
            {!!entry.distanceKm && <Text variant="dim" color={colors.textMuted} style={st.chip}>📍 {entry.distanceKm} km</Text>}
            {!!entry.volumeKg && <Text variant="dim" color={colors.textMuted} style={st.chip}>🏋️ {entry.volumeKg.toLocaleString()} kg</Text>}
          </Row>
        </View>
      </Row>

      {!!entry.notes && <Text variant="muted" style={st.notes}>{entry.notes}</Text>}

      {!!entry.rpe && (
        <Row gap={3}>
          <Text variant="dim">Effort (RPE)</Text>
          <View style={st.bar}>
            <View style={[st.fill, { width: `${entry.rpe * 10}%`, backgroundColor: rpeColor(entry.rpe) }]} />
          </View>
          <Text variant="dim" weight="semibold" color={colors.text}>{entry.rpe}/10</Text>
        </Row>
      )}
    </Card>
  )
}

const st = StyleSheet.create({
  main: { flex: 1, minWidth: 0, gap: space[2] },
  chip: { paddingVertical: 3, paddingHorizontal: 8, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  notes: { lineHeight: 21, borderLeftWidth: 2, borderLeftColor: colors.border, marginLeft: 20, paddingVertical: space[2], paddingLeft: space[3] },
  bar: { flex: 1, height: 6, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
})
