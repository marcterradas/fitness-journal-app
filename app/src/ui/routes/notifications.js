import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { Avatar, EmptyState, IconButton, Row, Screen, Text } from '@/ui/components'
import { notifications as INITIAL } from '@/api/mock/data/notifications'
import { colors, space } from '@/ui/theme'

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL)
  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = id => setNotifications(list => list.map(n => (n.id === id ? { ...n, read: true } : n)))
  const markAllRead = () => setNotifications(list => list.map(n => ({ ...n, read: true })))

  return (
    <Screen style={{ gap: space[5] }}>
      <Row gap={3}>
        <IconButton icon="back" label="Back" onPress={() => router.back()} />
        <Text variant="h2" style={{ flex: 1, minWidth: 0 }}>Notifications</Text>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} accessibilityRole="button">
            <Text variant="muted">Mark all read</Text>
          </Pressable>
        )}
      </Row>

      {notifications.length ? (
        <View>
          {notifications.map((n, i) => (
            <Pressable key={n.id} style={[st.item, i > 0 && st.sep]} onPress={() => markRead(n.id)}>
              {n.avatar ? <Avatar src={n.avatar} size="md" /> : <View style={st.glyph}><Text style={{ fontSize: 18 }}>🏆</Text></View>}
              <View style={st.main}>
                <Text variant="muted" color={n.read ? undefined : colors.text} style={{ lineHeight: 20 }}>
                  {!!n.user && <Text variant="muted" weight="semibold" color={colors.text}>{n.user} </Text>}
                  {n.action}
                </Text>
                {!!n.content && <Text variant="muted" color={colors.textDim} numberOfLines={1}>{n.content}</Text>}
                <Text variant="dim">{n.time}</Text>
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
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3], paddingVertical: space[4] },
  sep: { borderTopWidth: 1, borderTopColor: colors.border },
  glyph: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, minWidth: 0, gap: 2 },
  dot: { alignSelf: 'center', width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
})
