import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { colors, fs, fw, radius, space } from '@/ui/theme'
import Icon from '../atoms/Icon'
import IconButton from '../atoms/IconButton'
import Row from '../atoms/Row'
import Text from '../atoms/Text'

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
      <Row gap={3} style={{ padding: space[4] }}>
        <View style={[st.index, done && st.indexDone]}>
          <Text variant="muted" weight="bold" color={done ? colors.accentInk : undefined}>{index + 1}</Text>
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
              <Text variant="h3" weight="semibold" style={focus && { fontSize: fs.xl }}>
                {exercise.name} <Text variant="dim">✎</Text>
              </Text>
            </Pressable>
          )}
          {!!exercise.note && <Text variant="dim" style={{ marginTop: 2 }}>{exercise.note}</Text>}
        </Pressable>
        <Row>
          <Text variant="muted" weight="semibold" align="right" color={done ? colors.accent : undefined} style={st.progress}>{progress}%</Text>
          <IconButton label="Remove exercise" size={28} onPress={onRemove}>
            <Icon name="close" size={16} color={colors.textDim} />
          </IconButton>
          {!focus && (
            <IconButton label={collapsed ? 'Expand' : 'Collapse'} size={28} onPress={toggleCollapsed}>
              <Icon name={collapsed ? 'chevron-down' : 'chevron-up'} size={16} color={colors.textDim} />
            </IconButton>
          )}
        </Row>
      </Row>

      {showBody && (
        <View style={st.body}>
          <Row gap={1} style={{ paddingHorizontal: space[3] }}>
            <Text variant="overline" weight="medium" align="center" style={st.colNum}>#</Text>
            <Text variant="overline" weight="medium" style={st.colFlex}>Weight</Text>
            <Text variant="overline" weight="medium" style={st.colFlex}>Reps</Text>
            <Text variant="overline" weight="medium" align="center" style={st.colRpe}>@ RPE</Text>
            <View style={st.colAct} />
          </Row>

          {sets.map((set, si) => {
            const last = exercise.lastWeek?.[si]
            const fieldBg = focus ? colors.bgElevated : colors.surface
            return (
              <View key={set.id} style={{ gap: space[2] }}>
                <View style={[st.set, focus && { backgroundColor: colors.surface }, set.completed && st.setDone]}>
                  <Pressable style={[st.num, set.completed && st.numDone]} onPress={() => onToggleSet?.(si)} accessibilityRole="checkbox" accessibilityState={{ checked: !!set.completed }} accessibilityLabel={`Set ${si + 1}`}>
                    <Text variant="small" weight="bold" color={set.completed ? colors.accentInk : undefined}>{set.completed ? '✓' : si + 1}</Text>
                  </Pressable>

                  <View style={[st.field, st.colFlex, { backgroundColor: fieldBg }]}>
                    <TextInput
                      value={String(set.weight)}
                      onChangeText={t => editSet(si, { weight: t })}
                      keyboardType="decimal-pad"
                      editable={!set.completed}
                      style={[st.input, set.completed && st.inputDisabled]}
                    />
                    <Text variant="dim" weight="medium">kg</Text>
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
                    <Text variant="dim" weight="medium">@</Text>
                    <TextInput
                      value={String(set.rpe)}
                      onChangeText={t => editSet(si, { rpe: t })}
                      keyboardType="decimal-pad"
                      editable={!set.completed}
                      style={[st.input, set.completed && st.inputDisabled]}
                    />
                  </View>

                  <Row gap={0} style={st.colAct}>
                    <IconButton label="Add note" size={30} onPress={() => setOpenComment(o => (o === si ? null : si))}>
                      <Text variant="small" style={{ opacity: set.comment ? 1 : 0.6 }}>💬</Text>
                    </IconButton>
                    <IconButton label="Remove set" size={30} onPress={() => onRemoveSet?.(si)}>
                      <Icon name="close" size={16} color={colors.textDim} />
                    </IconButton>
                  </Row>
                </View>

                {!!last && (
                  <Row style={st.lastweek}>
                    <Text variant="overline" weight="medium">Last week</Text>
                    <Text variant="dim" weight="medium" color={colors.textMuted} style={st.tabular}>
                      {last.weight}kg × {last.reps} <Text variant="dim">@{last.rpe}</Text>
                    </Text>
                    <Pressable style={st.copy} onPress={() => onCopyLast?.(si)} accessibilityRole="button">
                      <Text variant="dim" color={colors.textMuted}>Copy ↺</Text>
                    </Pressable>
                  </Row>
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

          <Pressable style={st.addSet} onPress={onAddSet} accessibilityRole="button">
            <Text variant="muted" weight="semibold">+ Add set</Text>
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

  index: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  indexDone: { backgroundColor: colors.accent },
  titleWrap: { flex: 1, minWidth: 0 },
  nameInput: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.accent, color: colors.text, fontSize: fs.lg, fontWeight: fw.semibold, paddingVertical: space[1], paddingHorizontal: space[2], borderRadius: radius.sm },
  progress: { minWidth: 40, fontVariant: ['tabular-nums'] },

  body: { gap: space[2], paddingHorizontal: space[3], paddingBottom: space[4] },
  colNum: { width: 36 },
  colFlex: { flex: 1 },
  colRpe: { width: 64 },
  colAct: { width: 64 },

  set: { flexDirection: 'row', alignItems: 'center', gap: space[1], backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: space[2], paddingHorizontal: space[3] },
  setDone: { backgroundColor: '#1f2a1c', borderColor: colors.accent },
  num: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  numDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  field: { flexDirection: 'row', alignItems: 'center', gap: space[1], borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: space[2] },
  input: { flex: 1, minWidth: 0, color: colors.text, fontSize: fs.md, fontWeight: fw.semibold, paddingVertical: space[2], textAlign: 'center', fontVariant: ['tabular-nums'] },
  inputDisabled: { color: colors.textMuted },

  lastweek: { paddingLeft: 36 + space[3], paddingRight: space[3] },
  tabular: { fontVariant: ['tabular-nums'] },
  copy: { marginLeft: 'auto', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingVertical: 2, paddingHorizontal: space[2] },

  comment: { marginHorizontal: space[3], backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, color: colors.text, paddingVertical: space[2], paddingHorizontal: space[3], fontSize: fs.sm, minHeight: 56, textAlignVertical: 'top' },

  addSet: { marginTop: space[1], borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, padding: space[3], borderRadius: radius.md, alignItems: 'center' },
})
