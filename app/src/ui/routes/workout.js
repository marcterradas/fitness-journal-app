import { useEffect, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Button, Card, ExerciseCard, IconButton, Row, Screen, SportIcon, Text } from '@/ui/components'
import { useTimer } from '@/ui/hooks/useTimer'
import { WEEKDAYS, weeklyTemplates } from '@/api/mock/data/templates'
import { colors, radius, space } from '@/ui/theme'

const REST_OPTIONS = [60, 90, 120, 180]

const newSet = (id, p = {}) => ({ id, weight: 0, reps: 0, rpe: 7, comment: '', completed: false, ...p })
const INITIAL = [
  { id: 'bench', name: 'Bench Press', note: 'Pause 1 sec on chest',
    lastWeek: [{ weight: 95, reps: 10, rpe: 7 }, { weight: 95, reps: 9, rpe: 8 }, { weight: 90, reps: 10, rpe: 8 }],
    sets: [newSet(1, { weight: 100, reps: 10, rpe: 7 }), newSet(2, { weight: 100, reps: 8, rpe: 8 }), newSet(3, { weight: 95, reps: 8, rpe: 9 })] },
  { id: 'pullups', name: 'Pull Ups', note: 'Bodyweight + added weight',
    lastWeek: [{ weight: 0, reps: 10, rpe: 7 }, { weight: 0, reps: 9, rpe: 8 }, { weight: 0, reps: 8, rpe: 9 }],
    sets: [newSet(1, { weight: 5, reps: 10, rpe: 7 }), newSet(2, { weight: 5, reps: 8, rpe: 8 }), newSet(3, { weight: 0, reps: 10, rpe: 8 })] },
  { id: 'row', name: 'Bent-over Row', note: 'Brace core, pull to belly',
    lastWeek: [{ weight: 75, reps: 10, rpe: 7 }, { weight: 75, reps: 10, rpe: 8 }, { weight: 70, reps: 12, rpe: 8 }],
    sets: [newSet(1, { weight: 80, reps: 10, rpe: 7 }), newSet(2, { weight: 80, reps: 10, rpe: 8 }), newSet(3, { weight: 75, reps: 12, rpe: 8 })] },
  { id: 'curl', name: 'Bicep Curl', note: '',
    lastWeek: [{ weight: 12, reps: 12, rpe: 7 }, { weight: 12, reps: 10, rpe: 8 }],
    sets: [newSet(1, { weight: 14, reps: 12, rpe: 7 }), newSet(2, { weight: 14, reps: 10, rpe: 8 }), newSet(3, { weight: 12, reps: 12, rpe: 8 })] },
]

const exerciseDone = ex => ex.sets.length > 0 && ex.sets.every(x => x.completed)

