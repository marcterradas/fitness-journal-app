import { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Button, Card, UserLink } from '@/ui/components/ui'
import { colors, fs, fw, space } from '@/ui/theme'

const USERS = [
  { id: 1, name: 'Ava Smith', username: 'ava_fit', avatar: 'https://i.pravatar.cc/150?u=ava' },
  { id: 2, name: 'Liam Turner', username: 'liam_lifts', avatar: 'https://i.pravatar.cc/150?u=liam' },
  { id: 3, name: 'Maya Lee', username: 'maya_moves', avatar: 'https://i.pravatar.cc/150?u=maya' },
  { id: 4, name: 'Noah Reed', username: 'noah_runs', avatar: 'https://i.pravatar.cc/150?u=noah' },
]

export default function FollowSuggestionsForYou() {
  return <FollowSuggestions title="Suggested for you" users={USERS} />
}

// Shared with FollowSuggestionsTopAthletes (the two Vue files were copies).
export function FollowSuggestions({ title, users }) {
  // { [id]: true } — which users I follow (local only).
  const [following, setFollowing] = useState({})
  const toggle = id => setFollowing(f => ({ ...f, [id]: !f[id] }))

  return (
    <Card padding="md">
      <Text style={st.title}>{title}</Text>
      <View>
        {users.map((u, i) => (
          <View key={u.id} style={[st.item, i > 0 && st.divider]}>
            <Image source={{ uri: u.avatar }} style={st.avatar} />
            <View style={st.info}>
              <UserLink user={u}>{u.name}</UserLink>
              <UserLink user={u} style={st.handle}>@{u.username}</UserLink>
            </View>
            <Button size="sm" variant={following[u.id] ? 'secondary' : 'primary'} onPress={() => toggle(u.id)}>
              {following[u.id] ? 'Following' : 'Follow'}
            </Button>
          </View>
        ))}
      </View>
    </Card>
  )
}

const st = StyleSheet.create({
  title: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.semibold, textTransform: 'uppercase', letterSpacing: 0.8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[2] },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface2 },
  info: { flex: 1, minWidth: 0 },
  handle: { color: colors.textDim, fontSize: fs.sm, fontWeight: fw.regular },
})
