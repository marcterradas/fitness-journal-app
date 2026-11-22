import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Link, router } from 'expo-router'
import { AppHeader, Avatar, Card, Chip, Screen, Stat } from '@/ui/components/ui'
import Post from '@/ui/components/Post'
import TrainingSummary from '@/ui/components/TrainingSummary'
import AchievementTile from '@/ui/components/AchievementTile'
import { currentUser, SEXES, bmi, bmiLabel, ageFrom } from '@/api/mock/data/user'
import { TIERS, rankFromSets } from '@/domain/ranking'
import { SPORT_TYPES, journalEntries } from '@/api/mock/data/workouts'
import { userPosts } from '@/api/mock/data/social'
import { achievementStats, achievementsFrom } from '@/domain/achievements'
import { reviewedCount } from '@/api/mock/reviewsStore'
import { colors, fs, fw, radius, space } from '@/ui/theme'

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
          <View style={st.heroTop}>
            <Avatar src={user.avatar} size="xl" ring="accent" />
            <View style={st.row}>
              <Pressable style={st.editBtn} onPress={openEdit}><Text style={st.editText}>Edit profile</Text></Pressable>
              <Pressable style={st.gear} onPress={() => router.push('/settings')} accessibilityLabel="Settings">
                <Text>⚙️</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ gap: space[2] }}>
            <Text style={st.name}>{user.name}</Text>
            <Text style={st.handle}>@{user.username} · 📍 {user.location}</Text>
            <Text style={st.bio}>{user.bio}</Text>
          </View>

          {/* Rank */}
          <View style={[st.rank, { backgroundColor: rank.color + '1f', borderColor: rank.color + '59' }]}>
            <Text style={st.rankIcon}>{rank.icon}</Text>
            <View style={st.rankInfo}>
              <Text style={[st.rankLabel, { color: rank.color }]}>{rank.label} {rank.division}</Text>
              <Text style={st.rankSub}>
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
          </View>

          {/* Achievement highlights, so awards read without switching tabs */}
          <Pressable style={st.highlights} onPress={() => setTab('awards')}>
            <View style={st.hlHead}>
              <Text style={st.hlTitle}>Achievements</Text>
              <Text style={st.hlCount}>{rungs.done} of {rungs.total} tiers ›</Text>
            </View>
            <View style={st.hlRow}>
              {highlights.map(a => (
                <Text key={a.id} style={st.hlChip}>{a.icon} {a.earnedLabel}</Text>
              ))}
              {!!nextUp && (
                <Text style={[st.hlChip, st.hlNext]}>🔜 {nextUp.label} · {Math.round(nextUp.progress * 100)}%</Text>
              )}
            </View>
          </Pressable>

          <View style={st.stats}>
            <Stat icon="✅" value={user.stats.workouts} label="workouts" />
            <Stat icon="👥" value={user.stats.followers} label="followers" />
            <Stat icon="↗️" value={user.stats.following} label="following" />
            <Stat icon="🔥" value={user.stats.streakDays} label="day streak" />
          </View>
        </Card>

        {/* Tabs */}
        <View style={st.tabs} accessibilityRole="tablist">
          {tabs.map(t => (
            <Pressable
              key={t.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.id }}
              style={[st.tab, tab === t.id && st.tabActive]}
              onPress={() => setTab(t.id)}
            >
              <Text style={[st.tabText, tab === t.id && { color: colors.accentInk }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'posts' && (
          <View style={{ gap: space[4] }}>
            {userPosts.map(p => <Post key={p.id} post={p} />)}
          </View>
        )}

        {tab === 'stats' && (
          <>
            <Card padding="lg"><TrainingSummary /></Card>
            <View>
              <Text style={st.sectionH}>Body & training</Text>
              <Card padding="md" style={st.bodyGrid}>
                {body.map(([v, u, l, isText]) => (
                  <View key={l} style={st.bodyItem}>
                    <Text style={[st.bodyV, isText && { fontSize: fs.md }]}>
                      {v}{!!u && <Text style={st.bodyU}> {u}</Text>}
                    </Text>
                    <Text style={st.bodyL} numberOfLines={1}>{l}</Text>
                  </View>
                ))}
              </Card>
            </View>
          </>
        )}

        {tab === 'awards' && (
          <View style={{ gap: space[4] }}>
            <View style={st.achHead}>
              <Text style={[st.sectionH, { marginBottom: 0 }]}>Achievements</Text>
              <Text style={st.dim}>{rungs.done} of {rungs.total} tiers cleared</Text>
            </View>

            {!!nextUp && (
              <Card padding="md" style={st.next}>
                <Text style={{ fontSize: 24 }}>{nextUp.icon}</Text>
                <View style={{ flex: 1, gap: space[2] }}>
                  <Text style={st.nextLabel}>Next up · {nextUp.label}</Text>
                  <View style={st.lp}><View style={{ height: '100%', width: `${nextUp.progress * 100}%`, backgroundColor: colors.accent }} /></View>
                </View>
                <Text style={st.dim}>{nextUp.valueLabel}</Text>
              </Card>
            )}

            <View style={st.row}>
              <Chip size="sm" active={achFilter === 'all'} onPress={() => setAchFilter('all')}>All</Chip>
              <Chip size="sm" active={achFilter === 'earned'} onPress={() => setAchFilter('earned')}>Earned</Chip>
              <Chip size="sm" active={achFilter === 'locked'} onPress={() => setAchFilter('locked')}>In progress</Chip>
            </View>

            {groups.map(g => (
              <View key={g} style={{ gap: space[2] }}>
                <Text style={st.groupH}>{g}</Text>
                <View style={st.achGrid}>
                  {achShown.filter(a => a.group === g).map(a => <AchievementTile key={a.id} a={a} style={st.tile} />)}
                </View>
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
                <View style={st.sheetHead}>
                  <View>
                    <Text style={st.eyebrow}>Profile</Text>
                    <Text style={st.sheetTitle}>Edit profile</Text>
                  </View>
                  <Pressable style={st.close} onPress={() => setForm(null)} accessibilityLabel="Close">
                    <Text style={{ color: colors.text, fontSize: fs.lg }}>×</Text>
                  </Pressable>
                </View>

                <View style={st.row}>
                  <Avatar src={form.avatar} size="lg" ring="accent" />
                  <Field label="Avatar URL" value={form.avatar} onChangeText={set('avatar')} placeholder="https://…" autoCapitalize="none" />
                </View>

                <View style={st.fieldRow}>
                  <Field label="Name" value={form.name} onChangeText={set('name')} />
                  <Field label="Username" value={form.username} onChangeText={set('username')} autoCapitalize="none" />
                </View>

                <Field label="Bio" value={form.bio} onChangeText={set('bio')} multiline placeholder="What are you training for?" />

                <View style={st.fieldRow}>
                  <Field label="Location" value={form.location} onChangeText={set('location')} />
                  {/* ponytail: plain YYYY-MM-DD text, no date picker (would need a dep) */}
                  <Field label="Date of birth" value={form.birthDate} onChangeText={set('birthDate')} placeholder="YYYY-MM-DD" />
                </View>

                <View style={st.fieldRow}>
                  <Field label="Height (cm)" value={form.heightCm} onChangeText={set('heightCm')} keyboardType="numeric" />
                  <Field label="Weight (kg)" value={form.weightKg} onChangeText={set('weightKg')} keyboardType="decimal-pad" />
                  <Field label="Sessions / week" value={form.weeklyGoal} onChangeText={set('weeklyGoal')} keyboardType="numeric" />
                </View>

                <View style={st.field}>
                  <Text style={st.fieldLabel}>Main sport</Text>
                  <View style={st.chips}>
                    {SPORT_TYPES.map(sp => (
                      <Chip key={sp.id} size="sm" active={form.primarySport === sp.id} onPress={() => set('primarySport')(sp.id)}>
                        {sp.emoji} {sp.label}
                      </Chip>
                    ))}
                  </View>
                </View>

                <View style={st.field}>
                  <Text style={st.fieldLabel}>Sex</Text>
                  <View style={st.chips}>
                    {SEXES.map(sx => (
                      <Chip key={sx.id} size="sm" active={form.sex === sx.id} onPress={() => set('sex')(sx.id)}>{sx.label}</Chip>
                    ))}
                  </View>
                </View>

                <Text style={st.hint}>BMI preview: {formBmi ? formBmi.toFixed(1) : '—'} · {bmiLabel(formBmi)}</Text>

                <View style={st.actions}>
                  <Pressable style={st.sheetBtn} onPress={() => setForm(null)}>
                    <Text style={st.sheetBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[st.sheetBtn, st.sheetBtnPrimary, !canSave && { opacity: 0.5 }]} disabled={!canSave} onPress={saveProfile}>
                    <Text style={[st.sheetBtnText, { color: colors.accentInk }]}>Save changes</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {!!toast && <View style={st.toast} pointerEvents="none"><Text style={st.toastText}>{toast}</Text></View>}
    </View>
  )
}

function Field({ label, style, ...props }) {
  return (
    <View style={st.field}>
      <Text style={st.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textDim}
        style={[st.input, props.multiline && { minHeight: 60, textAlignVertical: 'top' }, style]}
        {...props}
      />
    </View>
  )
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[2], flexWrap: 'wrap' },
  dim: { fontSize: fs.xs, color: colors.textDim, fontVariant: ['tabular-nums'] },
  sectionH: { fontSize: fs.sm, fontWeight: fw.semibold, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: space[3] },

  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  editBtn: { paddingVertical: space[2], paddingHorizontal: space[4], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  editText: { color: colors.text, fontSize: fs.sm, fontWeight: fw.medium },
  gear: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5 },
  handle: { color: colors.textDim, fontSize: fs.sm },
  bio: { color: colors.textMuted, fontSize: fs.md },
  stats: { flexDirection: 'row', justifyContent: 'space-around', gap: space[3], paddingTop: space[4], borderTopWidth: 1, borderTopColor: colors.border },

  rank: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderWidth: 1, borderRadius: radius.md },
  rankIcon: { fontSize: 32 },
  rankInfo: { flex: 1, gap: space[1] },
  rankLabel: { fontWeight: fw.bold, fontSize: fs.md },
  rankSub: { fontSize: fs.xs, color: colors.textDim },
  lp: { height: 4, borderRadius: 999, backgroundColor: colors.surface2, overflow: 'hidden' },
  // ponytail: tier pips hidden below ~400px would need useWindowDimensions; they just wrap instead
  pips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, maxWidth: 56 },
  pip: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 },
  rankLink: { fontSize: fs.xs, fontWeight: fw.semibold },

  highlights: { gap: space[2], padding: space[3], backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  hlHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  hlTitle: { fontSize: fs.xs, fontWeight: fw.semibold, textTransform: 'uppercase', letterSpacing: 0.8, color: colors.textDim },
  hlCount: { fontSize: fs.xs, color: colors.accent },
  hlRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[1] },
  hlChip: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, overflow: 'hidden', backgroundColor: colors.accentSoft, color: colors.accent, fontSize: 11, fontWeight: fw.semibold },
  hlNext: { backgroundColor: colors.surface, color: colors.textDim },

  tabs: { flexDirection: 'row', gap: space[1], padding: 4, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  tab: { flex: 1, padding: space[2], borderRadius: radius.pill, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.semibold },

  bodyGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[4], columnGap: 0 },
  bodyItem: { width: '33.33%', gap: 2, paddingRight: space[2] },
  bodyV: { color: colors.text, fontSize: fs.xl, fontWeight: fw.bold, fontVariant: ['tabular-nums'] },
  bodyU: { fontSize: fs.sm, color: colors.textDim, fontWeight: fw.regular },
  bodyL: { fontSize: fs.xs, color: colors.textDim, textTransform: 'uppercase', letterSpacing: 0.6 },

  achHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] },
  groupH: { fontSize: fs.xs, fontWeight: fw.semibold, textTransform: 'uppercase', letterSpacing: 0.8, color: colors.textDim },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  tile: { flexBasis: 100, flexGrow: 1, maxWidth: '33%' },
  next: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  nextLabel: { color: colors.text, fontSize: fs.sm, fontWeight: fw.semibold },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' },
  panel: {
    width: '100%', maxWidth: 576, maxHeight: '88%', backgroundColor: colors.bgElevated,
    borderTopWidth: 1, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    paddingTop: space[4], paddingHorizontal: space[5], paddingBottom: space[6],
  },
  handleBar: { alignSelf: 'center', width: 40, height: 4, borderRadius: radius.pill, backgroundColor: colors.borderStrong, marginBottom: space[2] },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space[3] },
  eyebrow: { fontSize: fs.xs, textTransform: 'uppercase', letterSpacing: 0.7, color: colors.textDim, fontWeight: fw.medium },
  sheetTitle: { fontSize: fs.xl, fontWeight: fw.bold, color: colors.text, marginTop: 2 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  field: { gap: space[1], flex: 1, minWidth: 112 },
  fieldRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  fieldLabel: { fontSize: fs.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: fw.medium },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, color: colors.text, padding: space[3], fontSize: fs.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  hint: { fontSize: fs.sm, color: colors.textMuted, backgroundColor: colors.surface, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md, overflow: 'hidden', fontVariant: ['tabular-nums'] },
  actions: { flexDirection: 'row', gap: space[2], marginTop: space[2] },
  sheetBtn: { flex: 1, padding: space[3], borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  sheetBtnPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  sheetBtnText: { color: colors.textMuted, fontSize: fs.md, fontWeight: fw.semibold },

  toast: { position: 'absolute', bottom: space[3], alignSelf: 'center', backgroundColor: colors.text, paddingVertical: space[3], paddingHorizontal: space[5], borderRadius: radius.pill },
  toastText: { color: colors.bg, fontWeight: fw.semibold, fontSize: fs.sm },
})
