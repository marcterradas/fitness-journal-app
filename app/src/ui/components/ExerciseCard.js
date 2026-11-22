import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, fs, fw, radius, space } from '@/ui/theme'

// One exercise with its set rows (old ExerciseCard.vue).
// Vue mutated the prop in place (v-model on exercise.name / set.weight); React can't, so field
// edits go up through onUpdate(nextExercise). Other emits → onToggleSet(si), onAddSet(),
// onRemoveSet(si), onCopyLast(si), onRemove().
export default function ExerciseCard({ exercise, index, focus = false, onToggleSet, onAddSet, onRemoveSet, onCopyLast, onRemove, onUpdate }) {
  const [collapsed, setCollapsed] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [openComment, setOpenComment] = useState(null)

  const sets = exercise.sets
  const doneCount = sets.filter(x => x.completed).length
  const done = sets.length > 0 && doneCount === sets.length
  const progress = sets.length ? Math.round((doneCount / sets.length) * 100) : 0
  const showBody = focus || !collapsed

  const editSet = (si, patch) => onUpdate?.({ ...exercise, sets: sets.map((x, i) => (i === si ? { ...x, ...patch } : x)) })
  const toggleCollapsed = () => !focus && setCollapsed(c => !c)

  return (
    <View style={[st.card, done && st.cardDone, focus && st.cardFocus]}>
      <View style={st.head}>
        <View style={[st.index, done && st.indexDone]}>
          <Text style={[st.indexText, done && { color: colors.accentInk }]}>{index + 1}</Text>
        </View>
        <Pressable style={st.titleWrap} onPress={toggleCollapsed}>
          {editingName ? (
            <TextInput
              autoFocus
              selectTextOnFocus
              value={exercise.name}
              onChangeText={name => onUpdate?.({ ...exercise, name })}
              onBlur={() => setEditingName(false)}
              onSubmitEditing={() => setEditingName(false)}
              style={st.nameInput}
            />
          ) : (
            <Pressable onPress={() => setEditingName(true)} accessibilityHint="Rename exercise">
              <Text style={[st.title, focus && { fontSize: fs.xl }]}>
                {exercise.name} <Text style={st.pencil}>✎</Text>
              </Text>
            </Pressable>
          )}
          {!!exercise.note && <Text style={st.note}>{exercise.note}</Text>}
        </Pressable>
        <View style={st.meta}>
          <Text style={[st.progress, done && { color: colors.accent }]}>{progress}%</Text>
          <Pressable style={st.headBtn} onPress={onRemove} accessibilityLabel="Remove exercise">
            <Text style={st.headBtnText}>×</Text>
          </Pressable>
          {!focus && (
            <Pressable style={st.headBtn} onPress={toggleCollapsed} accessibilityLabel={collapsed ? 'Expand' : 'Collapse'}>
              <Text style={st.headBtnText}>{collapsed ? '▾' : '▴'}</Text>
            </Pressable>
          )}
        </View>
      </View>

      {showBody && (
        <View style={st.body}>
          <View style={st.setsHead}>
            <Text style={[st.col, st.colNum]}>#</Text>
            <Text style={[st.col, st.colFlex]}>Weight</Text>
            <Text style={[st.col, st.colFlex]}>Reps</Text>
            <Text style={[st.col, st.colRpe]}>@ RPE</Text>
            <View style={st.colAct} />
          </View>

          {sets.map((set, si) => {
            const last = exercise.lastWeek?.[si]
            const fieldBg = focus ? colors.bgElevated : colors.surface
            return (
              <View key={set.id} style={{ gap: space[2] }}>
                <View style={[st.set, focus && { backgroundColor: colors.surface }, set.completed && st.setDone]}>
                  <Pressable style={[st.num, set.completed && st.numDone]} onPress={() => onToggleSet?.(si)}>
                    <Text style={[st.numText, set.completed && { color: colors.accentInk }]}>{set.completed ? '✓' : si + 1}</Text>
                  </Pressable>

                  <View style={[st.field, st.colFlex, { backgroundColor: fieldBg }]}>
                    <TextInput
                      value={String(set.weight)}
                      onChangeText={t => editSet(si, { weight: t })}
                      keyboardType="decimal-pad"
                      editable={!set.completed}
                      style={[st.input, set.completed && st.inputDisabled]}
                    />
                    <Text style={st.unit}>kg</Text>
                  </View>
                  <View style={[st.field, st.colFlex, { backgroundColor: fieldBg }]}>
                    <TextInput
                      value={String(set.reps)}
                      onChangeText={t => editSet(si, { reps: t })}
                      keyboardType="number-pad"
                      editable={!set.completed}
                      style={[st.input, set.completed && st.inputDisabled]}
                    />
                  </View>
                  <View style={[st.field, st.colRpe, { backgroundColor: fieldBg, justifyContent: 'center' }]}>
                    <Text style={st.unit}>@</Text>
                    <TextInput
                      value={String(set.rpe)}
                      onChangeText={t => editSet(si, { rpe: t })}
                      keyboardType="decimal-pad"
                      editable={!set.completed}
                      style={[st.input, set.completed && st.inputDisabled]}
                    />
                  </View>

                  <View style={[st.colAct, st.act]}>
                    <Pressable style={st.iconBtn} onPress={() => setOpenComment(o => (o === si ? null : si))} accessibilityLabel="Add note">
                      <Text style={{ fontSize: fs.sm, opacity: set.comment ? 1 : 0.6 }}>💬</Text>
                    </Pressable>
                    <Pressable style={st.iconBtn} onPress={() => onRemoveSet?.(si)} accessibilityLabel="Remove set">
                      <Text style={st.headBtnText}>×</Text>
                    </Pressable>
                  </View>
                </View>

                {!!last && (
                  <View style={st.lastweek}>
                    <Text style={st.lastLbl}>LAST WEEK</Text>
                    <Text style={st.lastData}>
                      {last.weight}kg × {last.reps} <Text style={{ color: colors.textDim }}>@{last.rpe}</Text>
                    </Text>
                    <Pressable style={st.copy} onPress={() => onCopyLast?.(si)}>
                      <Text style={st.copyText}>Copy ↺</Text>
                    </Pressable>
                  </View>
                )}

                {openComment === si && (
                  <TextInput
                    multiline
                    numberOfLines={2}
                    value={set.comment}
                    onChangeText={comment => editSet(si, { comment })}
                    placeholder="How did it feel? Any cues?"
                    placeholderTextColor={colors.textDim}
                    style={st.comment}
                  />
                )}
              </View>
            )
          })}

          <Pressable style={st.addSet} onPress={onAddSet}>
            <Text style={st.addSetText}>+ Add set</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const st = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  cardDone: { borderColor: colors.accent, backgroundColor: '#1c2324' },
  cardFocus: { backgroundColor: colors.bgElevated },

  head: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4] },
  index: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  indexDone: { backgroundColor: colors.accent },
  indexText: { color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.bold },
  titleWrap: { flex: 1, minWidth: 0 },
  title: { color: colors.text, fontSize: fs.lg, fontWeight: fw.semibold },
  pencil: { color: colors.textDim, fontSize: fs.xs },
  nameInput: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.accent, color: colors.text, fontSize: fs.lg, fontWeight: fw.semibold, paddingVertical: space[1], paddingHorizontal: space[2], borderRadius: radius.sm },
  note: { color: colors.textDim, fontSize: fs.xs, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  progress: { color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.semibold, minWidth: 40, textAlign: 'right', fontVariant: ['tabular-nums'] },
  headBtn: { width: 28, height: 28, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  headBtnText: { color: colors.textDim, fontSize: fs.md },

  body: { gap: space[2], paddingHorizontal: space[3], paddingBottom: space[4] },
  setsHead: { flexDirection: 'row', alignItems: 'center', gap: space[1], paddingHorizontal: space[3] },
  col: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.medium, textTransform: 'uppercase', letterSpacing: 0.7 },
  colNum: { width: 36, textAlign: 'center' },
  colFlex: { flex: 1 },
  colRpe: { width: 64, textAlign: 'center' },
  colAct: { width: 64 },

  set: { flexDirection: 'row', alignItems: 'center', gap: space[1], backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: space[2], paddingHorizontal: space[3] },
  setDone: { backgroundColor: '#1f2a1c', borderColor: colors.accent },
  num: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  numDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  numText: { color: colors.text, fontSize: fs.sm, fontWeight: fw.bold },
  field: { flexDirection: 'row', alignItems: 'center', gap: space[1], borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: space[2] },
  input: { flex: 1, minWidth: 0, color: colors.text, fontSize: fs.md, fontWeight: fw.semibold, paddingVertical: space[2], textAlign: 'center', fontVariant: ['tabular-nums'] },
  inputDisabled: { color: colors.textMuted },
  unit: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.medium },
  act: { flexDirection: 'row', gap: 2 },
  iconBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },

  lastweek: { flexDirection: 'row', alignItems: 'center', gap: space[2], paddingLeft: 36 + space[3], paddingRight: space[3] },
  lastLbl: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.medium, letterSpacing: 0.7 },
  lastData: { color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.medium, fontVariant: ['tabular-nums'] },
  copy: { marginLeft: 'auto', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingVertical: 2, paddingHorizontal: space[2] },
  copyText: { color: colors.textMuted, fontSize: fs.xs },

  comment: { marginHorizontal: space[3], backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, color: colors.text, paddingVertical: space[2], paddingHorizontal: space[3], fontSize: fs.sm, minHeight: 56, textAlignVertical: 'top' },

  addSet: { marginTop: space[1], borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, padding: space[3], borderRadius: radius.md, alignItems: 'center' },
  addSetText: { color: colors.textMuted, fontWeight: fw.semibold, fontSize: fs.sm },
})
