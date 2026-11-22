import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { AppHeader, Avatar, Card, Screen } from '@/ui/components/ui'
import { conversations as INITIAL } from '@/api/mock/data/conversations'
import { colors, fs, fw, radius, space } from '@/ui/theme'


// ponytail: mobile layout only (list OR chat). The old desktop split view (list + window side by side) is skipped.
export default function MessagesScreen() {
  const [conversations, setConversations] = useState(INITIAL)
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)
  const active = conversations.find(c => c.id === activeId) || null

  function selectChat(id) {
    setActiveId(id)
    setConversations(list => list.map(c => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  function send() {
    const text = draft.trim()
    if (!text || !active) return
    const msg = { id: Date.now(), text, isMe: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setConversations(list => list.map(c => (c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c)))
    setDraft('')
  }

  if (active) {
    return (
      <Screen scroll={false} style={{ padding: 0, paddingBottom: 0, gap: 0 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={st.chatHead}>
            <Pressable style={st.chatBack} onPress={() => setActiveId(null)} accessibilityLabel="Back to messages">
              <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
            </Pressable>
            <Avatar src={active.avatar} size="sm" />
            <View>
              <Text style={st.name}>{active.name}</Text>
              <Text style={st.status}>{active.online ? 'Online' : 'Offline'}</Text>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={{ flex: 1, backgroundColor: colors.bgElevated }}
            contentContainerStyle={st.msgs}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {active.messages.map(m => (
              <View key={m.id} style={[st.msg, m.isMe ? st.msgMe : st.msgThem]}>
                <Text style={[st.bubble, m.isMe ? st.bubbleMe : st.bubbleThem]}>{m.text}</Text>
                <Text style={st.msgTime}>{m.time}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={st.inputRow}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
              placeholder="Type a message..."
              placeholderTextColor={colors.textDim}
              returnKeyType="send"
              style={st.input}
            />
            <Pressable style={[st.send, !draft.trim() && { opacity: 0.4 }]} disabled={!draft.trim()} onPress={send}>
              <Text style={st.sendText}>Send</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Screen>
    )
  }

  return (
    <Screen>
      <AppHeader />
      <View>
        <Text style={st.eyebrow}>INBOX</Text>
        <Text style={st.title}>Messages</Text>
      </View>

      <Card padding="none" style={{ gap: 0, overflow: 'hidden' }}>
        {conversations.map((c, i) => {
          const last = c.messages[c.messages.length - 1]
          return (
            <Pressable
              key={c.id}
              onPress={() => selectChat(c.id)}
              style={({ pressed }) => [st.item, i > 0 && st.sep, pressed && { backgroundColor: colors.surface2 }]}
            >
              <View>
                <Avatar src={c.avatar} size="md" />
                {c.online && <View style={st.online} accessibilityLabel="Online" />}
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <View style={st.itemRow}>
                  <Text style={st.name} numberOfLines={1}>{c.name}</Text>
                  <Text style={st.status}>{last?.time}</Text>
                </View>
                <View style={st.itemRow}>
                  <Text style={st.preview} numberOfLines={1}>{last?.text || ''}</Text>
                  {c.unread > 0 && <Text style={st.badge}>{c.unread}</Text>}
                </View>
              </View>
            </Pressable>
          )
        })}
      </Card>
    </Screen>
  )
}

const st = StyleSheet.create({
  eyebrow: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.medium, letterSpacing: 0.7 },
  title: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5 },

  item: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] },
  sep: { borderTopWidth: 1, borderTopColor: colors.border },
  online: { position: 'absolute', right: 0, bottom: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.surface },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  name: { color: colors.text, fontWeight: fw.semibold, fontSize: fs.md, flexShrink: 1 },
  status: { color: colors.textDim, fontSize: fs.xs },
  preview: { flex: 1, minWidth: 0, color: colors.textMuted, fontSize: fs.sm },
  badge: { backgroundColor: colors.accent, color: colors.accentInk, fontSize: fs.xs, fontWeight: fw.bold, paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, minWidth: 20, textAlign: 'center', overflow: 'hidden' },

  chatHead: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  chatBack: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  msgs: { padding: space[4], gap: space[3] },
  msg: { maxWidth: '75%', gap: 2 },
  msgMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgThem: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.lg, fontSize: fs.sm, lineHeight: 20, overflow: 'hidden' },
  bubbleMe: { backgroundColor: colors.accent, color: colors.accentInk, borderBottomRightRadius: radius.sm },
  bubbleThem: { backgroundColor: colors.surface2, color: colors.text, borderBottomLeftRadius: radius.sm },
  msgTime: { color: colors.textDim, fontSize: fs.xs, paddingHorizontal: space[2] },

  inputRow: { flexDirection: 'row', gap: space[2], padding: space[3], borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingVertical: space[3], paddingHorizontal: space[4], borderRadius: radius.pill, fontSize: fs.sm },
  send: { paddingHorizontal: space[5], backgroundColor: colors.accent, borderRadius: radius.pill, justifyContent: 'center' },
  sendText: { color: colors.accentInk, fontWeight: fw.semibold },
})
