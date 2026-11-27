import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Link, router } from 'expo-router'
import {
  AchievementTile, AppHeader, Avatar, Button, Card, Chip, IconButton, Input, Post, Row, Screen, Stat, Tabs, Text, Toast, TrainingSummary,
} from '@/ui/components'
import { currentUser, SEXES, bmi, bmiLabel, ageFrom } from '@/api/mock/data/user'
import { TIERS, rankFromSets } from '@/domain/ranking'
import { SPORT_TYPES, journalEntries } from '@/api/mock/data/workouts'
import { userPosts } from '@/api/mock/data/social'
import { achievementStats, achievementsFrom } from '@/domain/achievements'
import { reviewedCount } from '@/api/mock/reviewsStore'
import { colors, fs, radius, space } from '@/ui/theme'

const EDITABLE = ['name', 'username', 'avatar', 'bio', 'location', 'birthDate', 'sex', 'heightCm', 'weightKg', 'primarySport']

export default function ProfileScreen() {
  // ponytail: edits mutate the shared mock object so they stick while navigating; `user` is a
  // copy in state only to trigger a re-render after saving.
  const [user, setUser] = useState(() => ({ ...currentUser }))
  const [tab, setTab] = useState('posts')
  const [achFilter, setAchFilter] = useState('all')
  const [form, setForm] = useState(null) // null = edit sheet closed
  const [toast, setToast] = useState('')

  // A lighter athlete scores higher for the same lifts, so this reads the live weight.
  const rank = rankFromSets(user.bestSets, { bodyweightKg: user.weightKg, sex: user.sex })
  const achievements = achievementsFrom(achievementStats({
    user, entries: journalEntries, reviewed: reviewedCount(), dots: rank.dots,
  }))
  // A ladder can be cleared many times over, so progress counts rungs, not achievements.
  const rungs = achievements.reduce((a, x) => ({ done: a.done + x.level, total: a.total + x.levels }), { done: 0, total: 0 })
  const nextUp = achievements.filter(a => !a.done).sort((x, y) => y.progress - x.progress)[0]
  const highlights = achievements.filter(a => a.earned).sort((a, b) => b.level - a.level || b.progress - a.progress).slice(0, 3)
  const achShown = achievements.filter(a => achFilter === 'earned' ? a.earned : achFilter === 'locked' ? !a.done : true)
  const groups = [...new Set(achShown.map(a => a.group))]

  const age = ageFrom(user.birthDate)
  const bmiValue = bmi(user.weightKg, user.heightCm)
  const sportLabel = SPORT_TYPES.find(sp => sp.id === user.primarySport)?.label || '—'

  function openEdit() {
    const f = {}
    for (const k of EDITABLE) f[k] = user[k] == null ? '' : String(user[k])
    f.weeklyGoal = String(user.stats.weeklyGoal)
    setForm(f)
  }
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }))
  const canSave = !!(form?.name?.trim() && form?.username?.trim())

  function saveProfile() {
    if (!canSave) return
    for (const k of EDITABLE) {
      const v = form[k].trim()
      currentUser[k] = k === 'heightCm' || k === 'weightKg' ? Number(v) || currentUser[k] : v
    }
    currentUser.stats.weeklyGoal = Number(form.weeklyGoal) || currentUser.stats.weeklyGoal
    setUser({ ...currentUser })
    setForm(null)
    setToast('Profile updated')
    setTimeout(() => setToast(''), 2000)
  }

  const formBmi = form && bmi(Number(form.weightKg), Number(form.heightCm))
  const tabs = [
    { id: 'posts', label: `Posts · ${userPosts.length}` },
    { id: 'stats', label: 'Stats' },
    { id: 'awards', label: `Awards · ${rungs.done}` },
  ]
  const body = [
    [user.heightCm || '—', 'cm', 'Height'],
    [user.weightKg || '—', 'kg', 'Weight'],
    [bmiValue ? bmiValue.toFixed(1) : '—', '', `BMI · ${bmiLabel(bmiValue)}`],
    [age ?? '—', '', 'Years old'],
    [sportLabel, '', 'Main sport', true],
    [user.stats.weeklyDone, `/${user.stats.weeklyGoal}`, 'Weekly goal'],
  ]

  return (
    <View style={{ flex: 1 }}>
      <Screen style={{ gap: space[5] }}>
        <AppHeader />

        <Card padding="lg" style={{ gap: space[5] }}>
          <Row justify="space-between" align="flex-start">
            <Avatar src={user.avatar} size="xl" ring="accent" />
            <Row wrap>
              <Button variant="secondary" size="sm" onPress={openEdit}>Edit profile</Button>
              <IconButton label="Settings" variant="filled" onPress={() => router.push('/settings')}>
                <Text>⚙️</Text>
              </IconButton>
            </Row>
          </Row>
          <View style={{ gap: space[2] }}>
            <Text variant="h1">{user.name}</Text>
            <Text variant="muted" color={colors.textDim}>@{user.username} · 📍 {user.location}</Text>
            <Text color={colors.textMuted}>{user.bio}</Text>
          </View>

          {/* Rank */}
          <Row gap={3} style={[st.rank, { backgroundColor: rank.color + '1f', borderColor: rank.color + '59' }]}>
            <Text style={{ fontSize: 32 }}>{rank.icon}</Text>
            <View style={{ flex: 1, gap: space[1] }}>
              <Text weight="bold" color={rank.color}>{rank.label} {rank.division}</Text>
              <Text variant="dim">
                {rank.placement
                  ? `${rank.placement.done}/${rank.placement.required} sessions to get placed`
                  : `${rank.dots} DOTS · ${rank.total}kg total${rank.next ? ` · ${rank.toNext} to ${rank.next.label}` : ''}`}
              </Text>
              {!rank.placement && (
                <View style={st.lp}><View style={{ height: '100%', width: `${rank.lp}%`, backgroundColor: rank.color }} /></View>
              )}
            </View>
            <View style={st.pips}>
              {TIERS.map(r => {
                const on = r.id === rank.id
                return <View key={r.id} style={[st.pip, { backgroundColor: on ? rank.color : colors.surface2, borderColor: on ? rank.color : colors.border }]} />
              })}
            </View>
            <Link href="/search?tab=ranking" style={[st.rankLink, { color: rank.color }]}>Leaderboard ›</Link>
          </Row>

          {/* Achievement highlights, so awards read without switching tabs */}
          <Pressable style={st.highlights} onPress={() => setTab('awards')} accessibilityRole="button">
            <Row align="baseline" justify="space-between">
              <Text variant="overline">Achievements</Text>
              <Text variant="dim" color={colors.accent}>{rungs.done} of {rungs.total} tiers ›</Text>
            </Row>
            <Row gap={1} wrap>
              {highlights.map(a => (
                <Text key={a.id} variant="dim" weight="semibold" color={colors.accent} style={st.hlChip}>{a.icon} {a.earnedLabel}</Text>
              ))}
              {!!nextUp && (
                <Text variant="dim" weight="semibold" style={[st.hlChip, { backgroundColor: colors.surface }]}>
                  🔜 {nextUp.label} · {Math.round(nextUp.progress * 100)}%
                </Text>
              )}
            </Row>
          </Pressable>

          <Row gap={3} justify="space-around" style={st.stats}>
            <Stat icon="✅" value={user.stats.workouts} label="workouts" />
            <Stat icon="👥" value={user.stats.followers} label="followers" />
            <Stat icon="↗️" value={user.stats.following} label="following" />
            <Stat icon="🔥" value={user.stats.streakDays} label="day streak" />
          </Row>
        </Card>

        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'posts' && (
          <View style={{ gap: space[4] }}>
            {userPosts.map(p => <Post key={p.id} post={p} />)}
          </View>
        )}

        {tab === 'stats' && (
          <>
            <Card padding="lg"><TrainingSummary /></Card>
            <View style={{ gap: space[3] }}>
              <Text variant="overline" color={colors.textMuted} style={{ fontSize: fs.sm }}>Body & training</Text>
              <Card padding="md" style={st.bodyGrid}>
                {body.map(([v, u, l, isText]) => (
                  <View key={l} style={st.bodyItem}>
                    <Text variant={isText ? 'body' : 'h2'} weight="bold" style={st.nums}>
                      {v}{!!u && <Text variant="muted" color={colors.textDim}> {u}</Text>}
                    </Text>
                    <Text variant="overline" weight="regular" numberOfLines={1}>{l}</Text>
                  </View>
                ))}
              </Card>
            </View>
          </>
        )}

        {tab === 'awards' && (
          <View style={{ gap: space[4] }}>
            <Row gap={3} justify="space-between">
              <Text variant="overline" color={colors.textMuted} style={{ fontSize: fs.sm }}>Achievements</Text>
              <Text variant="dim" style={st.nums}>{rungs.done} of {rungs.total} tiers cleared</Text>
            </Row>

            {!!nextUp && (
              <Card padding="md" style={st.next}>
                <Text style={{ fontSize: 24 }}>{nextUp.icon}</Text>
                <View style={{ flex: 1, gap: space[2] }}>
                  <Text variant="small" weight="semibold">Next up · {nextUp.label}</Text>
                  <View style={st.lp}><View style={{ height: '100%', width: `${nextUp.progress * 100}%`, backgroundColor: colors.accent }} /></View>
                </View>
                <Text variant="dim" style={st.nums}>{nextUp.valueLabel}</Text>
              </Card>
            )}

            <Row wrap>
              <Chip size="sm" active={achFilter === 'all'} onPress={() => setAchFilter('all')}>All</Chip>
              <Chip size="sm" active={achFilter === 'earned'} onPress={() => setAchFilter('earned')}>Earned</Chip>
              <Chip size="sm" active={achFilter === 'locked'} onPress={() => setAchFilter('locked')}>In progress</Chip>
            </Row>

            {groups.map(g => (
              <View key={g} style={{ gap: space[2] }}>
                <Text variant="overline">{g}</Text>
                <Row wrap align="stretch">
                  {achShown.filter(a => a.group === g).map(a => <AchievementTile key={a.id} a={a} style={st.tile} />)}
                </Row>
              </View>
            ))}
          </View>
        )}
      </Screen>

      {/* Edit profile sheet */}
      <Modal visible={!!form} transparent animationType="slide" onRequestClose={() => setForm(null)}>
        <Pressable style={st.backdrop} onPress={() => setForm(null)}>
          {/* inner Pressable swallows taps so only the backdrop closes the sheet */}
          <Pressable style={st.panel} onPress={() => {}}>
            {!!form && (
              <ScrollView contentContainerStyle={{ gap: space[3] }} keyboardShouldPersistTaps="handled">
                <View style={st.handleBar} />
                <Row gap={3} justify="space-between" align="flex-start">
                  <View>
                    <Text variant="overline" weight="medium">Profile</Text>
                    <Text variant="h2" style={{ marginTop: 2 }}>Edit profile</Text>
                  </View>
                  <IconButton icon="close" label="Close" size={32} variant="filled" onPress={() => setForm(null)} />
                </Row>

                <Row wrap>
                  <Avatar src={form.avatar} size="lg" ring="accent" />
                  <Field label="Avatar URL" value={form.avatar} onChangeText={set('avatar')} placeholder="https://…" autoCapitalize="none" />
                </Row>

                <Row gap={3} wrap align="flex-start">
                  <Field label="Name" value={form.name} onChangeText={set('name')} />
                  <Field label="Username" value={form.username} onChangeText={set('username')} autoCapitalize="none" />
                </Row>

                <Field label="Bio" value={form.bio} onChangeText={set('bio')} multiline placeholder="What are you training for?" />

                <Row gap={3} wrap align="flex-start">
                  <Field label="Location" value={form.location} onChangeText={set('location')} />
                  {/* ponytail: plain YYYY-MM-DD text, no date picker (would need a dep) */}
                  <Field label="Date of birth" value={form.birthDate} onChangeText={set('birthDate')} placeholder="YYYY-MM-DD" />
                </Row>

                <Row gap={3} wrap align="flex-start">
                  <Field label="Height (cm)" value={form.heightCm} onChangeText={set('heightCm')} keyboardType="numeric" />
                  <Field label="Weight (kg)" value={form.weightKg} onChangeText={set('weightKg')} keyboardType="decimal-pad" />
                  <Field label="Sessions / week" value={form.weeklyGoal} onChangeText={set('weeklyGoal')} keyboardType="numeric" />
                </Row>

                <View style={st.field}>
                  <Text variant="label">Main sport</Text>
                  <Row wrap>
                    {SPORT_TYPES.map(sp => (
                      <Chip key={sp.id} size="sm" active={form.primarySport === sp.id} onPress={() => set('primarySport')(sp.id)}>
                        {sp.emoji} {sp.label}
                      </Chip>
                    ))}
                  </Row>
                </View>

                <View style={st.field}>
                  <Text variant="label">Sex</Text>
                  <Row wrap>
                    {SEXES.map(sx => (
                      <Chip key={sx.id} size="sm" active={form.sex === sx.id} onPress={() => set('sex')(sx.id)}>{sx.label}</Chip>
                    ))}
                  </Row>
                </View>

                <Text variant="muted" style={st.hint}>BMI preview: {formBmi ? formBmi.toFixed(1) : '—'} · {bmiLabel(formBmi)}</Text>

                <Row style={{ marginTop: space[2] }}>
                  <Button variant="secondary" onPress={() => setForm(null)} style={{ flex: 1 }}>Cancel</Button>
                  <Button disabled={!canSave} onPress={saveProfile} style={{ flex: 1 }}>Save changes</Button>
                </Row>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Toast message={toast} />
    </View>
  )
}

