import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Button from '../../atoms/Button'
import Chip from '../../atoms/Chip'
import IconButton from '../../atoms/IconButton'
import Input from '../../atoms/Input'
import Row from '../../atoms/Row'
import Text from '../../atoms/Text'
import { MOODS, SPORT_TYPES } from '@/domain/catalog'
import { blankEntryForm, needsDistance, needsVolume, validateEntryForm } from '@/domain/journal'
import { colors, radius, space } from '@/ui/theme'

// Bottom sheet with the new-entry form. Holds only form state; rules come from domain/journal.
// Mount it with a fresh `key` per opening to reset the form.
// Props: visible, date, onClose, onSave(form) → Promise<{ errors? }>
export default function NewEntrySheet({ visible, date, onClose, onSave }) {
  const [form, setForm] = useState(() => blankEntryForm(date))
  const [errors, setErrors] = useState({})
  const set = patch => setForm(f => ({ ...f, ...patch }))
  const canSave = !Object.keys(validateEntryForm(form)).length

  async function save() {
    const result = await onSave(form)
    if (result?.errors) setErrors(result.errors)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose}>
        {/* inner Pressable swallows taps so they don't close the sheet (= @click.self) */}
        <Pressable style={st.panel} onPress={() => {}} accessibilityLabel="New journal entry">
          <ScrollView contentContainerStyle={{ gap: space[3] }} keyboardShouldPersistTaps="handled">
            <View style={st.handle} />
            <Row justify="space-between" align="flex-start">
              <View>
                <Text variant="overline" style={{ marginBottom: space[1] }}>Journal</Text>
                <Text variant="h2">New entry</Text>
              </View>
              <IconButton icon="close" label="Close" variant="filled" size={32} onPress={onClose} />
            </Row>

            {/* ponytail: plain YYYY-MM-DD text field, no date picker dep */}
            <Input label="Date" error={errors.date} value={form.date} onChangeText={date => set({ date })} placeholder="YYYY-MM-DD" />

            <Field label="Sport">
              <View style={st.chips}>
                {SPORT_TYPES.map(s => (
                  <Chip key={s.id} size="sm" active={form.sport === s.id} onPress={() => set({ sport: s.id })}>{s.emoji} {s.label}</Chip>
                ))}
              </View>
            </Field>

            <Input label="Title" error={errors.title} value={form.title} onChangeText={title => set({ title })} placeholder="Push day — felt strong" />

            <Row gap={3} align="flex-start">
              <View style={st.col}>
                <Input label="Duration (min)" value={form.durationMin} onChangeText={durationMin => set({ durationMin })} keyboardType="numeric" />
              </View>
              {needsDistance(form.sport) && (
                <View style={st.col}>
                  <Input label="Distance (km)" value={form.distanceKm} onChangeText={distanceKm => set({ distanceKm })} keyboardType="decimal-pad" />
                </View>
              )}
              {needsVolume(form.sport) && (
                <View style={st.col}>
                  <Input label="Volume (kg)" value={form.volumeKg} onChangeText={volumeKg => set({ volumeKg })} keyboardType="numeric" />
                </View>
              )}
            </Row>

            <Field label="Mood">
              <View style={st.chips}>
                {MOODS.map(m => (
                  <Chip key={m.id} size="sm" active={form.mood === m.id} onPress={() => set({ mood: m.id })}>{m.emoji} {m.label}</Chip>
                ))}
              </View>
            </Field>

            {/* ponytail: range input → 10 tappable segments (core RN has no slider) */}
            <Field label={`Effort (RPE) — ${form.rpe}/10`}>
              <Row gap={1}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <Pressable key={n} onPress={() => set({ rpe: n })} hitSlop={6} style={[st.rpeSeg, n <= form.rpe && { backgroundColor: colors.accent }]} accessibilityLabel={`RPE ${n}`} />
                ))}
              </Row>
            </Field>

            <Input label="Notes" style={{ minHeight: 72, textAlignVertical: 'top' }} value={form.notes} onChangeText={notes => set({ notes })} multiline placeholder="How did it go?" />

            <Row style={{ marginTop: space[2] }}>
              <Button variant="secondary" style={st.col} onPress={onClose}>Cancel</Button>
              <Button style={st.col} onPress={save} disabled={!canSave}>Save entry</Button>
            </Row>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

// Label + control group (chips, RPE). Text fields use the Input atom, so the label matches its style.
function Field({ label, children }) {
  return (
    <View style={{ gap: space[1] }}>
      <Text variant="label">{label}</Text>
      {children}
    </View>
  )
}

const st = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' },
  panel: { width: '100%', maxWidth: 576, maxHeight: '88%', backgroundColor: colors.bgElevated, borderTopWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space[4], paddingHorizontal: space[5], paddingBottom: space[6] },
  handle: { width: 40, height: 4, backgroundColor: colors.borderStrong, borderRadius: radius.pill, alignSelf: 'center', marginBottom: space[2] },
  col: { flex: 1, minWidth: 0 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  rpeSeg: { flex: 1, height: 10, borderRadius: radius.pill, backgroundColor: colors.surface2 },
})
