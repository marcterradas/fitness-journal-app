import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router'
import { Avatar, Badge, Button, Card, EmptyState, IconButton, Post, Row, Screen, SportIcon, Stat, Text, Toast } from '@/ui/components'
import { personOf, isMe } from '@/api/mock/data/directory'
import { tierFromDots, UNRANKED } from '@/domain/ranking'
import { topAchievements } from '@/domain/achievements'
import { feedPosts } from '@/api/mock/data/social'
import { workoutsOf } from '@/api/mock/data/publicWorkouts'
import { WEEKDAYS, saveToDay } from '@/api/mock/data/templates'
import { colors, fs, fw, radius, space } from '@/ui/theme'

export default function UserScreen() {
  const handle = String(useLocalSearchParams().handle || '').replace(/^@/, '')
  const person = personOf(handle)
  const tier = person?.dots ? tierFromDots(person.dots) : UNRANKED

  const [picking, setPicking] = useState(null) // workout index waiting for a weekday
  const [toast, setToast] = useState('')

  function copyTo(workout, dayId) {
    saveToDay(dayId, workout)
    setPicking(null)
    setToast(`Copied to ${WEEKDAYS.find(d => d.id === dayId).long}`)
    setTimeout(() => setToast(''), 2400)
  }

  // UserLink always points to /u/<handle>; my own handle belongs on the Profile tab.
  if (isMe(person)) return <Redirect href="/profile" />

  return (
    <View style={{ flex: 1 }}>
      <Screen style={{ gap: space[5] }}>
        <Row gap={3}>
          <IconButton icon="back" label="Back" variant="filled" onPress={() => router.back()} />
          <Text variant="overline">Athlete</Text>
        </Row>

        {!person ? (
          <EmptyState icon="🔍" title="No such athlete" description={`Nobody here goes by @${handle}.`} />
        ) : (
          <Profile person={person} tier={tier} picking={picking} setPicking={setPicking} copyTo={copyTo} />
        )}
      </Screen>

      {!!toast && (
        <Toast>
          {toast} · <Link href="/templates" style={{ color: colors.bg, textDecorationLine: 'underline' }}>View plan</Link>
        </Toast>
      )}
    </View>
  )
}

function Profile({ person, tier, picking, setPicking, copyTo }) {
  const awards = topAchievements(person)
  const posts = feedPosts.filter(p => p.user.username === person.username)
  const workouts = workoutsOf(person.username)

  return (
    <>
      <Card padding="lg" style={{ gap: space[5] }}>
        <Avatar src={person.avatar} size="xl" ring="accent" />
        <View style={{ gap: space[2] }}>
          <Text variant="h1">{person.name}</Text>
          <Text variant="muted" color={colors.textDim}>@{person.username}{person.sport ? ` · ${person.sport}` : ''}</Text>
          {!!person.bio && <Text color={colors.textMuted}>{person.bio}</Text>}
        </View>

        <Row gap={3} style={[st.rank, { backgroundColor: tier.color + '1f', borderColor: tier.color + '59' }]}>
          <Text style={{ fontSize: 32 }}>{tier.icon}</Text>
          <View style={{ flex: 1, gap: space[1] }}>
            <Text weight="bold" color={tier.color}>{tier.label} {tier.division}</Text>
            <Text variant="dim">{person.dots ? `${tier.dots} DOTS` : 'No ranked lifts yet'}</Text>
          </View>
          <Link href="/search?tab=ranking" style={[st.rankLink, { color: tier.color }]}>Leaderboard ›</Link>
        </Row>

        {awards.length > 0 && (
          <Row gap={1} wrap>
            {awards.map(a => <Badge key={a.id} tone="accent" icon={a.icon}>{a.earnedLabel}</Badge>)}
          </Row>
        )}

        <Row justify="space-around" style={st.stats}>
          <Stat icon="✅" value={person.workouts ?? person.stats?.workouts ?? '—'} label="workouts" />
          <Stat icon="🔥" value={person.streak ?? person.stats?.streakDays ?? '—'} label="day streak" />
          <Stat icon="🏅" value={person.points?.toLocaleString() ?? '—'} label="points" />
        </Row>
      </Card>

      {/* Their routine, copyable into my week */}
      <View style={{ gap: space[3] }}>
        <Text variant="overline" color={colors.textMuted}>Workouts</Text>
        {workouts.map((w, i) => (
          <Card key={w.id + i} padding="md">
            <Row gap={3} wrap>
              <SportIcon sport={w.sport} size="md" />
              <View style={{ flex: 1 }}>
                <Text weight="semibold">{w.title}</Text>
                <Text variant="dim">{w.exercises.length} exercises · {w.durationMin} min</Text>
              </View>
              <Button size="sm" onPress={() => setPicking(picking === i ? null : i)}>
                {picking === i ? 'Cancel' : 'Copy workout'}
              </Button>
            </Row>

            <View>
              {w.exercises.map((ex, j) => (
                <Row key={ex.id} gap={3} justify="space-between" style={[st.ex, j === w.exercises.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>{ex.name}</Text>
                  <Text variant="muted" color={colors.textDim} style={st.num}>{ex.sets} × {ex.reps}</Text>
                </Row>
              ))}
            </View>

            {picking === i && (
              <Row wrap style={st.days}>
                <Text variant="overline">Copy to</Text>
                {WEEKDAYS.map(d => (
                  <Pressable key={d.id} style={st.dayBtn} onPress={() => copyTo(w, d.id)} accessibilityRole="button">
                    <Text variant="dim" weight="semibold" color={colors.textMuted}>{d.label}</Text>
                  </Pressable>
                ))}
              </Row>
            )}
          </Card>
        ))}
      </View>

      {/* Their posts */}
      <View style={{ gap: space[3] }}>
        <Text variant="overline" color={colors.textMuted}>Posts</Text>
        {posts.map(p => <Post key={p.id} post={p} />)}
        {!posts.length && (
          <EmptyState icon="📭" title="Nothing posted yet" description={`${person.name} hasn't shared a session here.`} />
        )}
      </View>
    </>
  )
}

const st = StyleSheet.create({
  rank: { paddingVertical: space[3], paddingHorizontal: space[4], borderWidth: 1, borderRadius: radius.md },
  rankLink: { fontSize: fs.xs, fontWeight: fw.semibold },
  stats: { paddingTop: space[4], borderTopWidth: 1, borderTopColor: colors.border },
  ex: { paddingVertical: space[1], borderBottomWidth: 1, borderBottomColor: colors.border },
  num: { fontVariant: ['tabular-nums'] },
  days: { paddingTop: space[3], borderTopWidth: 1, borderTopColor: colors.border },
  dayBtn: { paddingVertical: 3, paddingHorizontal: space[3], borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
})