// Input that shares a wrapping row with its siblings.
function Field(props) {
  return (
    <View style={st.field}>
      <Input {...props} style={props.multiline && { minHeight: 60, textAlignVertical: 'top' }} />
    </View>
  )
}

const st = StyleSheet.create({
  nums: { fontVariant: ['tabular-nums'] },
  stats: { paddingTop: space[4], borderTopWidth: 1, borderTopColor: colors.border },

  rank: { paddingVertical: space[3], paddingHorizontal: space[4], borderWidth: 1, borderRadius: radius.md },
  lp: { height: 4, borderRadius: 999, backgroundColor: colors.surface2, overflow: 'hidden' },
  // ponytail: tier pips hidden below ~400px would need useWindowDimensions; they just wrap instead
  pips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, maxWidth: 56 },
  pip: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 },
  rankLink: { fontSize: fs.xs, fontWeight: '600' },

  highlights: { gap: space[2], padding: space[3], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  hlChip: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, overflow: 'hidden', backgroundColor: colors.accentSoft, fontSize: 11 },

  bodyGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[4], columnGap: 0 },
  bodyItem: { width: '33.33%', gap: 2, paddingRight: space[2] },

  tile: { flexBasis: 100, flexGrow: 1, maxWidth: '33%' },
  next: { flexDirection: 'row', alignItems: 'center', gap: space[3] },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' },
  panel: {
    width: '100%', maxWidth: 576, maxHeight: '88%', backgroundColor: colors.bgElevated,
    borderTopWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    paddingTop: space[4], paddingHorizontal: space[5], paddingBottom: space[6],
  },
  handleBar: { alignSelf: 'center', width: 40, height: 4, borderRadius: radius.pill, backgroundColor: colors.borderStrong, marginBottom: space[2] },
  field: { gap: space[1], flex: 1, minWidth: 112 },
  hint: { backgroundColor: colors.surface, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md, overflow: 'hidden', fontVariant: ['tabular-nums'] },
})
