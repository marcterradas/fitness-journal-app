import { useEffect, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Card, Screen } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
import ExerciseCard from '@/ui/components/ExerciseCard'
import { useTimer } from '@/ui/hooks/useTimer'
import { WEEKDAYS, weeklyTemplates } from '@/api/mock/data/templates'
import { colors, fs, fw, radius, space } from '@/ui/theme'

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
            <View style={st.head}>
              <Pressable style={st.back} onPress={() => router.back()} accessibilityLabel="Back">
                <Text style={st.backText}>←</Text>
              </Pressable>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={st.eyebrow}>{today}</Text>
                <Text style={st.title}>Today's workout</Text>
              </View>
              <Pressable style={st.iconBtn} onPress={() => setPickerOpen(true)} accessibilityLabel="Templates">
                <Text style={st.iconBtnText}>🗓</Text>
              </Pressable>
              <Pressable style={st.iconBtn} onPress={share} accessibilityLabel="Share workout">
                <Text style={st.iconBtnText}>↗</Text>
              </Pressable>
            </View>

            <Card padding="md" style={st.summary}>
              <SportIcon sport={sport} size="md" />
              <View style={st.sumItem}>
                <Text style={st.sumV}>{completedCount}<Text style={{ color: colors.textDim }}> / </Text>{totalSets}</Text>
                <Text style={st.sumL}>SETS</Text>
              </View>
              <View style={st.sumItem}>
                <Text style={st.sumV}>{exercises.length}</Text>
                <Text style={st.sumL}>EXERCISES</Text>
              </View>
              <View style={st.sumItem}>
                <Text style={st.sumV}>{sessionRunning ? elapsed : totalVolume.toLocaleString()}</Text>
                <Text style={st.sumL}>{sessionRunning ? 'ELAPSED' : 'KG VOLUME'}</Text>
              </View>
              <ProgressBar pct={progressPct} />
            </Card>

            {exercises.length > 0 && (
              <Pressable style={st.primary} onPress={startSession}>
                <Text style={st.primaryText}>{sessionRunning ? `Back to session · ${elapsed}` : 'Start workout →'}</Text>
              </Pressable>
            )}

            {exercises.map((ex, ei) => <ExerciseCard key={ex.id} {...cardProps(ex, ei, false)} />)}

            <Pressable style={st.addExercise} onPress={addExercise}>
              <Text style={st.addExerciseText}>+ Add exercise</Text>
            </Pressable>

            {sessionRunning && (
              <Pressable style={[st.primary, { marginTop: space[3] }]} onPress={finish}>
                <Text style={st.primaryText}>Finish workout</Text>
              </Pressable>
            )}
          </>
        ) : (
          <>
            <View style={st.focusBar}>
              <Pressable style={st.back} onPress={() => setMode('plan')} accessibilityLabel="Back to full workout">
                <Text style={st.backText}>☰</Text>
              </Pressable>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={st.focusTime}>{elapsed}</Text>
                <Text style={st.sumL}>ELAPSED</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text style={st.focusStat}>{completedCount}/{totalSets} sets</Text>
                <Text style={st.focusStat}>{totalVolume.toLocaleString()} kg</Text>
              </View>
              <ProgressBar pct={progressPct} />
            </View>

            <View style={st.nav}>
              <Pressable style={[st.navBtn, current === 0 && st.disabled]} disabled={current === 0} onPress={() => go(-1)}>
                <Text style={st.navBtnText}>← Prev</Text>
              </Pressable>
              <Text style={st.eyebrow}>EXERCISE {current + 1} OF {exercises.length}</Text>
              <Pressable style={[st.navBtn, current >= exercises.length - 1 && st.disabled]} disabled={current >= exercises.length - 1} onPress={() => go(1)}>
                <Text style={st.navBtnText}>Next →</Text>
              </Pressable>
            </View>

            {!!currentExercise && <ExerciseCard key={currentExercise.id} {...cardProps(currentExercise, current, true)} />}

            <View style={st.dots}>
              {exercises.map((ex, ei) => (
                <Pressable
                  key={ex.id}
                  accessibilityLabel={ex.name}
                  hitSlop={8}
                  onPress={() => { setCurrent(ei); dismissRest() }}
                  style={[st.dot, exerciseDone(ex) && st.dotDone, ei === current && st.dotActive]}
                />
              ))}
            </View>

            {!!currentExercise && exerciseDone(currentExercise) && current < exercises.length - 1 && (
              <Pressable style={st.nextCta} onPress={() => go(1)}>
                <Text style={st.nextCtaText}>Next: {exercises[current + 1].name} →</Text>
              </Pressable>
            )}

            <Pressable style={[st.primary, { marginTop: space[3] }]} onPress={finish}>
              <Text style={st.primaryText}>Finish workout</Text>
            </Pressable>

            <View style={st.restPref}>
              <Text style={st.eyebrow}>REST</Text>
              {REST_OPTIONS.map(o => (
                <Pressable key={o} style={[st.restOpt, restSeconds === o && st.restOptOn]} onPress={() => setRestSeconds(o)}>
                  <Text style={[st.restOptText, restSeconds === o && { color: colors.secondary }]}>{o >= 60 ? `${o / 60}m` : `${o}s`}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </Screen>

      {/* Rest timer bar, floats over the list */}
      {restOpen && (
        <View style={[st.rest, { bottom: floatBottom }]}>
          <Text style={{ fontSize: 20 }}>⏱</Text>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={st.restTime}>{rest.formattedTime}</Text>
            <Text style={st.restLbl}>{rest.timeRemaining === 0 ? 'Rest over — go' : 'Rest'}</Text>
          </View>
          <View style={st.restActions}>
            <RestBtn label="−30s" onPress={() => addRest(-30)} />
            <RestBtn label="+30s" onPress={() => addRest(30)} />
            <RestBtn label={rest.isActive ? 'Pause' : 'Resume'} onPress={rest.toggle} />
            <RestBtn label="Skip" skip onPress={dismissRest} />
          </View>
        </View>
      )}

      {!!toast && (
        <View style={[st.toast, { bottom: floatBottom + (restOpen ? 90 : 0) }]} pointerEvents="none">
          <Text style={st.toastText}>{toast}</Text>
        </View>
      )}

      {/* Template picker drawer */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={st.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerOpen(false)} accessibilityLabel="Close" />
          <View style={[st.sheet, { paddingBottom: insets.bottom + space[6] }]}>
            <View style={st.handle} />
            <View style={st.pickerHead}>
              <View>
                <Text style={st.eyebrow}>TEMPLATES</Text>
                <Text style={st.pickerTitle}>Use a weekly plan</Text>
              </View>
              <Pressable style={st.close} onPress={() => setPickerOpen(false)} accessibilityLabel="Close">
                <Text style={{ color: colors.text, fontSize: fs.lg }}>×</Text>
              </Pressable>
            </View>
            <Text style={st.hint}>Tap a day to append its exercises. "Replace" clears your current list first.</Text>
            <ScrollView contentContainerStyle={{ gap: space[2] }}>
              {WEEKDAYS.map(d => {
                const tpl = weeklyTemplates[d.id]
                return (
                  <View key={d.id} style={st.tpl}>
                    <Text style={st.tplDay}>{d.label.toUpperCase()}</Text>
                    {tpl ? <SportIcon sport={tpl.sport} size="sm" /> : <Text style={st.tplRest}>—</Text>}
                    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                      <Text style={st.tplName}>{tpl?.title || 'Rest day'}</Text>
                      {!!tpl && <Text style={st.tplMeta}>{tpl.exercises.length} exercises · {tpl.durationMin} min</Text>}
                    </View>
                    {!!tpl && (
                      <View style={{ gap: space[1] }}>
                        <Pressable style={st.tplBtn} onPress={() => loadTemplate(d.id, true)}>
                          <Text style={st.tplBtnText}>Replace</Text>
                        </Pressable>
                        <Pressable style={[st.tplBtn, st.tplBtnPrimary]} onPress={() => loadTemplate(d.id)}>
                          <Text style={[st.tplBtnText, { color: colors.accentInk }]}>Use</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )
              })}
            </ScrollView>
            <Pressable style={st.manage} onPress={() => { setPickerOpen(false); router.push('/templates') }}>
              <Text style={st.manageText}>Edit weekly templates →</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    <Pressable style={[st.restBtn, skip && { borderColor: colors.borderStrong }]} onPress={onPress}>
      <Text style={[st.restBtnText, skip && { color: colors.textMuted }]}>{label}</Text>
    </Pressable>
  )
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.text, fontSize: 20 },
  eyebrow: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.medium, letterSpacing: 0.7, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5 },
  // ponytail: icon-only header buttons (old view hid the labels under 480px anyway)
  iconBtn: { paddingVertical: space[2], paddingHorizontal: space[3], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  iconBtnText: { color: colors.text, fontSize: fs.md },

  summary: { flexDirection: 'row', alignItems: 'center', gap: space[4], overflow: 'hidden' },
  sumItem: { flex: 1, gap: 2 },
  sumV: { color: colors.text, fontSize: fs.xl, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  sumL: { color: colors.textDim, fontSize: fs.xs, letterSpacing: 0.7 },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: colors.surface2 },
  barFill: { height: '100%', backgroundColor: colors.accent },

  primary: { padding: space[4], backgroundColor: colors.accent, borderRadius: radius.md, alignItems: 'center' },
  primaryText: { color: colors.accentInk, fontSize: fs.md, fontWeight: fw.bold },
  addExercise: { backgroundColor: colors.bgElevated, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, padding: space[4], borderRadius: radius.lg, alignItems: 'center' },
  addExerciseText: { color: colors.textMuted, fontWeight: fw.semibold, fontSize: fs.md },

  focusBar: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: space[3], paddingHorizontal: space[4], overflow: 'hidden' },
  focusTime: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  focusStat: { color: colors.textMuted, fontSize: fs.xs, fontVariant: ['tabular-nums'] },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  navBtn: { paddingVertical: space[2], paddingHorizontal: space[4], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  navBtnText: { color: colors.text, fontSize: fs.sm, fontWeight: fw.semibold },
  disabled: { opacity: 0.35 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space[3], paddingVertical: space[1] },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotActive: { transform: [{ scale: 1.5 }], borderColor: colors.text },
  nextCta: { paddingVertical: space[3], paddingHorizontal: space[4], backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, alignItems: 'center' },
  nextCtaText: { color: colors.accent, fontSize: fs.sm, fontWeight: fw.semibold },

  restPref: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2] },
  restOpt: { paddingVertical: 3, paddingHorizontal: space[3], borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  restOptOn: { backgroundColor: colors.secondarySoft, borderColor: colors.secondary },
  restOptText: { color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.semibold },

  rest: { position: 'absolute', left: space[4], right: space[4], maxWidth: 576, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[3], backgroundColor: '#1c2535', borderWidth: 1, borderColor: colors.secondary, borderRadius: radius.lg, paddingVertical: space[3], paddingHorizontal: space[4], shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  restTime: { color: colors.secondary, fontSize: fs.xl, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  restLbl: { color: colors.textMuted, fontSize: fs.xs },
  restActions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[1], justifyContent: 'flex-end' },
  restBtn: { paddingVertical: space[1], paddingHorizontal: space[3], borderWidth: 1, borderColor: colors.secondary, borderRadius: radius.pill },
  restBtnText: { color: colors.secondary, fontSize: fs.xs, fontWeight: fw.semibold },

  toast: { position: 'absolute', alignSelf: 'center', backgroundColor: colors.text, paddingVertical: space[3], paddingHorizontal: space[5], borderRadius: radius.pill },
  toastText: { color: colors.bg, fontWeight: fw.semibold, fontSize: fs.sm },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { width: '100%', maxWidth: 576, maxHeight: '88%', backgroundColor: colors.bgElevated, borderTopWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space[4], paddingHorizontal: space[5], gap: space[3] },
  handle: { width: 40, height: 4, backgroundColor: colors.borderStrong, borderRadius: radius.pill, alignSelf: 'center', marginBottom: space[2] },
  pickerHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space[3] },
  pickerTitle: { color: colors.text, fontSize: fs.xl, fontWeight: fw.bold, marginTop: 2 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  hint: { color: colors.textMuted, fontSize: fs.sm, backgroundColor: colors.surface, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md, overflow: 'hidden' },
  tpl: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space[3] },
  tplDay: { width: 40, color: colors.textDim, fontSize: fs.xs, fontWeight: fw.bold, letterSpacing: 0.7, textAlign: 'center' },
  tplRest: { width: 28, textAlign: 'center', color: colors.textDim },
  tplName: { color: colors.text, fontWeight: fw.semibold, fontSize: fs.sm },
  tplMeta: { color: colors.textDim, fontSize: fs.xs },
  tplBtn: { borderWidth: 1, borderColor: colors.border, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.pill, alignItems: 'center' },
  tplBtnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  tplBtnText: { color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.semibold },
  manage: { marginTop: space[2], padding: space[3], borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, borderRadius: radius.md, alignItems: 'center' },
  manageText: { color: colors.textMuted, fontSize: fs.sm },
})
