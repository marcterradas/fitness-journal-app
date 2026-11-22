import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Badge, Card, Chip, Icon, Screen, s as ui } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
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
      <View style={[ui.row, { gap: space[3] }]}>
        <Pressable style={st.back} onPress={() => router.back()} accessibilityLabel="Back">
          <Icon name="arrow-back" size={20} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={st.eyebrow}>WEEKLY PLAN</Text>
          <Text style={ui.h1}>Templates</Text>
        </View>
        <Pressable style={[st.edit, editing && st.editOn]} onPress={() => setEditing(!editing)}>
          <Text style={[st.editText, editing && { color: colors.accentInk }]}>{editing ? 'Done' : 'Edit'}</Text>
        </Pressable>
      </View>

      <Card padding="md">
        <View style={[ui.row, { alignItems: 'baseline' }]}>
          <Text style={st.overview}>{totalSessions}<Text style={{ color: colors.textDim }}> / </Text>7</Text>
          <Text style={st.upperDim}>DAYS PLANNED</Text>
        </View>
        <View style={st.strip}>
          {WEEKDAYS.map(d => {
            const active = selectedDay === d.id
            const has = !!schedule[d.id]
            return (
              <Pressable
                key={d.id}
                style={[st.day, todayKey === d.id && { borderColor: colors.secondary }, active && st.dayActive]}
                onPress={() => selectDay(d.id)}
              >
                <Text style={[st.dayLbl, has && { color: colors.text }, active && { color: colors.accentInk }]}>{d.label.toUpperCase()}</Text>
                {has
                  ? <SportIcon sport={schedule[d.id].sport} size="sm" />
                  : <Text style={[st.dash, active && { color: colors.accentInk }]}>—</Text>}
              </Pressable>
            )
          })}
        </View>
      </Card>

      {current ? (
        <Card padding="lg" style={{ gap: space[4] }}>
          <View style={[ui.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <View style={{ flex: 1 }}>
              <Text style={st.eyebrow}>{dayMeta.long.toUpperCase()}</Text>
              <Text style={ui.h2}>{current.title}</Text>
            </View>
            <SportIcon sport={current.sport} size="lg" />
          </View>

          <View style={[ui.row, { flexWrap: 'wrap' }]}>
            <Badge tone={current.sport} icon="⏱">{current.durationMin} min</Badge>
            <Badge tone="neutral" icon="📋">{current.exercises.length} exercises</Badge>
          </View>

          {editing && (
            <View style={st.picker}>
              <Text style={st.upperDim}>SPORT</Text>
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
                <View style={st.num}><Text style={st.numText}>{i + 1}</Text></View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: colors.text, fontWeight: fw.medium }}>{ex.name}</Text>
                  <Text style={ui.dim}>{ex.sets} × {ex.reps}</Text>
                </View>
                {editing && (
                  <Pressable style={st.remove} onPress={() => removeExercise(ex.id)} accessibilityLabel="Remove">
                    <Text style={{ color: colors.textDim, fontSize: fs.md, lineHeight: fs.md + 2 }}>×</Text>
                  </Pressable>
                )}
              </View>
            ))}
            {!current.exercises.length && (
              <View style={[st.exercise, { justifyContent: 'center', padding: space[4] }]}>
                <Text style={[ui.dim, { fontStyle: 'italic', fontSize: fs.sm }]}>No exercises yet</Text>
              </View>
            )}
          </View>

          {editing && (
            <View style={ui.row}>
              <TextInput
                style={st.addInput}
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={addExercise}
                placeholder="Add exercise (e.g. Pull ups)..."
                placeholderTextColor={colors.textDim}
                returnKeyType="done"
              />
              <Pressable style={st.addBtn} onPress={addExercise}>
                <Text style={st.ctaText}>Add</Text>
              </Pressable>
            </View>
          )}

          <View style={ui.row}>
            <Pressable style={[st.cta, { flex: 1 }]} onPress={() => router.push('/workout')}>
              <Text style={[st.ctaText, { fontSize: fs.md }]}>Start session →</Text>
            </Pressable>
            {editing && (
              <Pressable style={st.clear} onPress={clearDay}>
                <Text style={{ color: colors.textMuted, fontSize: fs.sm }}>Mark as rest day</Text>
              </Pressable>
            )}
          </View>
        </Card>
      ) : (
        <Card padding="lg" style={{ alignItems: 'center', gap: space[2] }}>
          <Text style={{ fontSize: 40 }}>💤</Text>
          <Text style={ui.h2}>Rest day</Text>
          <Text style={[ui.muted, { textAlign: 'center', fontSize: fs.md }]}>
            No session planned for {dayMeta.long}. Recovery is part of training.
          </Text>
          <Pressable style={[st.cta, { marginTop: space[2] }]} onPress={planSession}>
            <Text style={st.ctaText}>+ Plan a session</Text>
          </Pressable>
        </Card>
      )}

      <Text style={[st.upperDim, { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.textMuted, marginTop: space[2] }]}>FULL WEEK</Text>
      <View style={st.all}>
        {WEEKDAYS.map((d, i) => {
          const day = schedule[d.id]
          return (
            <Pressable
              key={d.id}
              style={({ pressed }) => [st.allRow, i > 0 && st.allDivider, todayKey === d.id && { backgroundColor: colors.secondarySoft }, pressed && { backgroundColor: colors.surface2 }]}
              onPress={() => selectDay(d.id)}
            >
              <Text style={st.allDay}>{d.long}</Text>
              {day ? <SportIcon sport={day.sport} size="sm" /> : <Text style={[st.dash, { width: 28, textAlign: 'center' }]}>—</Text>}
              <Text style={st.allName} numberOfLines={1}>{day ? day.title : 'Rest'}</Text>
              <Text style={ui.dim}>{day ? `${day.exercises.length} ex` : ''}</Text>
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const st = StyleSheet.create({
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: fs.xs, color: colors.textDim, letterSpacing: 0.8, fontWeight: fw.medium, marginBottom: space[1] },
  edit: { paddingVertical: space[2], paddingHorizontal: space[4], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  editOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  editText: { color: colors.text, fontSize: fs.sm, fontWeight: fw.semibold },
  overview: { fontSize: fs.xl, fontWeight: fw.bold, color: colors.text },
  upperDim: { fontSize: fs.xs, color: colors.textDim, letterSpacing: 0.8 },
  strip: { flexDirection: 'row', gap: space[1] },
  day: { flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'space-between', gap: space[1], paddingVertical: space[2], paddingHorizontal: 2, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  dayActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayLbl: { fontSize: fs.xs, fontWeight: fw.semibold, color: colors.textMuted },
  dash: { color: colors.textDim, fontSize: fs.md },
  picker: { gap: space[2], paddingTop: space[2], borderTopWidth: 1, borderTopColor: colors.border },
  exercise: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[3], backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  numText: { color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.bold },
  remove: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  addInput: { flex: 1, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, color: colors.text, padding: space[3], borderRadius: radius.md, fontSize: fs.sm },
  addBtn: { paddingVertical: space[3], paddingHorizontal: space[4], backgroundColor: colors.accent, borderRadius: radius.md },
  cta: { paddingVertical: space[3], paddingHorizontal: space[5], backgroundColor: colors.accent, borderRadius: radius.md, alignItems: 'center' },
  ctaText: { color: colors.accentInk, fontWeight: fw.semibold },
  clear: { paddingVertical: space[3], paddingHorizontal: space[4], borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, justifyContent: 'center' },
  all: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  allRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] },
  allDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  allDay: { width: 80, fontWeight: fw.semibold, color: colors.text, fontSize: fs.sm },
  allName: { flex: 1, color: colors.textMuted, fontSize: fs.sm },
})
