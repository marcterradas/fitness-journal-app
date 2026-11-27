import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import IconButton from '../atoms/IconButton'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import { SPORT_TYPES, sportOf } from '@/domain/catalog'
import { entryMeta, monthGrid } from '@/domain/journal'
import { parseYmd } from '@/domain/dates'
import { colors, fs, radius, space, sportColor } from '@/ui/theme'

// Month grid of journal entries. Grid math lives in domain/journal monthGrid().
// Props: entries, initialDate, weekStartsOn (1 = Monday).
export default function WorkoutCalendar({ entries, initialDate = new Date(), weekStartsOn = 1 }) {
  const [cursor, setCursor] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  const [selected, setSelected] = useState(null)
  const { weekdays, weeks: rows, summary } = monthGrid(entries, cursor, new Date(), weekStartsOn)
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(cursor)

  function shift(delta) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1))
    setSelected(null)
  }

  const selectCell = c => setSelected(selected?.key === c.key ? null : c)

  return (
    <View style={st.cal}>
      <Row gap={3} justify="space-between">
        <IconButton icon="chevron-back" label="Previous month" variant="filled" onPress={() => shift(-1)} />
        <View style={{ alignItems: 'center', gap: space[1] }}>
          <Text variant="h3">{monthLabel}</Text>
          <Text variant="dim">
            {summary.sessions} sessions · {summary.minutes} min
            {summary.km > 0 && ` · ${summary.km.toFixed(1)} km`}
          </Text>
        </View>
        <IconButton icon="chevron-forward" label="Next month" variant="filled" onPress={() => shift(1)} />
      </Row>

      <View style={st.row}>
        {weekdays.map(d => <Text key={d} variant="dim" align="center" style={st.weekday}>{d.toUpperCase()}</Text>)}
      </View>

      <View style={{ gap: space[1] }}>
        {rows.map((row, ri) => (
          <View key={ri} style={st.row}>
            {row.map(c => {
              if (c.blank) return <View key={c.key} style={st.cellWrap} />
              const active = selected?.key === c.key
              const has = c.entries.length > 0
              return (
                <Pressable key={c.key} style={st.cellWrap} onPress={() => selectCell(c)} disabled={!has}>
                  <View style={[st.cell, has && st.cellHas, c.isToday && st.cellToday, c.isFuture && { opacity: 0.55 }, active && st.cellActive]}>
                    <Text variant="dim" weight={c.isToday ? 'bold' : 'semibold'} color={active ? colors.accentInk : c.isToday ? colors.accent : colors.text}>
                      {c.day}
                    </Text>
                    {has && (
                      <View style={st.marks}>
                        {c.entries.slice(0, 3).map((e, i) => (
                          <View key={e.id || i} style={[st.dot, { backgroundColor: sportColor(e.sport) }]} />
                        ))}
                        {c.entries.length > 3 && (
                          <Text variant="dim" weight="semibold" color={active ? colors.accentInk : undefined} style={{ fontSize: 10 }}>+{c.entries.length - 3}</Text>
                        )}
                      </View>
                    )}
                  </View>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>

      {selected && (
        <View style={st.detail}>
          <Row gap={1} justify="space-between">
            <Text variant="small" weight="semibold">
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(parseYmd(selected.key))}
            </Text>
            <IconButton icon="close" label="Close" size={28} onPress={() => setSelected(null)} />
          </Row>
          {selected.entries.map(e => {
            const m = sportOf(e.sport)
            return (
              <View key={e.id} style={st.detailItem}>
                <View style={[st.detailIcon, { backgroundColor: sportColor(e.sport) + '2e' }]}>
                  <Text style={{ fontSize: fs.md }}>{m?.emoji || '·'}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="small" weight="semibold" numberOfLines={1}>{e.title}</Text>
                  <Text variant="dim">{entryMeta(e)}</Text>
                </View>
              </View>
            )
          })}
        </View>
      )}

      <View style={st.legend}>
        {SPORT_TYPES.map(s => (
          <Row key={s.id} gap={1}>
            <View style={[st.legendDot, { backgroundColor: sportColor(s.id) }]} />
            <Text variant="dim" color={colors.textMuted}>{s.label}</Text>
          </Row>
        ))}
      </View>
    </View>
  )
}

const st = StyleSheet.create({
  cal: { gap: space[3] },
  row: { flexDirection: 'row', gap: space[1] },
  weekday: { flex: 1, paddingVertical: space[1] },
  cellWrap: { flex: 1, aspectRatio: 1 },
  cell: { flex: 1, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: space[1], justifyContent: 'space-between', alignItems: 'flex-start' },
  cellHas: { backgroundColor: colors.surface2 },
  cellToday: { borderColor: colors.accent },
  cellActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  marks: { flexDirection: 'row', alignItems: 'center', gap: 3, flexWrap: 'wrap' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  detail: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space[3], gap: space[2] },
  detailItem: { flexDirection: 'row', gap: space[3], alignItems: 'center', padding: space[2], borderRadius: radius.sm, backgroundColor: colors.surface },
  detailIcon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.border },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
})
