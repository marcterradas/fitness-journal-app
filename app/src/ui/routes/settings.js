import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Avatar, Screen } from '@/ui/components/ui'
import { currentUser } from '@/api/mock/data/user'
import { colors, fs, fw, radius, space } from '@/ui/theme'

const TOGGLES = [
  { key: 'push', label: 'Push notifications' },
  { key: 'publicProfile', label: 'Public profile' },
]
const LINKS = ['Help & support', 'Terms & privacy']

export default function SettingsScreen() {
  // ponytail: local state only, no persistence. Wire to a store/API when settings must survive reload.
  const [settings, setSettings] = useState({ push: true, publicProfile: true, units: 'metric' })
  const set = (key, value) => setSettings(x => ({ ...x, [key]: value }))

  return (
    <Screen style={{ gap: space[5] }}>
      <View style={st.head}>
        <Pressable style={st.back} onPress={() => router.back()} accessibilityLabel="Back">
          <Text style={st.backText}>←</Text>
        </Pressable>
        <Text style={st.title}>Settings</Text>
      </View>

      <View>
        <Pressable style={st.row} onPress={() => router.push('/profile')}>
          <Avatar src={currentUser.avatar} size="md" />
          <View style={st.main}>
            <Text style={st.label}>{currentUser.name}</Text>
            <Text style={st.sub}>@{currentUser.username}</Text>
          </View>
          <Text style={st.chev}>›</Text>
        </Pressable>

        {TOGGLES.map(t => {
          const on = settings[t.key]
          return (
            <Pressable key={t.key} style={[st.row, st.sep]} onPress={() => set(t.key, !on)} accessibilityRole="switch" accessibilityState={{ checked: on }}>
              <View style={st.main}><Text style={st.label}>{t.label}</Text></View>
              <View style={[st.toggle, on && st.toggleOn]}>
                <View style={[st.thumb, on && st.thumbOn]} />
              </View>
            </Pressable>
          )
        })}

        <View style={[st.row, st.sep]}>
          <View style={st.main}><Text style={st.label}>Units</Text></View>
          <View style={st.seg} accessibilityRole="radiogroup">
            {['metric', 'imperial'].map(u => {
              const on = settings.units === u
              return (
                <Pressable key={u} style={[st.segOpt, on && st.segOptOn]} onPress={() => set('units', u)} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                  <Text style={[st.segText, on && st.segTextOn]}>{u === 'metric' ? 'kg · km' : 'lb · mi'}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {LINKS.map(l => (
          <Pressable key={l} style={[st.row, st.sep]}>
            <View style={st.main}><Text style={st.label}>{l}</Text></View>
            <Text style={st.chev}>›</Text>
          </Pressable>
        ))}

        <Pressable style={[st.row, st.sep]} onPress={() => router.replace('/login')}>
          <Text style={[st.label, { color: colors.danger }]}>Log out</Text>
        </Pressable>
      </View>

      <Text style={st.version}>Journal Fit · v0.1</Text>
    </Screen>
  )
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  back: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.textMuted, fontSize: 20 },
  title: { color: colors.text, fontSize: fs.xl, fontWeight: fw.semibold, letterSpacing: -0.4 },

  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[4] },
  sep: { borderTopWidth: 1, borderTopColor: colors.border },
  main: { flex: 1, minWidth: 0, gap: 2 },
  label: { color: colors.text, fontSize: fs.md },
  sub: { color: colors.textDim, fontSize: fs.sm },
  chev: { color: colors.textDim, fontSize: fs.lg },

  toggle: { width: 42, height: 24, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, padding: 2 },
  toggleOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  thumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.textMuted },
  thumbOn: { backgroundColor: colors.accentInk, transform: [{ translateX: 18 }] },

  seg: { flexDirection: 'row', gap: space[1] },
  segOpt: { paddingVertical: space[1], paddingHorizontal: space[3], borderRadius: radius.pill },
  segOptOn: { backgroundColor: colors.accentSoft },
  segText: { color: colors.textDim, fontSize: fs.sm },
  segTextOn: { color: colors.accent, fontWeight: fw.semibold },

  version: { textAlign: 'center', color: colors.textDim, fontSize: fs.xs },
})
