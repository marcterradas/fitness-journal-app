import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Avatar from '../atoms/Avatar'
import Card from '../atoms/Card'
import Chip from '../atoms/Chip'
import Row from '../atoms/Row'
import Text from '../atoms/Text'
import RankInfo from './RankInfo'
import UserLink from '../molecules/UserLink'
import { TIERS, needsReview, tierFromDots } from '@/domain/ranking'
import { POINTS_FORMULA, friendsBoard, globalBoard } from '@/api/mock/data/leaderboard'
import { colors, fs, radius, space } from '@/ui/theme'

const MEDALS = ['🥇', '🥈', '🥉']

function Delta({ d }) {
  const color = d > 0 ? colors.success : d < 0 ? colors.danger : colors.textDim
  return <Text variant="dim" color={color} style={styles.nums}>{d > 0 ? `▲${d}` : d < 0 ? `▼${-d}` : '–'}</Text>
}

export default function Leaderboard() {
  const [tab, setTab] = useState('friends')
  const [infoOpen, setInfoOpen] = useState(false)

  const rows = tab === 'friends' ? friendsBoard : globalBoard.top
  const podium = rows.slice(0, 3)
  const rest = rows.slice(3)
  const me = globalBoard.me
  const meTier = tierFromDots(me.dots)

  return (
    <View style={{ gap: space[4] }}>
      <Row>
        <Chip active={tab === 'friends'} onPress={() => setTab('friends')}>👥 Friends</Chip>
        <Chip active={tab === 'global'} onPress={() => setTab('global')}>🌍 Global</Chip>
        <Text variant="dim" style={{ marginLeft: 'auto' }}>All-time · never resets</Text>
      </Row>

      {/* Podium: 2nd, 1st, 3rd */}
      <Card padding="lg" style={styles.podium}>
        {[podium[1], podium[0], podium[2]].map(u => {
          const first = u === podium[0]
          const t = tierFromDots(u.dots)
          return (
            <View key={u.id} style={[styles.spot, first && { paddingBottom: space[4] }]}>
              <Text style={{ fontSize: 22 }}>{MEDALS[podium.indexOf(u)]}</Text>
              <Avatar src={u.avatar} size={first ? 'xl' : 'lg'} ring={first ? 'accent' : 'none'} />
              <UserLink user={u} style={[styles.podiumName, u.me && { color: colors.accent }]}>
                {u.me ? 'You' : u.name.split(' ')[0]}
              </UserLink>
              <Text variant="small" weight="bold" style={styles.nums}>{u.points.toLocaleString()} pts</Text>
              <Text variant="dim">{t.icon} {t.label} {t.division}</Text>
            </View>
          )
        })}
      </Card>

      {/* Rest of the board */}
      <Card padding="none" style={{ gap: 0, overflow: 'hidden' }}>
        {rest.map((u, i) => (
          <Row key={u.id} gap={3} style={[styles.row, u.me && styles.rowMe]}>
            <Text variant="small" weight="bold" color={colors.textDim} style={styles.pos}>{i + 4}</Text>
            <Avatar src={u.avatar} size="sm" />
            <View style={styles.who}>
              <Text numberOfLines={1}>
                <UserLink user={u} style={{ fontSize: fs.sm }}>{u.me ? 'You' : u.name}</UserLink>
                <Text variant="dim"> {tierFromDots(u.dots).icon}</Text>
              </Text>
              <Text variant="dim">
                <UserLink user={u} style={styles.handle}>@{u.username}</UserLink> · 🔥 {u.streak}d
              </Text>
            </View>
            <Delta d={u.delta} />
            <Text weight="bold" style={styles.nums}>{u.points.toLocaleString()}</Text>
          </Row>
        ))}

        {tab === 'global' && (
          <>
            <Text variant="dim" align="center" style={styles.gap}>···</Text>
            <Row gap={3} style={[styles.row, styles.rowMe, { borderBottomWidth: 0 }]}>
              <Text variant="small" weight="bold" color={colors.textDim} style={styles.pos}>{me.rank.toLocaleString()}</Text>
              <Avatar src={me.avatar} size="sm" />
              <View style={styles.who}>
                <Text variant="small" weight="semibold">You <Text variant="dim">{meTier.icon}</Text></Text>
                <Text variant="dim">
                  top {Math.ceil((me.rank / globalBoard.totalAthletes) * 100)}% of {globalBoard.totalAthletes.toLocaleString()} athletes
                </Text>
              </View>
              <Delta d={me.delta} />
              <Text weight="bold" style={styles.nums}>{me.points.toLocaleString()}</Text>
            </Row>
          </>
        )}
      </Card>

      {/* Tiers */}
      <Card>
        <Row justify="space-between">
          <Text variant="overline">Tiers · strength score</Text>
          <Pressable onPress={() => setInfoOpen(true)} accessibilityRole="button">
            <Text variant="link" style={{ fontSize: fs.xs }}>How ranks work ›</Text>
          </Pressable>
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }}>
          {TIERS.map(r => (
            <View key={r.id} style={[styles.tier, { borderColor: r.color + '59', backgroundColor: r.color + '14' }]}>
              <Text style={{ fontSize: 18 }}>{r.icon}</Text>
              <Text variant="dim" weight="semibold" color={r.color}>
                {r.label}{needsReview(r.id) ? ' 🎥' : ''}
              </Text>
              <Text variant="dim" style={{ fontSize: 10 }}>{r.min}+</Text>
            </View>
          ))}
        </ScrollView>
      </Card>

      <Text variant="dim" align="center">{POINTS_FORMULA}</Text>
      <Text variant="dim" align="center">
        Tier = best push + pull + legs 1RM, scaled to bodyweight &amp; sex (DOTS) · 🎥 from Diamond up, lifts are community-reviewed
      </Text>

      <RankInfo open={infoOpen} onClose={() => setInfoOpen(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  nums: { fontVariant: ['tabular-nums'] },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: space[6] },
  spot: { alignItems: 'center', gap: space[1], minWidth: 0 },
  podiumName: { fontSize: fs.sm, maxWidth: 112 },
  row: { paddingVertical: space[3], paddingHorizontal: space[4], borderBottomWidth: 1, borderBottomColor: colors.border },
  rowMe: { backgroundColor: colors.accentSoft, borderLeftWidth: 3, borderLeftColor: colors.accent },
  pos: { minWidth: 32, textAlign: 'center', fontVariant: ['tabular-nums'] },
  who: { flex: 1, minWidth: 0, gap: 2 },
  handle: { fontSize: fs.xs, color: colors.textDim, fontWeight: 'normal' },
  gap: { padding: space[1], letterSpacing: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  tier: { alignItems: 'center', gap: 2, paddingVertical: space[2], paddingHorizontal: space[3], borderWidth: 1, borderRadius: radius.md },
})
