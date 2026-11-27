import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import Button from '../../atoms/Button'
import Card from '../../atoms/Card'
import Row from '../../atoms/Row'
import Text from '../../atoms/Text'
import EmptyState from '../../molecules/EmptyState'
import SportIcon from '../../atoms/SportIcon'
import UserLink from '../../molecules/UserLink'
import { colors, fs, space } from '@/ui/theme'

// Saved workouts tab. Props: saved, onRemove(id)
export default function SavedTab({ saved, onRemove }) {
  const [openId, setOpenId] = useState(null)

  if (!saved.length) {
    return <EmptyState icon="🔖" title="Nothing saved yet" description="Save a workout from another athlete's profile and it lands here." />
  }

  return saved.map(w => (
    <Card key={w.id} padding="md">
      <Row>
        <SportIcon sport={w.sport} size="md" />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text weight="semibold">{w.title}</Text>
          <Text variant="dim">{w.exercises.length} exercises · {w.durationMin} min · saved {w.savedAt.toLowerCase()}</Text>
        </View>
        <Button size="sm" onPress={() => router.push('/workout')}>Start</Button>
      </Row>

      <View style={st.foot}>
        <Text variant="dim" style={{ flex: 1 }}>
          from <UserLink user={w.from} style={{ color: colors.textMuted, fontSize: fs.xs }}>{w.from.name}</UserLink>
        </Text>
        <Pressable onPress={() => setOpenId(openId === w.id ? null : w.id)}>
          <Text variant="link" style={{ fontSize: fs.xs }}>{openId === w.id ? 'Hide exercises' : 'Show exercises'}</Text>
        </Pressable>
        <Pressable onPress={() => onRemove(w.id)}>
          <Text variant="link" color={colors.danger} style={{ fontSize: fs.xs }}>Remove</Text>
        </Pressable>
      </View>

      {openId === w.id && w.exercises.map((ex, i) => (
        <View key={ex.name} style={[st.ex, i === w.exercises.length - 1 && { borderBottomWidth: 0 }]}>
          <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>{ex.name}</Text>
          <Text variant="muted" color={colors.textDim}>{ex.sets} × {ex.reps}</Text>
        </View>
      ))}
    </Card>
  ))
}

const st = StyleSheet.create({
  foot: { flexDirection: 'row', alignItems: 'center', gap: space[3], borderTopWidth: 1, borderTopColor: colors.border, paddingTop: space[2] },
  ex: { flexDirection: 'row', justifyContent: 'space-between', gap: space[3], paddingVertical: space[1], borderBottomWidth: 1, borderBottomColor: colors.border },
})
