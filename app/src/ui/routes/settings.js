import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Avatar, IconButton, Row, Screen, Text } from '@/ui/components'
import { currentUser } from '@/api/mock/data/user'
import { colors, radius, space } from '@/ui/theme'

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
      <Row gap={3}>
        <IconButton icon="back" label="Back" onPress={() => router.back()} />
        <Text variant="h2">Settings</Text>
      </Row>

      <View>
        <Pressable style={st.row} onPress={() => router.push('/profile')}>
          <Avatar src={currentUser.avatar} size="md" />
          <View style={st.main}>
            <Text>{currentUser.name}</Text>
            <Text variant="muted" color={colors.textDim}>@{currentUser.username}</Text>
          </View>
          <Text style={st.chev}>›</Text>
        </Pressable>

        {TOGGLES.map(t => {
          const on = settings[t.key]
          return (
            <Pressable key={t.key} style={[st.row, st.sep]} onPress={() => set(t.key, !on)} accessibilityRole="switch" accessibilityState={{ checked: on }}>
              <View style={st.main}><Text>{t.label}</Text></View>
              <View style={[st.toggle, on && st.toggleOn]}>
                <View style={[st.thumb, on && st.thumbOn]} />
              </View>
            </Pressable>
          )
        })}

        <View style={[st.row, st.sep]}>
          <View style={st.main}><Text>Units</Text></View>
          <View style={st.seg} accessibilityRole="radiogroup">
            {['metric', 'imperial'].map(u => {
              const on = settings.units === u
              return (
                <Pressable key={u} style={[st.segOpt, on && st.segOptOn]} onPress={() => set('units', u)} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                  <Text variant="muted" color={on ? colors.accent : colors.textDim} weight={on ? 'semibold' : undefined}>{u === 'metric' ? 'kg · km' : 'lb · mi'}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {LINKS.map(l => (
          <Pressable key={l} style={[st.row, st.sep]}>
            <View style={st.main}><Text>{l}</Text></View>
            <Text style={st.chev}>›</Text>
          </Pressable>
        ))}

        <Pressable style={[st.row, st.sep]} onPress={() => router.replace('/login')}>
          <Text color={colors.danger}>Log out</Text>
        </Pressable>
      </View>

      <Text variant="dim" align="center">Journal Fit · v0.1</Text>
    </Screen>
  )
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[4] },
  sep: { borderTopWidth: 1, borderTopColor: colors.border },
  main: { flex: 1, minWidth: 0, gap: 2 },
  chev: { color: colors.textDim, fontSize: 18 },

  toggle: { width: 42, height: 24, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, padding: 2 },
  toggleOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  thumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.textMuted },
  thumbOn: { backgroundColor: colors.accentInk, transform: [{ translateX: 18 }] },

  seg: { flexDirection: 'row', gap: space[1] },
  segOpt: { paddingVertical: space[1], paddingHorizontal: space[3], borderRadius: radius.pill },
  segOptOn: { backgroundColor: colors.accentSoft },
})