function fmtElapsed(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets()
  const [sport, setSport] = useState('strength')
  const [mode, setMode] = useState('plan') // 'plan' = whole workout, 'focus' = one exercise at a time
  const [exercises, setExercises] = useState(INITIAL)
  const [current, setCurrent] = useState(0)
  const [toast, setToast] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  // Session clock: tick `now` every second while a session runs.
  const [startedAt, setStartedAt] = useState(null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!startedAt) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [startedAt])
  const sessionRunning = startedAt !== null
  const elapsed = startedAt ? fmtElapsed(now - startedAt) : '00:00'

  // Rest timer
  const [restSeconds, setRestSeconds] = useState(REST_OPTIONS[2])
  const [restOpen, setRestOpen] = useState(false)
  const rest = useTimer(restSeconds)

  const toastTimer = useRef(null)
  useEffect(() => () => clearTimeout(toastTimer.current), [])
  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2000)
  }

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0)
  const completedCount = exercises.reduce((a, e) => a + e.sets.filter(x => x.completed).length, 0)
  const totalVolume = exercises.reduce(
    (acc, e) => acc + e.sets.filter(x => x.completed).reduce((a, x) => a + (Number(x.weight) || 0) * (Number(x.reps) || 0), 0),
    0,
  )
  const progressPct = totalSets === 0 ? 0 : Math.round((completedCount / totalSets) * 100)
  const currentExercise = exercises[current] || null

  function beginRest() {
    setRestOpen(true)
    rest.reset(restSeconds)
    rest.start()
  }
  function dismissRest() {
    rest.stop()
    setRestOpen(false)
  }
  function addRest(sec) {
    const wasActive = rest.isActive
    rest.reset(Math.max(0, rest.timeRemaining + sec))
    if (wasActive) rest.start()
  }

  function startSession() {
    if (!startedAt) {
      setStartedAt(Date.now())
      setNow(Date.now())
    }
    setMode('focus')
    const i = exercises.findIndex(e => !exerciseDone(e))
    setCurrent(i === -1 ? 0 : i)
  }

  function go(delta) {
    const next = current + delta
    if (next < 0 || next >= exercises.length) return
    setCurrent(next)
    dismissRest()
  }

  // Immutable updates: replace exercise `ei` with fn(exercise).
  const updateEx = (ei, fn) => setExercises(list => list.map((e, i) => (i === ei ? fn(e) : e)))
  const updateSet = (ei, si, patch) => updateEx(ei, e => ({ ...e, sets: e.sets.map((x, i) => (i === si ? { ...x, ...patch } : x)) }))

  function toggleSet(ei, si) {
    const ex = exercises[ei]
    const completed = !ex.sets[si].completed
    updateSet(ei, si, { completed })
    if (completed && si < ex.sets.length - 1) beginRest()
    else if (!completed) dismissRest()
  }

  function addSet(ei) {
    updateEx(ei, e => {
      const last = e.sets[e.sets.length - 1]
      return { ...e, sets: [...e.sets, newSet(Date.now(), { weight: last?.weight || 0, reps: last?.reps || 0, rpe: last?.rpe || 7 })] }
    })
  }

  const removeSet = (ei, si) => updateEx(ei, e => ({ ...e, sets: e.sets.filter((_, i) => i !== si) }))

  function copyLastWeek(ei, si) {
    const r = exercises[ei].lastWeek[si]
    if (r) updateSet(ei, si, { weight: r.weight, reps: r.reps, rpe: r.rpe })
  }

  function addExercise() {
    setExercises(list => [...list, { id: `new_${Date.now()}`, name: 'New exercise', note: '', lastWeek: [], sets: [newSet(Date.now() + 1)] }])
  }

  function removeExercise(ei) {
    const left = exercises.length - 1
    setExercises(list => list.filter((_, i) => i !== ei))
    if (current >= left) setCurrent(Math.max(0, left - 1))
    if (!left) setMode('plan')
  }

  function loadTemplate(dayId, replace = false) {
    const tpl = weeklyTemplates[dayId]
    if (!tpl) return
    setSport(tpl.sport)
    const added = tpl.exercises.map(t => {
      const setCount = Number(t.sets) || 1
      return {
        id: `${dayId}_${t.id}_${Date.now()}`,
        name: t.name,
        note: t.reps ? `Target: ${setCount} × ${t.reps}` : '',
        lastWeek: [],
        sets: Array.from({ length: setCount }, (_, i) => newSet(Date.now() + i)),
      }
    })
    setExercises(list => (replace ? added : [...list, ...added]))
    setPickerOpen(false)
    showToast(`${tpl.title} loaded`)
  }

  function share() {
    const lines = exercises
      .map(ex => {
        const done = ex.sets.filter(x => x.completed)
        return done.length ? `${ex.name}: ${done.map(x => `${x.weight}kg × ${x.reps} @${x.rpe}`).join(', ')}` : null
      })
      .filter(Boolean)
    Share.share({ title: 'Workout', message: lines.join('\n') || 'No sets logged yet' }).catch(() => showToast('Link copied · share anywhere'))
  }

  function finish() {
    dismissRest()
    setStartedAt(null)
    showToast('Workout saved 💪')
    setTimeout(() => router.push('/journal'), 800)
  }

  const cardProps = (ex, ei, focus) => ({
    exercise: ex,
    index: ei,
    focus,
    onToggleSet: si => toggleSet(ei, si),
    onAddSet: () => addSet(ei),
    onRemoveSet: si => removeSet(ei, si),
    onCopyLast: si => copyLastWeek(ei, si),
    onRemove: () => removeExercise(ei),
    onUpdate: next => updateEx(ei, () => next),
  })

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())
  const floatBottom = insets.bottom + space[3]

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen style={{ gap: space[4], paddingBottom: restOpen ? 160 : space[10] }}>
        {mode === 'plan' ? (
          <>
            <Row>
              <IconButton icon="back" label="Back" variant="filled" size={40} onPress={() => router.back()} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="overline" weight="medium">{today}</Text>
                <Text variant="h1">Today's workout</Text>
              </View>
              <Pressable style={st.iconBtn} onPress={() => setPickerOpen(true)} accessibilityRole="button" accessibilityLabel="Templates">
                <Text>🗓</Text>
              </Pressable>
              <Pressable style={st.iconBtn} onPress={share} accessibilityRole="button" accessibilityLabel="Share workout">
                <Text>↗</Text>
              </Pressable>
            </Row>

            <Card padding="md" style={st.summary}>
              <SportIcon sport={sport} size="md" />
              <SumItem label="Sets">{completedCount}<Text variant="h2" color={colors.textDim}> / </Text>{totalSets}</SumItem>
              <SumItem label="Exercises">{exercises.length}</SumItem>
              <SumItem label={sessionRunning ? 'Elapsed' : 'kg volume'}>{sessionRunning ? elapsed : totalVolume.toLocaleString()}</SumItem>
              <ProgressBar pct={progressPct} />
            </Card>

            {exercises.length > 0 && (
              <Button size="lg" style={st.primary} onPress={startSession}>
                {sessionRunning ? `Back to session · ${elapsed}` : 'Start workout →'}
              </Button>
            )}

            {exercises.map((ex, ei) => <ExerciseCard key={ex.id} {...cardProps(ex, ei, false)} />)}

            <Pressable style={st.addExercise} onPress={addExercise} accessibilityRole="button">
              <Text weight="semibold" color={colors.textMuted}>+ Add exercise</Text>
            </Pressable>

            {sessionRunning && (
              <Button size="lg" style={[st.primary, { marginTop: space[3] }]} onPress={finish}>Finish workout</Button>
            )}
          </>
        ) : (
          <>
            <Row gap={3} style={st.focusBar}>
              <IconButton icon="menu" label="Back to full workout" variant="filled" size={40} onPress={() => setMode('plan')} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="h1" style={st.tabular}>{elapsed}</Text>
                <Text variant="overline" weight="regular">Elapsed</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text variant="dim" color={colors.textMuted} style={st.tabular}>{completedCount}/{totalSets} sets</Text>
                <Text variant="dim" color={colors.textMuted} style={st.tabular}>{totalVolume.toLocaleString()} kg</Text>
              </View>
              <ProgressBar pct={progressPct} />
            </Row>

            <Row justify="space-between">
              <Button size="sm" variant="secondary" disabled={current === 0} onPress={() => go(-1)}>← Prev</Button>
              <Text variant="overline" weight="medium">Exercise {current + 1} of {exercises.length}</Text>
              <Button size="sm" variant="secondary" disabled={current >= exercises.length - 1} onPress={() => go(1)}>Next →</Button>
            </Row>

            {!!currentExercise && <ExerciseCard key={currentExercise.id} {...cardProps(currentExercise, current, true)} />}

            <Row gap={3} justify="center" style={{ paddingVertical: space[1] }}>
              {exercises.map((ex, ei) => (
                <Pressable
                  key={ex.id}
                  accessibilityLabel={ex.name}
                  hitSlop={8}
                  onPress={() => { setCurrent(ei); dismissRest() }}
                  style={[st.dot, exerciseDone(ex) && st.dotDone, ei === current && st.dotActive]}
                />
              ))}
            </Row>

            {!!currentExercise && exerciseDone(currentExercise) && current < exercises.length - 1 && (
              <Pressable style={st.nextCta} onPress={() => go(1)} accessibilityRole="button">
                <Text variant="link">Next: {exercises[current + 1].name} →</Text>
              </Pressable>
            )}

            <Button size="lg" style={[st.primary, { marginTop: space[3] }]} onPress={finish}>Finish workout</Button>

            <Row justify="center">
              <Text variant="overline" weight="medium">Rest</Text>
              {REST_OPTIONS.map(o => (
                <Pressable key={o} style={[st.restOpt, restSeconds === o && st.restOptOn]} onPress={() => setRestSeconds(o)} accessibilityRole="button" accessibilityState={{ selected: restSeconds === o }}>
                  <Text variant="dim" weight="semibold" color={restSeconds === o ? colors.secondary : colors.textMuted}>{o >= 60 ? `${o / 60}m` : `${o}s`}</Text>
                </Pressable>
              ))}
            </Row>
          </>
        )}
      </Screen>

      {/* Rest timer bar, floats over the list */}
      {restOpen && (
        <View style={[st.rest, { bottom: floatBottom }]}>
          <Text style={{ fontSize: 20 }}>⏱</Text>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="h2" color={colors.secondary} style={st.tabular}>{rest.formattedTime}</Text>
            <Text variant="dim" color={colors.textMuted}>{rest.timeRemaining === 0 ? 'Rest over — go' : 'Rest'}</Text>
          </View>
          <Row gap={1} wrap justify="flex-end">
            <RestBtn label="−30s" onPress={() => addRest(-30)} />
            <RestBtn label="+30s" onPress={() => addRest(30)} />
            <RestBtn label={rest.isActive ? 'Pause' : 'Resume'} onPress={rest.toggle} />
            <RestBtn label="Skip" skip onPress={dismissRest} />
          </Row>
        </View>
      )}

      {/* ponytail: own toast instead of <Toast> — it must float above the rest bar (Toast has a fixed bottom). */}
      {!!toast && (
        <View style={[st.toast, { bottom: floatBottom + (restOpen ? 90 : 0) }]} pointerEvents="none">
          <Text variant="small" weight="semibold" color={colors.bg}>{toast}</Text>
        </View>
      )}

      {/* Template picker drawer */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={st.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerOpen(false)} accessibilityLabel="Close" />
          <View style={[st.sheet, { paddingBottom: insets.bottom + space[6] }]}>
            <View style={st.handle} />
            <Row gap={3} justify="space-between" align="flex-start">
              <View>
                <Text variant="overline" weight="medium">Templates</Text>
                <Text variant="h2" style={{ marginTop: 2 }}>Use a weekly plan</Text>
              </View>
              <IconButton icon="close" label="Close" variant="filled" size={32} onPress={() => setPickerOpen(false)} />
            </Row>
            <Text variant="muted" style={st.hint}>Tap a day to append its exercises. "Replace" clears your current list first.</Text>
            <ScrollView contentContainerStyle={{ gap: space[2] }}>
              {WEEKDAYS.map(d => {
                const tpl = weeklyTemplates[d.id]
                return (
                  <Row key={d.id} gap={3} style={st.tpl}>
                    <Text variant="overline" weight="bold" align="center" style={{ width: 40 }}>{d.label}</Text>
                    {tpl ? <SportIcon sport={tpl.sport} size="sm" /> : <Text color={colors.textDim} align="center" style={{ width: 28 }}>—</Text>}
                    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                      <Text variant="small" weight="semibold">{tpl?.title || 'Rest day'}</Text>
                      {!!tpl && <Text variant="dim">{tpl.exercises.length} exercises · {tpl.durationMin} min</Text>}
                    </View>
                    {!!tpl && (
                      <View style={{ gap: space[1] }}>
                        <Pressable style={st.tplBtn} onPress={() => loadTemplate(d.id, true)} accessibilityRole="button">
                          <Text variant="dim" weight="semibold" color={colors.textMuted}>Replace</Text>
                        </Pressable>
                        <Pressable style={[st.tplBtn, st.tplBtnPrimary]} onPress={() => loadTemplate(d.id)} accessibilityRole="button">
                          <Text variant="dim" weight="semibold" color={colors.accentInk}>Use</Text>
                        </Pressable>
                      </View>
                    )}
                  </Row>
                )
              })}
            </ScrollView>
            <Pressable style={st.manage} onPress={() => { setPickerOpen(false); router.push('/templates') }} accessibilityRole="button">
              <Text variant="muted">Edit weekly templates →</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function SumItem({ label, children }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text variant="h2" style={st.tabular}>{children}</Text>
      <Text variant="overline" weight="regular">{label}</Text>
    </View>
  )
}

