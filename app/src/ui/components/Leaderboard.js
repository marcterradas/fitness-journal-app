import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Card, Chip, UserLink } from '@/ui/components/ui'
import RankInfo from '@/ui/components/RankInfo'
import { TIERS, needsReview, tierFromDots } from '@/domain/ranking'
import { POINTS_FORMULA, friendsBoard, globalBoard } from '@/api/mock/data/leaderboard'
import { colors, fs, fw, radius, space } from '@/ui/theme'

const MEDALS = ['🥇', '🥈', '🥉']

function Delta({ d }) {
  const color = d > 0 ? colors.success : d < 0 ? colors.danger : colors.textDim
  return <Text style={[styles.delta, { color }]}>{d > 0 ? `▲${d}` : d < 0 ? `▼${-d}` : '–'}</Text>
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
    <View style={styles.root}>
      <View style={styles.tabs}>
        <Chip active={tab === 'friends'} onPress={() => setTab('friends')}>👥 Friends</Chip>
        <Chip active={tab === 'global'} onPress={() => setTab('global')}>🌍 Global</Chip>
        <Text style={[styles.dim, { marginLeft: 'auto' }]}>All-time · never resets</Text>
      </View>

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
              <Text style={styles.podiumPts}>{u.points.toLocaleString()} pts</Text>
              <Text style={styles.dim}>{t.icon} {t.label} {t.division}</Text>
            </View>
          )
        })}
      </Card>

      {/* Rest of the board */}
      <Card padding="none" style={{ gap: 0, overflow: 'hidden' }}>
        {rest.map((u, i) => (
          <View key={u.id} style={[styles.row, u.me && styles.rowMe]}>
            <Text style={styles.pos}>{i + 4}</Text>
            <Avatar src={u.avatar} size="sm" />
            <View style={styles.who}>
              <Text numberOfLines={1}>
                <UserLink user={u} style={{ fontSize: fs.sm }}>{u.me ? 'You' : u.name}</UserLink>
                <Text style={{ fontSize: fs.xs }}> {tierFromDots(u.dots).icon}</Text>
              </Text>
              <Text style={styles.dim}>
                <UserLink user={u} style={styles.dim}>@{u.username}</UserLink> · 🔥 {u.streak}d
              </Text>
            </View>
            <Delta d={u.delta} />
            <Text style={styles.pts}>{u.points.toLocaleString()}</Text>
          </View>
        ))}

        {tab === 'global' && (
          <>
            <Text style={styles.gap}>···</Text>
            <View style={[styles.row, styles.rowMe, { borderBottomWidth: 0 }]}>
              <Text style={styles.pos}>{me.rank.toLocaleString()}</Text>
              <Avatar src={me.avatar} size="sm" />
              <View style={styles.who}>
                <Text style={styles.name}>You <Text style={{ fontSize: fs.xs }}>{meTier.icon}</Text></Text>
                <Text style={styles.dim}>
                  top {Math.ceil((me.rank / globalBoard.totalAthletes) * 100)}% of {globalBoard.totalAthletes.toLocaleString()} athletes
                </Text>
              </View>
              <Delta d={me.delta} />
              <Text style={styles.pts}>{me.points.toLocaleString()}</Text>
            </View>
          </>
        )}
      </Card>

      {/* Tiers */}
      <Card>
        <View style={styles.tiersHead}>
          <Text style={styles.tiersTitle}>TIERS · STRENGTH SCORE</Text>
          <Pressable onPress={() => setInfoOpen(true)}>
            <Text style={styles.how}>How ranks work ›</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }}>
          {TIERS.map(r => (
            <View key={r.id} style={[styles.tier, { borderColor: r.color + '59', backgroundColor: r.color + '14' }]}>
              <Text style={{ fontSize: 18 }}>{r.icon}</Text>
              <Text style={{ fontSize: fs.xs, fontWeight: fw.semibold, color: r.color }}>
                {r.label}{needsReview(r.id) ? ' 🎥' : ''}
              </Text>
              <Text style={{ fontSize: 10, color: colors.textDim }}>{r.min}+</Text>
            </View>
          ))}
        </ScrollView>
      </Card>

      <Text style={styles.formula}>{POINTS_FORMULA}</Text>
      <Text style={styles.formula}>
        Tier = best push + pull + legs 1RM, scaled to bodyweight &amp; sex (DOTS) · 🎥 from Diamond up, lifts are community-reviewed
      </Text>

      <RankInfo open={infoOpen} onClose={() => setInfoOpen(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: space[4] },
  tabs: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  dim: { fontSize: fs.xs, color: colors.textDim },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: space[6] },
  spot: { alignItems: 'center', gap: space[1], minWidth: 0 },
  podiumName: { fontSize: fs.sm, maxWidth: 112 },
  podiumPts: { color: colors.text, fontSize: fs.sm, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4],
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowMe: { backgroundColor: colors.accentSoft, borderLeftWidth: 3, borderLeftColor: colors.accent },
  pos: { minWidth: 32, textAlign: 'center', fontWeight: fw.bold, color: colors.textDim, fontSize: fs.sm, fontVariant: ['tabular-nums'] },
  who: { flex: 1, minWidth: 0, gap: 2 },
  name: { color: colors.text, fontWeight: fw.semibold, fontSize: fs.sm },
  delta: { fontSize: fs.xs, fontVariant: ['tabular-nums'] },
  pts: { color: colors.text, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  gap: { textAlign: 'center', color: colors.textDim, padding: space[1], letterSpacing: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  tiersHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  tiersTitle: { fontSize: fs.xs, fontWeight: fw.semibold, letterSpacing: 0.8, color: colors.textDim },
  how: { fontSize: fs.xs, fontWeight: fw.semibold, color: colors.accent },
  tier: { alignItems: 'center', gap: 2, paddingVertical: space[2], paddingHorizontal: space[3], borderWidth: 1, borderRadius: radius.md },
  formula: { fontSize: fs.xs, color: colors.textDim, textAlign: 'center' },
})
