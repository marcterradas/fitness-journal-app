import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SPORT_TYPES, sportOf } from '@/domain/catalog'
import { entryMeta, monthGrid } from '@/domain/journal'
import { parseYmd } from '@/domain/dates'
import { colors, fs, fw, radius, space, sportColor } from '@/ui/theme'

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
      <View style={st.head}>
        <Pressable style={st.nav} onPress={() => shift(-1)} accessibilityLabel="Previous month">
          <Text style={st.navText}>‹</Text>
        </Pressable>
        <View style={{ alignItems: 'center', gap: space[1] }}>
          <Text style={st.title}>{monthLabel}</Text>
          <Text style={st.dim}>
            {summary.sessions} sessions · {summary.minutes} min
            {summary.km > 0 && ` · ${summary.km.toFixed(1)} km`}
          </Text>
        </View>
        <Pressable style={st.nav} onPress={() => shift(1)} accessibilityLabel="Next month">
          <Text style={st.navText}>›</Text>
        </Pressable>
      </View>

      <View style={st.row}>
        {weekdays.map(d => <Text key={d} style={[st.dim, st.weekday]}>{d.toUpperCase()}</Text>)}
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
                    <Text style={[st.cellDay, c.isToday && { color: colors.accent, fontWeight: fw.bold }, active && { color: colors.accentInk }]}>
                      {c.day}
                    </Text>
                    {has && (
                      <View style={st.marks}>
                        {c.entries.slice(0, 3).map((e, i) => (
                          <View key={e.id || i} style={[st.dot, { backgroundColor: sportColor(e.sport) }]} />
                        ))}
                        {c.entries.length > 3 && (
                          <Text style={[st.more, active && { color: colors.accentInk }]}>+{c.entries.length - 3}</Text>
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
          <View style={[st.rowCenter, { justifyContent: 'space-between' }]}>
            <Text style={st.detailDate}>
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(parseYmd(selected.key))}
            </Text>
            <Pressable onPress={() => setSelected(null)} accessibilityLabel="Close" hitSlop={8}>
              <Text style={{ color: colors.textDim, fontSize: 24, lineHeight: 24 }}>×</Text>
            </Pressable>
          </View>
          {selected.entries.map(e => {
            const m = sportOf(e.sport)
            return (
              <View key={e.id} style={st.detailItem}>
                <View style={[st.detailIcon, { backgroundColor: sportColor(e.sport) + '2e' }]}>
                  <Text style={{ fontSize: fs.md }}>{m?.emoji || '·'}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={st.detailTitle} numberOfLines={1}>{e.title}</Text>
                  <Text style={st.dim}>{entryMeta(e)}</Text>
                </View>
              </View>
            )
          })}
        </View>
      )}

      <View style={st.legend}>
        {SPORT_TYPES.map(s => (
          <View key={s.id} style={st.rowCenter}>
            <View style={[st.legendDot, { backgroundColor: sportColor(s.id) }]} />
            <Text style={{ fontSize: fs.xs, color: colors.textMuted }}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

// "45 min · 8 km · 4,200 kg" — shared with JournalView's recent list.
const st = StyleSheet.create({
  cal: { gap: space[3] },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] },
  nav: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  navText: { color: colors.text, fontSize: 20, lineHeight: 22 },
  title: { fontSize: fs.lg, fontWeight: fw.bold, color: colors.text },
  dim: { fontSize: fs.xs, color: colors.textDim },
  row: { flexDirection: 'row', gap: space[1] },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  weekday: { flex: 1, textAlign: 'center', paddingVertical: space[1] },
  cellWrap: { flex: 1, aspectRatio: 1 },
  cell: { flex: 1, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: space[1], justifyContent: 'space-between', alignItems: 'flex-start' },
  cellHas: { backgroundColor: colors.surface2 },
  cellToday: { borderColor: colors.accent },
  cellActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  cellDay: { fontSize: fs.xs, fontWeight: fw.semibold, color: colors.text },
  marks: { flexDirection: 'row', alignItems: 'center', gap: 3, flexWrap: 'wrap' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  more: { fontSize: 10, color: colors.textDim, fontWeight: fw.semibold },
  detail: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space[3], gap: space[2] },
  detailDate: { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.text },
  detailItem: { flexDirection: 'row', gap: space[3], alignItems: 'center', padding: space[2], borderRadius: radius.sm, backgroundColor: colors.surface },
  detailIcon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  detailTitle: { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.border },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
})
