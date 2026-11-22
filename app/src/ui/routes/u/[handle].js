import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { Avatar, Card, EmptyState, Screen, Stat } from '@/ui/components/ui'
import Post from '@/ui/components/Post'
import SportIcon from '@/ui/components/SportIcon'
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

  return (
    <View style={{ flex: 1 }}>
      <Screen style={{ gap: space[5] }}>
        <View style={st.head}>
          <Pressable style={st.back} onPress={() => router.back()} accessibilityLabel="Back">
            <Text style={{ color: colors.text, fontSize: fs.md }}>←</Text>
          </Pressable>
          <Text style={st.eyebrow}>Athlete</Text>
        </View>

        {!person ? (
          <EmptyState icon="🔍" title="No such athlete" description={`Nobody here goes by @${handle}.`} />
        ) : (
          <Profile person={person} tier={tier} picking={picking} setPicking={setPicking} copyTo={copyTo} />
        )}
      </Screen>

      {!!toast && (
        <View style={st.toast}>
          <Text style={st.toastText}>
            {toast} · <Link href="/templates" style={[st.toastText, { textDecorationLine: 'underline' }]}>View plan</Link>
          </Text>
        </View>
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
        <View style={st.heroTop}>
          <Avatar src={person.avatar} size="xl" ring="accent" />
          {isMe(person) && <Link href="/profile" style={st.self}>That's you ›</Link>}
        </View>
        <View style={{ gap: space[2] }}>
          <Text style={st.name}>{person.name}</Text>
          <Text style={st.handle}>@{person.username}{person.sport ? ` · ${person.sport}` : ''}</Text>
          {!!person.bio && <Text style={st.bio}>{person.bio}</Text>}
        </View>

        <View style={[st.rank, { backgroundColor: tier.color + '1f', borderColor: tier.color + '59' }]}>
          <Text style={{ fontSize: 32 }}>{tier.icon}</Text>
          <View style={{ flex: 1, gap: space[1] }}>
            <Text style={[st.rankLabel, { color: tier.color }]}>{tier.label} {tier.division}</Text>
            <Text style={st.dim}>{person.dots ? `${tier.dots} DOTS` : 'No ranked lifts yet'}</Text>
          </View>
          <Link href="/search?tab=ranking" style={[st.rankLink, { color: tier.color }]}>Leaderboard ›</Link>
        </View>

        {awards.length > 0 && (
          <View style={st.awards}>
            {awards.map(a => <Text key={a.id} style={st.awardChip}>{a.icon} {a.earnedLabel}</Text>)}
          </View>
        )}

        <View style={st.stats}>
          <Stat icon="✅" value={person.workouts ?? person.stats?.workouts ?? '—'} label="workouts" />
          <Stat icon="🔥" value={person.streak ?? person.stats?.streakDays ?? '—'} label="day streak" />
          <Stat icon="🏅" value={person.points?.toLocaleString() ?? '—'} label="points" />
        </View>
      </Card>

      {/* Their routine, copyable into my week */}
      <View style={{ gap: space[3] }}>
        <Text style={st.blockH}>Workouts</Text>
        {workouts.map((w, i) => (
          <Card key={w.id + i} padding="md">
            <View style={st.woTop}>
              <SportIcon sport={w.sport} size="md" />
              <View style={{ flex: 1 }}>
                <Text style={st.woTitle}>{w.title}</Text>
                <Text style={st.dim}>{w.exercises.length} exercises · {w.durationMin} min</Text>
              </View>
              <Pressable style={st.copy} onPress={() => setPicking(picking === i ? null : i)}>
                <Text style={st.copyText}>{picking === i ? 'Cancel' : 'Copy workout'}</Text>
              </Pressable>
            </View>

            <View>
              {w.exercises.map((ex, j) => (
                <View key={ex.id} style={[st.ex, j === w.exercises.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={st.exName} numberOfLines={1}>{ex.name}</Text>
                  <Text style={st.exSets}>{ex.sets} × {ex.reps}</Text>
                </View>
              ))}
            </View>

            {picking === i && (
              <View style={st.days}>
                <Text style={st.daysLbl}>Copy to</Text>
                {WEEKDAYS.map(d => (
                  <Pressable key={d.id} style={st.dayBtn} onPress={() => copyTo(w, d.id)}>
                    <Text style={st.dayText}>{d.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Card>
        ))}
      </View>

      {/* Their posts */}
      <View style={{ gap: space[3] }}>
        <Text style={st.blockH}>Posts</Text>
        {posts.map(p => <Post key={p.id} post={p} />)}
        {!posts.length && (
          <EmptyState icon="📭" title="Nothing posted yet" description={`${person.name} hasn't shared a session here.`} />
        )}
      </View>
    </>
  )
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: fs.xs, textTransform: 'uppercase', letterSpacing: 0.7, color: colors.textDim, fontWeight: fw.medium },
  dim: { fontSize: fs.xs, color: colors.textDim },

  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  self: { fontSize: fs.sm, color: colors.accent, fontWeight: fw.semibold },
  name: { fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5, color: colors.text },
  handle: { color: colors.textDim, fontSize: fs.sm },
  bio: { color: colors.textMuted, fontSize: fs.md },
  stats: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: space[4], borderTopWidth: 1, borderTopColor: colors.border },

  rank: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderWidth: 1, borderRadius: radius.md },
  rankLabel: { fontWeight: fw.bold, fontSize: fs.md },
  rankLink: { fontSize: fs.xs, fontWeight: fw.semibold },

  awards: { flexDirection: 'row', flexWrap: 'wrap', gap: space[1] },
  awardChip: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, overflow: 'hidden', backgroundColor: colors.accentSoft, color: colors.accent, fontSize: 11, fontWeight: fw.semibold },

  blockH: { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },

  woTop: { flexDirection: 'row', alignItems: 'center', gap: space[3], flexWrap: 'wrap' },
  woTitle: { fontWeight: fw.semibold, color: colors.text, fontSize: fs.md },
  copy: { paddingVertical: space[2], paddingHorizontal: space[4], backgroundColor: colors.accent, borderRadius: radius.pill },
  copyText: { color: colors.accentInk, fontSize: fs.sm, fontWeight: fw.semibold },
  ex: { flexDirection: 'row', justifyContent: 'space-between', gap: space[3], paddingVertical: space[1], borderBottomWidth: 1, borderBottomColor: colors.border },
  exName: { flex: 1, color: colors.text, fontSize: fs.sm },
  exSets: { color: colors.textDim, fontSize: fs.sm, fontVariant: ['tabular-nums'] },

  days: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space[2], paddingTop: space[3], borderTopWidth: 1, borderTopColor: colors.border },
  daysLbl: { fontSize: fs.xs, textTransform: 'uppercase', letterSpacing: 0.7, color: colors.textDim },
  dayBtn: { paddingVertical: 3, paddingHorizontal: space[3], borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  dayText: { color: colors.textMuted, fontSize: fs.xs, fontWeight: fw.semibold },

  toast: { position: 'absolute', bottom: space[6], alignSelf: 'center', backgroundColor: colors.text, paddingVertical: space[3], paddingHorizontal: space[5], borderRadius: radius.pill },
  toastText: { color: colors.bg, fontWeight: fw.semibold, fontSize: fs.sm },
})
