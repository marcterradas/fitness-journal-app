import { StyleSheet, View } from 'react-native'
import Badge from '../../atoms/Badge'
import Card from '../../atoms/Card'
import Row from '../../atoms/Row'
import Text from '../../atoms/Text'
import ExerciseProgress from '../ExerciseProgress'
import { TIERS } from '@/domain/ranking'
import { colors, radius, space } from '@/ui/theme'

// Progress tab: last-30-days totals, exercise progress, goals, rank. Props: data
export default function ProgressTab({ data }) {
  const { last30, goals, rank, exerciseProgress } = data
  return (
    <>
      <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', paddingTop: space[6] }}>
        {[[last30.sessions, 'Sessions'], [`${last30.hours}h`, 'Time'], [`${last30.km}km`, 'Distance']].map(([v, l]) => (
          <View key={l} style={{ flex: 1, gap: 2 }}>
            <Text variant="h2">{v}</Text>
            <Text variant="overline">{l}</Text>
          </View>
        ))}
        <Text variant="dim" style={{ position: 'absolute', top: space[3], right: space[4] }}>Last 30 days</Text>
      </Card>

      <Card padding="lg">
        <Text variant="label" weight="semibold">Exercise progress</Text>
        <ExerciseProgress series={exerciseProgress} />
      </Card>

      <Text variant="label" weight="semibold">Goals</Text>
      {goals.map(g => (
        <Card key={g.id} padding="md">
          <Row justify="space-between">
            <Text weight="medium" style={{ flexShrink: 1 }}>{g.label}</Text>
            <Badge tone="accent">{Math.round(g.progress * 100)}%</Badge>
          </Row>
          <View style={st.goalBar}>
            <View style={[st.goalFill, { width: `${g.progress * 100}%` }]} />
          </View>
        </Card>
      ))}

      {/* hex + '1f'/'59' alpha ≈ old color-mix 12% / 35% */}
      <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: rank.color + '1f', borderColor: rank.color + '59' }}>
        <Text style={{ fontSize: 32 }}>{rank.icon}</Text>
        <View style={{ flex: 1, gap: space[1] }}>
          <Text weight="bold" color={rank.color}>{rank.label} {rank.division}</Text>
          <Text variant="dim">
            {rank.placement
              ? `${rank.placement.done}/${rank.placement.required} sessions to get placed`
              : `${rank.dots} DOTS${rank.next ? ` · ${rank.toNext} to ${rank.next.label}` : ''}`}
          </Text>
        </View>
        <Row gap={1}>
          {TIERS.map(r => <View key={r.id} style={[st.pip, r.id === rank.id && { backgroundColor: rank.color, borderColor: rank.color }]} />)}
        </Row>
      </Card>
    </>
  )
}

const st = StyleSheet.create({
  goalBar: { height: 8, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill },
  pip: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
})
