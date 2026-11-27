import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Badge, Button, Card, Chip, Icon, IconButton, Row, Screen, SportIcon, Text } from '@/ui/components'
import { SPORT_TYPES } from '@/api/mock/data/workouts'
import { WEEKDAYS, weeklyTemplates } from '@/api/mock/data/templates'
import { colors, fs, fw, radius, space } from '@/ui/theme'

const dow = new Date().getDay()
const todayKey = dow === 0 ? 'sun' : WEEKDAYS[dow - 1].id

const blankSession = (day) => ({ id: `t_${day}_${Date.now()}`, title: 'New session', sport: 'strength', durationMin: 30, exercises: [] })

export default function TemplatesScreen() {
  const [selectedDay, setSelectedDay] = useState(todayKey)
  // ponytail: local copy only — edits are lost on leaving the screen (same as the old view). Upgrade: write back via saveToDay / API.
  const [schedule, setSchedule] = useState(() => ({ ...weeklyTemplates }))
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')

  const current = schedule[selectedDay]
  const dayMeta = WEEKDAYS.find(d => d.id === selectedDay)
  const totalSessions = Object.values(schedule).filter(Boolean).length

  // Immutable update of the selected day (React needs a new object to re-render).
  const updateDay = (fn) => setSchedule(sch => ({ ...sch, [selectedDay]: fn(sch[selectedDay]) }))

  function selectDay(id) {
    setSelectedDay(id)
    setEditing(false)
  }

  function addExercise() {
    const name = newName.trim()
    if (!name) return
    updateDay(day => {
      const base = day || blankSession(selectedDay)
      return { ...base, exercises: [...base.exercises, { id: `ex_${Date.now()}`, name, sets: 3, reps: '8-10' }] }
    })
    setNewName('')
  }

  const removeExercise = (id) => updateDay(day => ({ ...day, exercises: day.exercises.filter(e => e.id !== id) }))
  const setSport = (sport) => updateDay(day => ({ ...day, sport }))

  function clearDay() {
    updateDay(() => null)
    setEditing(false)
  }

  // Old view's "+ Plan a session" only toggled edit mode on an empty card; create a blank session instead.
  function planSession() {
    updateDay(() => blankSession(selectedDay))
    setEditing(true)
  }

  return (
    <Screen>
      <Row gap={3}>
        <IconButton icon="back" label="Back" variant="filled" size={40} onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Text variant="overline" style={st.eyebrow}>Weekly plan</Text>
          <Text variant="h1">Templates</Text>
        </View>
        <Button size="sm" variant={editing ? 'primary' : 'secondary'} onPress={() => setEditing(!editing)}>
          {editing ? 'Done' : 'Edit'}
        </Button>
      </Row>

      <Card padding="md">
        <Row align="baseline">
          <Text variant="h2">{totalSessions}<Text variant="h2" color={colors.textDim}> / </Text>7</Text>
          <Text variant="overline" weight="regular">Days planned</Text>
        </Row>
        <Row gap={1} align="stretch">
          {WEEKDAYS.map(d => {
            const active = selectedDay === d.id
            const has = !!schedule[d.id]
            return (
              <Pressable
                key={d.id}
                style={[st.day, todayKey === d.id && { borderColor: colors.secondary }, active && st.dayActive]}
                onPress={() => selectDay(d.id)}
              >
                <Text variant="dim" weight="semibold" color={active ? colors.accentInk : has ? colors.text : colors.textMuted}>{d.label.toUpperCase()}</Text>
                {has
                  ? <SportIcon sport={schedule[d.id].sport} size="sm" />
                  : <Text color={active ? colors.accentInk : colors.textDim}>—</Text>}
              </Pressable>
            )
          })}
        </Row>
      </Card>

      {current ? (
        <Card padding="lg" style={{ gap: space[4] }}>
          <Row justify="space-between" align="flex-start">
            <View style={{ flex: 1 }}>
              <Text variant="overline" style={st.eyebrow}>{dayMeta.long}</Text>
              <Text variant="h2">{current.title}</Text>
            </View>
            <SportIcon sport={current.sport} size="lg" />
          </Row>

          <Row wrap>
            <Badge tone={current.sport} icon="⏱">{current.durationMin} min</Badge>
            <Badge tone="neutral" icon="📋">{current.exercises.length} exercises</Badge>
          </Row>

          {editing && (
            <View style={st.picker}>
              <Text variant="overline" weight="regular">Sport</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[1] }}>
                {SPORT_TYPES.map(s => (
                  <Chip key={s.id} size="sm" active={current.sport === s.id} onPress={() => setSport(s.id)}>{s.emoji} {s.label}</Chip>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ gap: space[2] }}>
            {current.exercises.map((ex, i) => (
              <View key={ex.id} style={st.exercise}>
                <View style={st.num}><Text variant="dim" weight="bold" color={colors.textMuted}>{i + 1}</Text></View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text weight="medium">{ex.name}</Text>
                  <Text variant="dim">{ex.sets} × {ex.reps}</Text>
                </View>
                {editing && (
                  <IconButton label="Remove" size={28} style={st.remove} onPress={() => removeExercise(ex.id)}>
                    <Icon name="close" size={16} color={colors.textDim} />
                  </IconButton>
                )}
              </View>
            ))}
            {!current.exercises.length && (
              <View style={[st.exercise, { justifyContent: 'center', padding: space[4] }]}>
                <Text variant="muted" color={colors.textDim} style={{ fontStyle: 'italic' }}>No exercises yet</Text>
              </View>
            )}
          </View>

          {editing && (
            <Row>
              <TextInput
                style={st.addInput}
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={addExercise}
                placeholder="Add exercise (e.g. Pull ups)..."
                placeholderTextColor={colors.textDim}
                returnKeyType="done"
              />
              <Button size="sm" style={st.rect} onPress={addExercise}>Add</Button>
            </Row>
          )}

          <Row>
            <Button style={[st.rect, { flex: 1 }]} onPress={() => router.push('/workout')}>Start session →</Button>
            {editing && (
              <Pressable style={st.clear} onPress={clearDay} accessibilityRole="button">
                <Text variant="muted">Mark as rest day</Text>
              </Pressable>
            )}
          </Row>
        </Card>
      ) : (
        <Card padding="lg" style={{ alignItems: 'center', gap: space[2] }}>
          <Text style={{ fontSize: 40 }}>💤</Text>
          <Text variant="h2">Rest day</Text>
          <Text color={colors.textMuted} align="center">
            No session planned for {dayMeta.long}. Recovery is part of training.
          </Text>
          <Button style={[st.rect, { marginTop: space[2] }]} onPress={planSession}>+ Plan a session</Button>
        </Card>
      )}

      <Text variant="overline" color={colors.textMuted} style={{ marginTop: space[2] }}>Full week</Text>
      <View style={st.all}>
        {WEEKDAYS.map((d, i) => {
          const day = schedule[d.id]
          return (
            <Pressable
              key={d.id}
              style={({ pressed }) => [st.allRow, i > 0 && st.allDivider, todayKey === d.id && { backgroundColor: colors.secondarySoft }, pressed && { backgroundColor: colors.surface2 }]}
              onPress={() => selectDay(d.id)}
            >
              <Text variant="small" weight="semibold" style={{ width: 80 }}>{d.long}</Text>
              {day ? <SportIcon sport={day.sport} size="sm" /> : <Text color={colors.textDim} align="center" style={{ width: 28 }}>—</Text>}
              <Text variant="muted" style={{ flex: 1 }} numberOfLines={1}>{day ? day.title : 'Rest'}</Text>
              <Text variant="dim">{day ? `${day.exercises.length} ex` : ''}</Text>
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const st = StyleSheet.create({
  eyebrow: { fontWeight: fw.medium, marginBottom: space[1] },
  day: { flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'space-between', gap: space[1], paddingVertical: space[2], paddingHorizontal: 2, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  dayActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  picker: { gap: space[2], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.border },
  exercise: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[3], backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  remove: { borderWidth: 1, borderColor: colors.border },
  addInput: { flex: 1, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, color: colors.text, padding: space[3], borderRadius: radius.md, fontSize: fs.sm },
  rect: { borderRadius: radius.md, paddingVertical: space[3], paddingHorizontal: space[5] },
  clear: { paddingVertical: space[3], paddingHorizontal: space[4], borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, justifyContent: 'center' },
  all: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  allRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] },
  allDivider: { borderTopWidth: 1, borderTopColor: colors.border },
})
