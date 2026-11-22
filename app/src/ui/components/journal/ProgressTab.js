import { StyleSheet, Text, View } from 'react-native'
import { Badge, Card, s as ui } from '@/ui/components/ui'
import ExerciseProgress from '@/ui/components/ExerciseProgress'
import { TIERS } from '@/domain/ranking'
import { colors, fs, fw, radius, space } from '@/ui/theme'
import { js } from './styles'

// Progress tab: last-30-days totals, exercise progress, goals, rank. Props: data
export default function ProgressTab({ data }) {
  const { last30, goals, rank, exerciseProgress } = data
  return (
    <>
      <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', paddingTop: space[6] }}>
        {[[last30.sessions, 'Sessions'], [`${last30.hours}h`, 'Time'], [`${last30.km}km`, 'Distance']].map(([v, l]) => (
          <View key={l} style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontSize: fs.xl, fontWeight: fw.bold, color: colors.text }}>{v}</Text>
            <Text style={st.upperDim}>{l.toUpperCase()}</Text>
          </View>
        ))}
        <Text style={[ui.dim, { position: 'absolute', top: space[3], right: space[4] }]}>Last 30 days</Text>
      </Card>

      <Card padding="lg">
        <Text style={js.sectionH}>Exercise progress</Text>
        <ExerciseProgress series={exerciseProgress} />
      </Card>

      <Text style={js.sectionH}>Goals</Text>
      {goals.map(g => (
        <Card key={g.id} padding="md">
          <View style={[ui.row, { justifyContent: 'space-between' }]}>
            <Text style={{ fontWeight: fw.medium, color: colors.text, flexShrink: 1 }}>{g.label}</Text>
            <Badge tone="accent">{Math.round(g.progress * 100)}%</Badge>
          </View>
          <View style={st.goalBar}>
            <View style={[st.goalFill, { width: `${g.progress * 100}%` }]} />
          </View>
        </Card>
      ))}

      {/* hex + '1f'/'59' alpha ≈ old color-mix 12% / 35% */}
      <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: rank.color + '1f', borderColor: rank.color + '59' }}>
        <Text style={{ fontSize: 32 }}>{rank.icon}</Text>
        <View style={{ flex: 1, gap: space[1] }}>
          <Text style={{ fontWeight: fw.bold, fontSize: fs.md, color: rank.color }}>{rank.label} {rank.division}</Text>
          <Text style={ui.dim}>
            {rank.placement
              ? `${rank.placement.done}/${rank.placement.required} sessions to get placed`
              : `${rank.dots} DOTS${rank.next ? ` · ${rank.toNext} to ${rank.next.label}` : ''}`}
          </Text>
        </View>
        <View style={[ui.row, { gap: 4 }]}>
          {TIERS.map(r => <View key={r.id} style={[st.pip, r.id === rank.id && { backgroundColor: rank.color, borderColor: rank.color }]} />)}
        </View>
      </Card>
    </>
  )
}

const st = StyleSheet.create({
  upperDim: { fontSize: fs.xs, color: colors.textDim, letterSpacing: 0.6 },
  goalBar: { height: 8, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill },
  pip: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
})
