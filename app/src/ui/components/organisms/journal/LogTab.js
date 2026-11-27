import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import Badge from '../../atoms/Badge'
import Button from '../../atoms/Button'
import Card from '../../atoms/Card'
import Row from '../../atoms/Row'
import Text from '../../atoms/Text'
import EmptyState from '../../molecules/EmptyState'
import JournalEntry from '../../molecules/JournalEntry'
import SportIcon from '../../atoms/SportIcon'
import WorkoutCalendar from '../WorkoutCalendar'
import { entryMeta } from '@/domain/journal'
import { parseYmd } from '@/domain/dates'
import { colors, radius, space, sportColor } from '@/ui/theme'

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
        <Row justify="space-between" align="flex-start">
          <View style={{ flex: 1 }}>
            <Text variant="overline" style={{ marginBottom: space[1] }}>Today's session</Text>
            <Text variant="h2">{w.title}</Text>
          </View>
          <SportIcon sport={w.sport} size="lg" />
        </Row>
        <Row wrap>
          <Badge tone={w.sport} icon="⏱">{w.durationMin} min</Badge>
          <Badge tone="neutral" icon="📋">{w.exerciseCount} exercises</Badge>
        </Row>
        <View>
          {w.exercises.slice(0, 4).map(ex => (
            <View key={ex.name} style={st.listItem}>
              <Text variant="small">{ex.name}</Text>
              <Text variant="muted" color={colors.textDim}>{ex.sets} × {ex.reps}</Text>
            </View>
          ))}
          {w.exercises.length > 4 && (
            <Text variant="muted" color={colors.textDim} style={{ fontStyle: 'italic', paddingVertical: space[3] }}>+{w.exercises.length - 4} more</Text>
          )}
        </View>
        <Button onPress={() => router.push('/workout')}>Start workout →</Button>
      </Card>

      <Card padding="lg">
        <Row justify="space-between">
          <View style={{ gap: 2, flexShrink: 1 }}>
            <Text variant="label" weight="semibold">{showMonth ? 'This month' : 'This week'}</Text>
            {!showMonth && <Text variant="dim">{weekStats.sessions} sessions · {weekStats.minutes} min</Text>}
          </View>
          <Pressable style={st.toggle} onPress={() => { setShowMonth(!showMonth); setSelected(null) }}>
            <Text variant="dim" weight="medium" color={colors.textMuted}>{showMonth ? 'Week' : 'Month'}</Text>
          </Pressable>
        </Row>

        {!showMonth && (
          <View style={st.week}>
            {week.map(d => {
              const active = !!selected && selected.id === d.entry?.id
              return (
                <Pressable key={d.key} style={[st.weekDay, d.isFuture && { opacity: 0.45 }]} onPress={() => pickDay(d)}
                  accessibilityLabel={d.entry ? d.entry.title : 'Log a session'}>
                  <Text variant="dim" style={{ letterSpacing: 0.5 }}>{d.label.toUpperCase()}</Text>
                  <View style={[st.circle, d.entry && st.circleDone, d.isToday && st.circleToday, active && st.circleActive]}>
                    <Text variant="small" weight="semibold" color={active ? colors.accentInk : d.isToday ? colors.accent : undefined}>{d.day}</Text>
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
          <Text variant="label" weight="semibold">{showAll ? `All sessions (${entries.length})` : 'Recent sessions'}</Text>
          {entries.length > 3 && (
            <Pressable onPress={() => setShowAll(!showAll)}>
              <Text variant="link">{showAll ? 'Show less' : 'See all →'}</Text>
            </Pressable>
          )}
        </View>

        {!entries.length ? (
          <EmptyState icon="📓" title="No sessions yet" description="Log your first training session to start the journal.">
            <Button onPress={() => onNewEntry()}>+ New entry</Button>
          </EmptyState>
        ) : visible.map((e, i) => (
          <View key={e.id} style={i > 0 && st.divider}>
            <Pressable style={({ pressed }) => [st.recentItem, pressed && { backgroundColor: colors.surfaceHover }]}
              onPress={() => setOpenId(openId === e.id ? null : e.id)}>
              <SportIcon sport={e.sport} size="sm" />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="small" weight="medium">{e.title}</Text>
                <Text variant="dim">{entryMeta(e)}</Text>
              </View>
              <Text variant="dim">{fmtShort(e.date)}</Text>
              <Text variant="dim">{openId === e.id ? '▴' : '▾'}</Text>
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
  circle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: colors.surfaceHover, borderColor: colors.borderStrong },
  circleToday: { borderColor: colors.accent },
  circleActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  weekDot: { position: 'absolute', bottom: 3, width: 6, height: 6, borderRadius: 3 },
  recentHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space[4], borderBottomWidth: 1, borderBottomColor: colors.border },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] },
})