function ProgressBar({ pct }) {
  return (
    <View style={st.bar}>
      <View style={[st.barFill, { width: `${pct}%` }]} />
    </View>
  )
}

function RestBtn({ label, onPress, skip }) {
  return (
    <Pressable style={[st.restBtn, skip && { borderColor: colors.borderStrong }]} onPress={onPress} accessibilityRole="button">
      <Text variant="dim" weight="semibold" color={skip ? colors.textMuted : colors.secondary}>{label}</Text>
    </Pressable>
  )
}

const st = StyleSheet.create({
  // ponytail: icon-only header buttons (old view hid the labels under 480px anyway)
  iconBtn: { paddingVertical: space[2], paddingHorizontal: space[3], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  tabular: { fontVariant: ['tabular-nums'] },

  summary: { flexDirection: 'row', alignItems: 'center', gap: space[4], overflow: 'hidden' },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: colors.surface2 },
  barFill: { height: '100%', backgroundColor: colors.accent },

  primary: { padding: space[4], borderRadius: radius.md },
  addExercise: { backgroundColor: colors.bgElevated, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, padding: space[4], borderRadius: radius.lg, alignItems: 'center' },

  focusBar: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: space[3], paddingHorizontal: space[4], overflow: 'hidden' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotActive: { transform: [{ scale: 1.5 }], borderColor: colors.text },
  nextCta: { paddingVertical: space[3], paddingHorizontal: space[4], backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, alignItems: 'center' },

  restOpt: { paddingVertical: 3, paddingHorizontal: space[3], borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  restOptOn: { backgroundColor: colors.secondarySoft, borderColor: colors.secondary },

  rest: { position: 'absolute', left: space[4], right: space[4], maxWidth: 576, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[3], backgroundColor: '#1c2535', borderWidth: 1, borderColor: colors.secondary, borderRadius: radius.lg, paddingVertical: space[3], paddingHorizontal: space[4], shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  restBtn: { paddingVertical: space[1], paddingHorizontal: space[3], borderWidth: 1, borderColor: colors.secondary, borderRadius: radius.pill },

  toast: { position: 'absolute', alignSelf: 'center', backgroundColor: colors.text, paddingVertical: space[3], paddingHorizontal: space[5], borderRadius: radius.pill },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { width: '100%', maxWidth: 576, maxHeight: '88%', backgroundColor: colors.bgElevated, borderTopWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space[4], paddingHorizontal: space[5], gap: space[3] },
  handle: { width: 40, height: 4, backgroundColor: colors.borderStrong, borderRadius: radius.pill, alignSelf: 'center', marginBottom: space[2] },
  hint: { backgroundColor: colors.surface, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md, overflow: 'hidden' },
  tpl: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space[3] },
  tplBtn: { borderWidth: 1, borderColor: colors.border, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.pill, alignItems: 'center' },
  tplBtnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  manage: { marginTop: space[2], padding: space[3], borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, borderRadius: radius.md, alignItems: 'center' },
})
