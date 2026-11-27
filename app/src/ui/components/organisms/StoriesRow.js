import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { colors, space } from '@/ui/theme'
import Text from '../atoms/Text'

export default function StoriesRow({ stories, showAdd = false, onOpen }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.row}>
      {showAdd && (
        // ponytail: "New" story is a dead button, like the original.
        <Pressable style={st.story}>
          <View style={st.add}><Text variant="muted" style={{ fontSize: 24 }}>+</Text></View>
          <Text variant="dim" color={colors.textMuted} align="center" style={st.label} numberOfLines={1}>New</Text>
        </Pressable>
      )}
      {stories.map((s, i) => (
        <Pressable key={s.id} style={st.story} onPress={() => onOpen?.(i)} accessibilityLabel={`${s.user.name}'s story`}>
          {/* ponytail: solid accent ring instead of the accent→cardio gradient (no gradient lib) */}
          <View style={[st.ring, s.seen && st.ringSeen]}>
            <Image source={{ uri: s.user.avatar }} style={st.avatar} />
          </View>
          <Text variant="dim" color={colors.textMuted} align="center" style={st.label} numberOfLines={1}>{s.user.username}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const D = 68
const st = StyleSheet.create({
  row: { gap: space[3], paddingVertical: space[2] },
  story: { width: 72, alignItems: 'center', gap: space[2] },
  ring: { width: D, height: D, borderRadius: D / 2, padding: 2, backgroundColor: colors.accent },
  ringSeen: { backgroundColor: colors.borderStrong },
  avatar: { flex: 1, borderRadius: D / 2, borderWidth: 2, borderColor: colors.bg, backgroundColor: colors.surface2 },
  add: {
    width: D, height: D, borderRadius: D / 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.borderStrong,
  },
  label: { width: '100%' },
})
