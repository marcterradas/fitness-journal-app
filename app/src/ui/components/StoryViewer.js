import { useEffect, useReducer, useRef, useState } from 'react'
import { Image, Modal, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/ui/components/ui'
import { step } from '@/domain/storyNav'
import { colors, fs, fw, radius, space } from '@/ui/theme'

const DURATION = 5000
const TICK = 50

// Full-screen story player. Tap left/right = prev/next, hold = pause.
// ponytail: desktop "peek" cards and keyboard arrows dropped (mobile-first).
export default function StoryViewer({ stories, startIndex = 0, onClose }) {
  const [pos, setPos] = useState({ userIdx: startIndex, itemIdx: 0 })
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState('')
  const [toast, setToast] = useState('')
  const [, rerender] = useReducer(x => x + 1, 0)
  // A ref (not state) so the interval reads the latest value without restarting.
  const paused = useRef(false)

  const story = stories[pos.userIdx]
  const item = story.items[pos.itemIdx]

  function go(dir) {
    const at = step(stories, pos.userIdx, pos.itemIdx, dir)
    if (!at) return onClose?.()
    setPos(at)
    setProgress(0)
  }

  // Restart the timer whenever the visible item changes (like Vue's play()).
  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setProgress(p => p + TICK / DURATION)
    }, TICK)
    return () => clearInterval(t)
  }, [pos])

  useEffect(() => { if (progress >= 1) go(1) }, [progress])

  // ponytail: mutates the mock object (as the Vue version did); Home re-renders on close.
  useEffect(() => { story.seen = true }, [story])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1600)
    return () => clearTimeout(t)
  }, [toast])

  function toggleLike() {
    item.liked = !item.liked
    item.likes += item.liked ? 1 : -1
    rerender()
  }

  async function share() {
    try {
      await Share.share({ message: `${story.user.name}'s story: ${item.caption ?? ''}` })
    } catch {
      // share sheet dismissed / unavailable — nothing to recover
    }
  }

  // ponytail: no API yet, reply acknowledged and dropped.
  function sendComment() {
    if (!comment.trim()) return
    setComment('')
    setToast('Reply sent')
  }

  const hold = { onPressIn: () => { paused.current = true }, onPressOut: () => { paused.current = false }, onLongPress: () => {} }

  return (
    <Modal visible animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
      <SafeAreaView style={st.viewer}>
        <View style={st.stage}>
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityLabel={item.caption} />

          <Pressable style={[st.tap, { left: 0, width: '35%' }]} onPress={() => go(-1)} accessibilityLabel="Previous" {...hold} />
          <Pressable style={[st.tap, { right: 0, width: '65%' }]} onPress={() => go(1)} accessibilityLabel="Next" {...hold} />

          <View style={st.bars} pointerEvents="none">
            {story.items.map((it, i) => (
              <View key={it.id} style={st.bar}>
                <View style={[st.barFill, { width: `${i < pos.itemIdx ? 100 : i === pos.itemIdx ? Math.min(progress, 1) * 100 : 0}%` }]} />
              </View>
            ))}
          </View>

          <View style={st.head}>
            <Image source={{ uri: story.user.avatar }} style={st.avatar} />
            <Text style={st.name}>{story.user.name}</Text>
            <Text style={st.when}>{item.when}</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close" hitSlop={12}>
              <Text style={st.close}>✕</Text>
            </Pressable>
          </View>

          <Pressable style={[st.arrow, { left: space[3] }]} onPress={() => go(-1)} accessibilityLabel="Previous">
            <Text style={st.arrowText}>‹</Text>
          </Pressable>
          <Pressable style={[st.arrow, { right: space[3] }]} onPress={() => go(1)} accessibilityLabel="Next">
            <Text style={st.arrowText}>›</Text>
          </Pressable>

          <View style={st.foot}>
            {!!item.caption && <Text style={st.caption}>{item.caption}</Text>}
            <View style={st.acts}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={sendComment}
                onFocus={() => { paused.current = true }}
                onBlur={() => { paused.current = false }}
                placeholder={`Reply to ${story.user.username}…`}
                placeholderTextColor="rgba(255,255,255,0.6)"
                returnKeyType="send"
                style={st.input}
              />
              <Pressable style={st.actBtn} onPress={toggleLike} accessibilityLabel={item.liked ? 'Unlike' : 'Like'}>
                <Icon name={item.liked ? 'heart' : 'heart-outline'} size={22} color={item.liked ? colors.mood : '#fff'} />
                <Text style={st.count}>{item.likes}</Text>
              </Pressable>
              <Pressable style={st.actBtn} onPress={share} accessibilityLabel="Share">
                <Icon name="send" size={22} color="#fff" />
              </Pressable>
            </View>
            {!!toast && <Text style={st.toast}>{toast}</Text>}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const shadow = { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
const st = StyleSheet.create({
  viewer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  stage: { flex: 1, width: '100%', maxWidth: 416, maxHeight: 736, backgroundColor: colors.bg, overflow: 'hidden', borderRadius: radius.lg },
  tap: { position: 'absolute', top: 0, bottom: 88 },
  bars: { position: 'absolute', top: space[3], left: space[3], right: space[3], flexDirection: 'row', gap: 3 },
  bar: { flex: 1, height: 2, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#fff' },
  head: { position: 'absolute', top: space[3] + 12, left: space[3], right: space[3], flexDirection: 'row', alignItems: 'center', gap: space[2] },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  name: { color: '#fff', fontSize: fs.sm, fontWeight: fw.semibold, ...shadow },
  when: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: fs.xs, ...shadow },
  close: { color: '#fff', fontSize: fs.xl, opacity: 0.85, ...shadow },
  arrow: {
    position: 'absolute', top: '50%', marginTop: -16, width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  arrowText: { color: '#fff', fontSize: 24, lineHeight: 26, marginTop: -3 },
  // ponytail: flat dark scrim instead of the transparent→black gradient.
  foot: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space[4], gap: space[3], backgroundColor: 'rgba(0,0,0,0.55)' },
  caption: { color: '#fff', fontSize: fs.sm, ...shadow },
  acts: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  input: {
    flex: 1, minWidth: 0, paddingVertical: space[2], paddingHorizontal: space[4], color: '#fff', fontSize: fs.sm,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: radius.pill,
  },
  actBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: space[1] },
  count: { color: '#fff', fontSize: fs.xs },
  toast: { color: 'rgba(255,255,255,0.85)', fontSize: fs.xs, textAlign: 'center' },
})
