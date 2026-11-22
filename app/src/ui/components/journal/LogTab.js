import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Badge, Card, EmptyState, s as ui } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
import WorkoutCalendar from '@/ui/components/WorkoutCalendar'
import JournalEntry from '@/ui/components/JournalEntry'
import { entryMeta } from '@/domain/journal'
import { parseYmd } from '@/domain/dates'
import { colors, fs, fw, radius, space, sportColor } from '@/ui/theme'
import { js } from './styles'

const fmtShort = d => parseYmd(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

// Log tab: today's plan, week strip / month calendar, recent sessions.
// Props: data (journal.load() result), onNewEntry(date?)
export default function LogTab({ data, onNewEntry }) {
  const { todayWorkout: w, week, weekStats, entries } = data
  const [showMonth, setShowMonth] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [openId, setOpenId] = useState(null)
  const visible = showAll ? entries : entries.slice(0, 3)

  const pickDay = d => d.entry ? setSelected(selected?.id === d.entry.id ? null : d.entry) : onNewEntry(d.key)

  return (
    <>
      <Card padding="lg">
        <View style={[ui.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
          <View style={{ flex: 1 }}>
            <Text style={js.eyebrow}>TODAY'S SESSION</Text>
            <Text style={ui.h2}>{w.title}</Text>
          </View>
          <SportIcon sport={w.sport} size="lg" />
        </View>
        <View style={[ui.row, { flexWrap: 'wrap' }]}>
          <Badge tone={w.sport} icon="⏱">{w.durationMin} min</Badge>
          <Badge tone="neutral" icon="📋">{w.exerciseCount} exercises</Badge>
        </View>
        <View>
          {w.exercises.slice(0, 4).map(ex => (
            <View key={ex.name} style={st.listItem}>
              <Text style={js.itemText}>{ex.name}</Text>
              <Text style={js.itemMeta}>{ex.sets} × {ex.reps}</Text>
            </View>
          ))}
          {w.exercises.length > 4 && (
            <Text style={[js.itemMeta, { fontStyle: 'italic', paddingVertical: space[3] }]}>+{w.exercises.length - 4} more</Text>
          )}
        </View>
        <Pressable style={js.primary} onPress={() => router.push('/workout')}>
          <Text style={[js.primaryText, { fontSize: fs.md }]}>Start workout →</Text>
        </Pressable>
      </Card>

      <Card padding="lg">
        <View style={[ui.row, { justifyContent: 'space-between' }]}>
          <View style={{ gap: 2, flexShrink: 1 }}>
            <Text style={js.sectionH}>{showMonth ? 'This month' : 'This week'}</Text>
            {!showMonth && <Text style={ui.dim}>{weekStats.sessions} sessions · {weekStats.minutes} min</Text>}
          </View>
          <Pressable style={st.toggle} onPress={() => { setShowMonth(!showMonth); setSelected(null) }}>
            <Text style={{ color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.medium }}>{showMonth ? 'Week' : 'Month'}</Text>
          </Pressable>
        </View>

        {!showMonth && (
          <View style={st.week}>
            {week.map(d => {
              const active = !!selected && selected.id === d.entry?.id
              return (
                <Pressable key={d.key} style={[st.weekDay, d.isFuture && { opacity: 0.45 }]} onPress={() => pickDay(d)}
                  accessibilityLabel={d.entry ? d.entry.title : 'Log a session'}>
                  <Text style={st.weekLabel}>{d.label.toUpperCase()}</Text>
                  <View style={[st.circle, d.entry && st.circleDone, d.isToday && st.circleToday, active && st.circleActive]}>
                    <Text style={[st.weekNum, d.isToday && { color: colors.accent }, active && { color: colors.accentInk }]}>{d.day}</Text>
                    {d.entry && <View style={[st.weekDot, { backgroundColor: sportColor(d.entry.sport) }]} />}
                  </View>
                </Pressable>
              )
            })}
          </View>
        )}
        {!showMonth && selected && <JournalEntry entry={selected} />}
        {showMonth && <WorkoutCalendar entries={entries} />}
      </Card>

      <Card padding="none" style={{ gap: 0 }}>
        <View style={st.recentHead}>
          <Text style={js.sectionH}>{showAll ? `All sessions (${entries.length})` : 'Recent sessions'}</Text>
          {entries.length > 3 && (
            <Pressable onPress={() => setShowAll(!showAll)}>
              <Text style={js.link}>{showAll ? 'Show less' : 'See all →'}</Text>
            </Pressable>
          )}
        </View>

        {!entries.length ? (
          <EmptyState icon="📓" title="No sessions yet" description="Log your first training session to start the journal.">
            <Pressable style={js.primary} onPress={() => onNewEntry()}><Text style={js.primaryText}>+ New entry</Text></Pressable>
          </EmptyState>
        ) : visible.map((e, i) => (
          <View key={e.id} style={i > 0 && st.divider}>
            <Pressable style={({ pressed }) => [st.recentItem, pressed && { backgroundColor: colors.surfaceHover }]}
              onPress={() => setOpenId(openId === e.id ? null : e.id)}>
              <SportIcon sport={e.sport} size="sm" />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={st.recentTitle}>{e.title}</Text>
                <Text style={ui.dim}>{entryMeta(e)}</Text>
              </View>
              <Text style={ui.dim}>{fmtShort(e.date)}</Text>
              <Text style={ui.dim}>{openId === e.id ? '▴' : '▾'}</Text>
            </Pressable>
            {openId === e.id && (
              <View style={{ paddingHorizontal: space[3], paddingBottom: space[3] }}>
                <JournalEntry entry={e} />
              </View>
            )}
          </View>
        ))}
      </Card>
    </>
  )
}

const st = StyleSheet.create({
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space[3], borderBottomWidth: 1, borderBottomColor: colors.border },
  toggle: { paddingVertical: space[1], paddingHorizontal: space[3], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  week: { flexDirection: 'row', gap: space[1] },
  weekDay: { flex: 1, alignItems: 'center', gap: space[2] },
  weekLabel: { fontSize: fs.xs, color: colors.textDim, letterSpacing: 0.5 },
  circle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: colors.surfaceHover, borderColor: colors.borderStrong },
  circleToday: { borderColor: colors.accent },
  circleActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  weekNum: { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.text },
  weekDot: { position: 'absolute', bottom: 3, width: 6, height: 6, borderRadius: 3 },
  recentHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space[4], borderBottomWidth: 1, borderBottomColor: colors.border },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] },
  recentTitle: { fontSize: fs.sm, fontWeight: fw.medium, color: colors.text },
})
