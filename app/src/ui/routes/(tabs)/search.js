import { useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { AppHeader, Avatar, Card, Chip, EmptyState, Screen, UserLink } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
import Leaderboard from '@/ui/components/Leaderboard'
import ReviewQueue from '@/ui/components/ReviewQueue'
import ExerciseModal from '@/ui/components/ExerciseModal'
import { friends } from '@/api/mock/data/user'
import { tierFromDots } from '@/domain/ranking'
import { EXERCISE_MEDIA_CREDIT, exercises, workoutPlans } from '@/api/mock/data/exercises'
import { challenges, feedPosts } from '@/api/mock/data/social'
import { friendsBoard, globalBoard } from '@/api/mock/data/leaderboard'
import { pendingReviews } from '@/api/mock/reviewsStore'
import { colors, fs, fw, radius, space } from '@/ui/theme'

// Ranking and the review queue are full panels, not search filters: they take over the view (?tab=).
const PANELS = {
  ranking: { title: 'Ranking', sub: 'Every athlete, ordered by all-time points.' },
  review: { title: 'Review queue', sub: 'Vote on high-tier lifts waiting for the community.' },
}

// ponytail: one row shape for every kind, so the list markup is written once
const SOURCES = [
  {
    id: 'people', label: 'People', icon: '👥', action: 'Follow', done: 'Following',
    items: friends.map(u => ({
      id: u.id, title: u.name, sub: `@${u.username} · ${u.sport}`, avatar: u.avatar, handle: u.username,
      terms: [u.name, u.username, u.sport],
    })),
  },
  {
    id: 'workouts', label: 'Workouts', icon: '💪', action: 'Try', done: 'Saved',
    items: workoutPlans.map(w => ({
      id: w.id, title: w.title, sub: `${w.durationMin} min · ${w.level}`, sport: w.sport,
      terms: [w.title, w.sport, w.level],
    })),
  },
  {
    id: 'exercises', label: 'Exercises', icon: '🏋️', action: 'Add', done: 'Added',
    items: exercises.map(e => ({
      id: e.id, title: e.name, sub: `${e.muscle} · ${e.equipment}`, image: e.image, text: e.steps[0], open: e,
      terms: [e.name, e.muscle, e.equipment, e.bodyPart, ...e.secondary],
    })),
  },
  {
    id: 'challenges', label: 'Challenges', icon: '🎯', action: 'Join', done: 'Joined',
    items: challenges.map(c => ({
      id: c.id, title: c.title, sub: `${c.members.toLocaleString()} members · ${c.daysLeft} days left`, emoji: c.emoji,
      terms: [c.title],
    })),
  },
  {
    id: 'posts', label: 'Posts', icon: '📝',
    items: feedPosts.map(p => ({
      id: p.id, title: p.title, sub: `${p.user.name} · ${p.when}`, avatar: p.user.avatar, text: p.text,
      terms: [p.title, p.text, p.user.name],
    })),
  },
]

const TRENDING = ['#PullUpProgress', '#April30Mobility', '#Sub50_10k', '#PostureFix', '#ZeroSugarApril']
const DISCOVER = [
  { id: 'people', label: 'Athletes to follow', take: 4 },
  { id: 'workouts', label: 'Popular workouts', take: 4 },
  { id: 'exercises', label: 'Exercises to learn', take: 4 },
  { id: 'challenges', label: 'Open challenges', take: 2 },
]
const PREVIEW = 4
const MEDALS = ['🥇', '🥈', '🥉']
const topThree = friendsBoard.slice(0, 3)

export default function ExploreScreen() {
  const { tab } = useLocalSearchParams()
  const panel = PANELS[tab] ? tab : null
  // setParams keeps the URL in sync (web reload / deep link lands on the same panel).
  const openPanel = id => router.setParams({ tab: id || '' })

  const [query, setQuery] = useState('')
  const [kind, setKind] = useState(null) // null = every kind, grouped
  const [saved, setSaved] = useState(() => new Set()) // ponytail: "kind:id" set, no store until a backend
  const [openExercise, setOpenExercise] = useState(null)

  const q = query.trim().toLowerCase().replace(/^#/, '')
  const matches = SOURCES.map(s => ({
    ...s,
    hits: s.items.filter(i => !q || i.terms.some(t => t.toLowerCase().includes(q))),
  }))
  // Empty kinds drop out while searching, except the active one (so you can click back out).
  const chips = matches.filter(m => !q || m.hits.length || m.id === kind)
  const groups = matches.filter(g => g.hits.length && (!kind || kind === g.id))
  const totalHits = groups.reduce((a, g) => a + g.hits.length, 0)
  const isDiscover = !q && !kind

  const sections = isDiscover
    ? DISCOVER.map(d => {
        const g = matches.find(s => s.id === d.id)
        return { group: g, label: d.label, hits: g.hits.slice(0, d.take), more: g.hits.length > d.take }
      })
    : groups.map(g => ({
        group: g, label: g.label, count: g.hits.length,
        hits: kind ? g.hits : g.hits.slice(0, PREVIEW),
        more: !kind && g.hits.length > PREVIEW,
      }))

  const pick = id => setKind(k => (k === id ? null : id))
  const toggle = k => setSaved(prev => {
    const next = new Set(prev)
    next.has(k) ? next.delete(k) : next.add(k)
    return next
  })
  const pending = pendingReviews()

  return (
    <Screen>
      <AppHeader />

      <View style={{ paddingHorizontal: space[1] }}>
        {!!panel && (
          <Pressable onPress={() => openPanel(null)} style={{ marginBottom: space[2] }}>
            <Text style={{ color: colors.accent, fontSize: fs.sm }}>← Explore</Text>
          </Pressable>
        )}
        <Text style={styles.title}>{panel ? PANELS[panel].title : 'Explore'}</Text>
        <Text style={styles.sub}>{panel ? PANELS[panel].sub : 'Athletes, workouts, exercises, challenges and posts.'}</Text>
      </View>

      {panel === 'ranking' && <Leaderboard />}
      {panel === 'review' && <ReviewQueue />}

      {!panel && (
        <>
          <View style={styles.bar}>
            <Text style={{ fontSize: fs.md }}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search people, workouts, exercises…"
              placeholderTextColor={colors.textDim}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!query && (
              <Pressable onPress={() => setQuery('')} style={styles.clear} accessibilityLabel="Clear">
                <Text style={{ color: colors.textMuted, fontSize: fs.md, lineHeight: 18 }}>×</Text>
              </Pressable>
            )}
          </View>

          {chips.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }}>
              {chips.map(c => (
                <Chip key={c.id} active={kind === c.id} onPress={() => pick(c.id)}>
                  {c.icon} {c.label}{q ? `  ${c.hits.length}` : ''}
                </Chip>
              ))}
            </ScrollView>
          )}

          {isDiscover || totalHits ? (
            <>
              {isDiscover ? (
                <>
                  {/* Discover: the two panels and trending tags sit above the curated lists */}
                  <Pressable onPress={() => openPanel('ranking')}>
                    <Card style={{ gap: space[2] }}>
                      <View style={styles.panelHead}>
                        <Text style={styles.panelH}>🏆 Top this month</Text>
                        <Text style={styles.go}>Full ranking →</Text>
                      </View>
                      {topThree.map((u, i) => (
                        <View key={u.id} style={[styles.lead, u.me && { backgroundColor: colors.accentSoft }]}>
                          <Text style={{ fontSize: fs.md }}>{MEDALS[i]}</Text>
                          <Avatar src={u.avatar} size="sm" />
                          <View style={{ flex: 1 }}>
                            <UserLink user={u} style={{ fontWeight: fw.medium }}>{u.me ? 'You' : u.name}</UserLink>
                          </View>
                          <Text style={{ fontSize: fs.sm }}>{tierFromDots(u.dots).icon}</Text>
                          <Text style={styles.dim}>{u.points.toLocaleString()} pts</Text>
                        </View>
                      ))}
                      <Text style={[styles.dim, { textAlign: 'center', marginTop: space[1] }]}>
                        You're <Text style={{ color: colors.text, fontWeight: fw.bold }}>#{globalBoard.me.rank.toLocaleString()}</Text>
                        {' '}of {globalBoard.totalAthletes.toLocaleString()} athletes globally
                      </Text>
                    </Card>
                  </Pressable>

                  <Pressable onPress={() => openPanel('review')}>
                    <Card style={{ gap: space[2] }}>
                      <View style={styles.panelHead}>
                        <Text style={styles.panelH}>🎥 Waiting on the community</Text>
                        <Text style={styles.go}>Review queue →</Text>
                      </View>
                      <Text style={styles.sub}>
                        <Text style={{ color: colors.text, fontWeight: fw.bold }}>{pending.length}</Text>
                        {' '}high-tier lift{pending.length === 1 ? '' : 's'} need verifying. Every review counts toward your reviewer badge.
                      </Text>
                      <View style={styles.faces}>
                        {pending.slice(0, 4).map((s, i) => (
                          <View key={s.id} style={i > 0 && { marginLeft: -8 }}>
                            <Avatar src={s.athlete.avatar} size="sm" />
                          </View>
                        ))}
                        {pending.length > 4 && <Text style={[styles.dim, { marginLeft: space[2] }]}>+{pending.length - 4}</Text>}
                      </View>
                    </Card>
                  </Pressable>

                  <View style={styles.block}>
                    <Text style={styles.blockH}>TRENDING</Text>
                    <View style={styles.wrap}>
                      {TRENDING.map(t => <Chip key={t} size="sm" onPress={() => setQuery(t)}>{t}</Chip>)}
                    </View>
                  </View>
                </>
              ) : (
                <Text style={styles.sub}>
                  {totalHits} result{totalHits === 1 ? '' : 's'}{q ? ` for “${query}”` : ''}
                </Text>
              )}

              {sections.map(sec => (
                <View key={sec.group.id} style={styles.block}>
                  <View style={styles.blockHead}>
                    <Text style={styles.blockH}>
                      {sec.label.toUpperCase()}{sec.count ? `  ${sec.count}` : ''}
                    </Text>
                    {sec.more && (
                      <Pressable onPress={() => pick(sec.group.id)}><Text style={styles.go}>See all →</Text></Pressable>
                    )}
                  </View>
                  {sec.group.id === 'exercises' && <Text style={styles.credit}>{EXERCISE_MEDIA_CREDIT}</Text>}
                  {sec.hits.map(i => {
                    const k = `${sec.group.id}:${i.id}`
                    const done = saved.has(k)
                    const onPress = i.open ? () => setOpenExercise(i.open) : i.handle ? () => router.push(`/u/${i.handle}`) : undefined
                    return (
                      <Pressable key={i.id} onPress={onPress} disabled={!onPress}>
                        <Card style={styles.row}>
                          {i.image ? <Image source={i.image} style={styles.thumb} />
                            : i.avatar ? <Avatar src={i.avatar} size="md" />
                            : i.sport ? <SportIcon sport={i.sport} size="md" />
                            : <View style={styles.emoji}><Text style={{ fontSize: 24 }}>{i.emoji}</Text></View>}
                          <View style={styles.rowMain}>
                            <Text style={styles.rowTitle}>{i.title}</Text>
                            <Text style={styles.dim}>{i.sub}</Text>
                            {!!i.text && <Text style={[styles.sub, { marginTop: space[1] }]} numberOfLines={2}>{i.text}</Text>}
                          </View>
                          {!!sec.group.action && (
                            <Pressable onPress={() => toggle(k)} style={[styles.btn, done && styles.btnDone]}>
                              <Text style={[styles.btnText, done && { color: colors.textMuted }]}>
                                {done ? sec.group.done : sec.group.action}
                              </Text>
                            </Pressable>
                          )}
                        </Card>
                      </Pressable>
                    )
                  })}
                </View>
              ))}
            </>
          ) : (
            <EmptyState icon="🔎" title="Nothing found" description={query ? `No matches for "${query}".` : 'Try a different filter.'} />
          )}

          <ExerciseModal exercise={openExercise} onClose={() => setOpenExercise(null)} />
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5 },
  sub: { color: colors.textMuted, fontSize: fs.sm, marginTop: space[1] },
  dim: { color: colors.textDim, fontSize: fs.xs },
  bar: {
    flexDirection: 'row', alignItems: 'center', gap: space[2], backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: space[3],
  },
  input: { flex: 1, paddingVertical: space[3], color: colors.text, fontSize: fs.md },
  clear: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  panelHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[3] },
  panelH: { color: colors.text, fontSize: fs.sm, fontWeight: fw.semibold, flexShrink: 1 },
  go: { color: colors.accent, fontSize: fs.xs, fontWeight: fw.medium },
  lead: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[2], borderBottomWidth: 1, borderBottomColor: colors.border },
  faces: { flexDirection: 'row', alignItems: 'center' },
  block: { gap: space[2] },
  blockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] },
  blockH: { color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.semibold, letterSpacing: 0.8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  credit: { color: colors.textDim, fontSize: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  thumb: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surface2 },
  emoji: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  rowMain: { flex: 1, minWidth: 0, gap: space[1] },
  rowTitle: { color: colors.text, fontWeight: fw.semibold },
  btn: { paddingVertical: space[2], paddingHorizontal: space[4], backgroundColor: colors.accent, borderRadius: radius.pill },
  btnDone: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  btnText: { color: colors.accentInk, fontSize: fs.sm, fontWeight: fw.semibold },
})
