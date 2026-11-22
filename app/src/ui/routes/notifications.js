import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Avatar, EmptyState, Screen } from '@/ui/components/ui'
import { notifications as INITIAL } from '@/api/mock/data/notifications'
import { colors, fs, fw, space } from '@/ui/theme'


export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL)
  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = id => setNotifications(list => list.map(n => (n.id === id ? { ...n, read: true } : n)))
  const markAllRead = () => setNotifications(list => list.map(n => ({ ...n, read: true })))

  return (
    <Screen style={{ gap: space[5] }}>
      <View style={st.head}>
        <Pressable style={st.back} onPress={() => router.back()} accessibilityLabel="Back">
          <Text style={st.backText}>←</Text>
        </Pressable>
        <Text style={st.title}>Notifications</Text>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead}>
            <Text style={st.mark}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {notifications.length ? (
        <View>
          {notifications.map((n, i) => (
            <Pressable key={n.id} style={[st.item, i > 0 && st.sep]} onPress={() => markRead(n.id)}>
              {n.avatar ? <Avatar src={n.avatar} size="md" /> : <View style={st.glyph}><Text style={{ fontSize: 18 }}>🏆</Text></View>}
              <View style={st.main}>
                <Text style={[st.text, !n.read && { color: colors.text }]}>
                  {!!n.user && <Text style={st.user}>{n.user} </Text>}
                  {n.action}
                </Text>
                {!!n.content && <Text style={st.content} numberOfLines={1}>{n.content}</Text>}
                <Text style={st.time}>{n.time}</Text>
              </View>
              {!n.read && <View style={st.dot} accessibilityLabel="Unread" />}
            </Pressable>
          ))}
        </View>
      ) : (
        <EmptyState icon="🔕" title="All caught up" description="Nothing here right now." />
      )}
    </Screen>
  )
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  back: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.textMuted, fontSize: 20 },
  title: { flex: 1, minWidth: 0, color: colors.text, fontSize: fs.xl, fontWeight: fw.semibold, letterSpacing: -0.4 },
  mark: { color: colors.textMuted, fontSize: fs.sm },

  item: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3], paddingVertical: space[4] },
  sep: { borderTopWidth: 1, borderTopColor: colors.border },
  glyph: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, minWidth: 0, gap: 2 },
  text: { color: colors.textMuted, fontSize: fs.sm, lineHeight: 20 },
  user: { color: colors.text, fontWeight: fw.semibold },
  content: { color: colors.textDim, fontSize: fs.sm },
  time: { color: colors.textDim, fontSize: fs.xs },
  dot: { alignSelf: 'center', width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
})
