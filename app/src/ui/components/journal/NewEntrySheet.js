import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Chip, s as ui } from '@/ui/components/ui'
import { MOODS, SPORT_TYPES } from '@/domain/catalog'
import { blankEntryForm, needsDistance, needsVolume, validateEntryForm } from '@/domain/journal'
import { colors, fs, fw, radius, space } from '@/ui/theme'
import { js } from './styles'

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
            <View style={[ui.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
              <View>
                <Text style={js.eyebrow}>JOURNAL</Text>
                <Text style={ui.h2}>New entry</Text>
              </View>
              <Pressable style={st.close} onPress={onClose} accessibilityLabel="Close">
                <Text style={{ color: colors.text, fontSize: fs.lg, lineHeight: fs.lg + 2 }}>×</Text>
              </Pressable>
            </View>

            {/* ponytail: plain YYYY-MM-DD text field, no date picker dep */}
            <Field label="Date" error={errors.date}>
              <TextInput style={st.input} value={form.date} onChangeText={date => set({ date })} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textDim} />
            </Field>

            <Field label="Sport">
              <View style={st.chips}>
                {SPORT_TYPES.map(s => (
                  <Chip key={s.id} size="sm" active={form.sport === s.id} onPress={() => set({ sport: s.id })}>{s.emoji} {s.label}</Chip>
                ))}
              </View>
            </Field>

            <Field label="Title" error={errors.title}>
              <TextInput style={st.input} value={form.title} onChangeText={title => set({ title })} placeholder="Push day — felt strong" placeholderTextColor={colors.textDim} />
            </Field>

            <View style={[ui.row, { alignItems: 'flex-start', gap: space[3] }]}>
              <Field label="Duration (min)">
                <TextInput style={st.input} value={form.durationMin} onChangeText={durationMin => set({ durationMin })} keyboardType="numeric" />
              </Field>
              {needsDistance(form.sport) && (
                <Field label="Distance (km)">
                  <TextInput style={st.input} value={form.distanceKm} onChangeText={distanceKm => set({ distanceKm })} keyboardType="decimal-pad" />
                </Field>
              )}
              {needsVolume(form.sport) && (
                <Field label="Volume (kg)">
                  <TextInput style={st.input} value={form.volumeKg} onChangeText={volumeKg => set({ volumeKg })} keyboardType="numeric" />
                </Field>
              )}
            </View>

            <Field label="Mood">
              <View style={st.chips}>
                {MOODS.map(m => (
                  <Chip key={m.id} size="sm" active={form.mood === m.id} onPress={() => set({ mood: m.id })}>{m.emoji} {m.label}</Chip>
                ))}
              </View>
            </Field>

            {/* ponytail: range input → 10 tappable segments (core RN has no slider) */}
            <Field label={`Effort (RPE) — ${form.rpe}/10`}>
              <View style={[ui.row, { gap: 4 }]}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <Pressable key={n} onPress={() => set({ rpe: n })} hitSlop={6} style={[st.rpeSeg, n <= form.rpe && { backgroundColor: colors.accent }]} accessibilityLabel={`RPE ${n}`} />
                ))}
              </View>
            </Field>

            <Field label="Notes">
              <TextInput style={[st.input, { minHeight: 72, textAlignVertical: 'top' }]} value={form.notes} onChangeText={notes => set({ notes })} multiline placeholder="How did it go?" placeholderTextColor={colors.textDim} />
            </Field>

            <View style={[ui.row, { marginTop: space[2] }]}>
              <Pressable style={st.btn} onPress={onClose}>
                <Text style={st.btnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[st.btn, st.btnPrimary, !canSave && { opacity: 0.5 }]} onPress={save} disabled={!canSave}>
                <Text style={[st.btnText, { color: colors.accentInk }]}>Save entry</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function Field({ label, error, children }) {
  return (
    <View style={{ gap: space[1], flex: 1, minWidth: 0 }}>
      <Text style={st.label}>{label.toUpperCase()}</Text>
      {children}
      {!!error && <Text style={{ color: colors.danger, fontSize: fs.xs }}>{error}</Text>}
    </View>
  )
}

const st = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' },
  panel: { width: '100%', maxWidth: 576, maxHeight: '88%', backgroundColor: colors.bgElevated, borderTopWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space[4], paddingHorizontal: space[5], paddingBottom: space[6] },
  handle: { width: 40, height: 4, backgroundColor: colors.borderStrong, borderRadius: radius.pill, alignSelf: 'center', marginBottom: space[2] },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: fs.xs, color: colors.textMuted, letterSpacing: 0.7, fontWeight: fw.medium },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, color: colors.text, padding: space[3], fontSize: fs.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  rpeSeg: { flex: 1, height: 10, borderRadius: radius.pill, backgroundColor: colors.surface2 },
  btn: { flex: 1, padding: space[3], borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  btnText: { color: colors.textMuted, fontSize: fs.md, fontWeight: fw.semibold },
})
