import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Card, EmptyState, UserLink, s as ui } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
import { colors, fs, fw, radius, space } from '@/ui/theme'
import { js } from './styles'

// Saved workouts tab. Props: saved, onRemove(id)
export default function SavedTab({ saved, onRemove }) {
  const [openId, setOpenId] = useState(null)

  if (!saved.length) {
    return <EmptyState icon="🔖" title="Nothing saved yet" description="Save a workout from another athlete's profile and it lands here." />
  }

  return saved.map(w => (
    <Card key={w.id} padding="md">
      <View style={ui.row}>
        <SportIcon sport={w.sport} size="md" />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontWeight: fw.semibold, color: colors.text }}>{w.title}</Text>
          <Text style={ui.dim}>{w.exercises.length} exercises · {w.durationMin} min · saved {w.savedAt.toLowerCase()}</Text>
        </View>
        <Pressable style={st.startBtn} onPress={() => router.push('/workout')}>
          <Text style={[js.primaryText, { fontSize: fs.sm }]}>Start</Text>
        </Pressable>
      </View>

      <View style={st.foot}>
        <Text style={[ui.dim, { flex: 1 }]}>
          from <UserLink user={w.from} style={{ color: colors.textMuted, fontSize: fs.xs }}>{w.from.name}</UserLink>
        </Text>
        <Pressable onPress={() => setOpenId(openId === w.id ? null : w.id)}>
          <Text style={[js.link, { fontSize: fs.xs }]}>{openId === w.id ? 'Hide exercises' : 'Show exercises'}</Text>
        </Pressable>
        <Pressable onPress={() => onRemove(w.id)}>
          <Text style={[js.link, { fontSize: fs.xs, color: colors.danger }]}>Remove</Text>
        </Pressable>
      </View>

      {openId === w.id && w.exercises.map((ex, i) => (
        <View key={ex.name} style={[st.ex, i === w.exercises.length - 1 && { borderBottomWidth: 0 }]}>
          <Text style={[js.itemText, { flex: 1 }]} numberOfLines={1}>{ex.name}</Text>
          <Text style={js.itemMeta}>{ex.sets} × {ex.reps}</Text>
        </View>
      ))}
    </Card>
  ))
}

const st = StyleSheet.create({
  startBtn: { paddingVertical: space[2], paddingHorizontal: space[4], backgroundColor: colors.accent, borderRadius: radius.pill },
  foot: { flexDirection: 'row', alignItems: 'center', gap: space[3], borderTopWidth: 1, borderTopColor: colors.border, paddingTop: space[2] },
  ex: { flexDirection: 'row', justifyContent: 'space-between', gap: space[3], paddingVertical: space[1], borderBottomWidth: 1, borderBottomColor: colors.border },
})
