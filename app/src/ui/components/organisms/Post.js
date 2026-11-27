import { useRef, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import Avatar from '../atoms/Avatar'
import Badge from '../atoms/Badge'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import Row from '../atoms/Row'
import SportIcon from '../atoms/SportIcon'
import Text from '../atoms/Text'
import UserLink from '../molecules/UserLink'
import { currentUser } from '@/api/mock/data/user'
import { colors, fs, fw, radius, space } from '@/ui/theme'

// ponytail: single-hue sequential ramp (effort low→high), labels + gaps carry identity
const ZONE_COLORS = ['#63332f', '#8f423b', '#bc5147', '#e66353', '#ff8a70']
const ZONE_NAMES = ['Easy', 'Steady', 'Tempo', 'Threshold', 'Max']

// Derived data for the details section (splits, HR zones, exercise bars).
function derive(post) {
  const exRows = (post.exercises ?? []).map(ex => ({ ...ex, vol: ex.sets * ex.reps * (ex.weightKg || 1) }))
  const maxVol = Math.max(...exRows.map(r => r.vol))
  const exercises = exRows.map(r => ({ ...r, pct: Math.max(10, Math.round((r.vol / maxVol) * 100)) }))
  const totalVolumeKg = exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * (ex.weightKg || 0), 0)

  const secs = (post.splits ?? []).map(x => x.sec)
  const min = Math.min(...secs), max = Math.max(...secs)
  const splits = (post.splits ?? []).map(x => ({
    ...x,
    fastest: x.sec === min,
    pct: max === min ? 100 : Math.round(40 + ((max - x.sec) / (max - min)) * 60),
  }))

  const z = post.hr?.zones ?? []
  const total = z.reduce((sum, x) => sum + x.min, 0)
  const hrZones = z.map((x, i) => ({ ...x, color: ZONE_COLORS[i], name: ZONE_NAMES[i], pct: total ? (x.min / total) * 100 : 0 }))

  return { exercises, totalVolumeKg, splits, hrZones }
}

const STATS = [
  ['distanceKm', 'km'], ['durationMin', 'min'], ['paceMinKm', '/km'], ['avgKmh', 'km/h'], ['calories', 'kcal'],
]

export default function Post({ post }) {
  const [kudos, setKudos] = useState(post.kudos ?? 0)
  const [liked, setLiked] = useState(!!post.kudoed)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)
  const [comments, setComments] = useState(post.comments ?? [])
  const [showDetails, setShowDetails] = useState(false)
  const [activeMedia, setActiveMedia] = useState(0)
  const [mediaW, setMediaW] = useState(0)
  const trackRef = useRef(null)

  const media = post.media ?? (post.image ? [{ type: 'image', url: post.image }] : [])
  const { exercises, totalVolumeKg, splits, hrZones } = derive(post)
  const fastestSplit = splits.find(s => s.fastest)
  const visibleComments = showAllComments ? comments : comments.slice(0, 2)
  const hiddenCount = Math.max(0, comments.length - 2)
  const detailBits = [
    splits.length ? `${splits.length} splits` : '',
    hrZones.length ? 'heart rate' : '',
    exercises.length ? `${exercises.length} exercises` : '',
  ].filter(Boolean)

  const stats = post.stats
    ? [
        ...STATS.filter(([k]) => post.stats[k]).map(([k, l]) => [post.stats[k], l]),
        ...(post.hr?.avg ? [[post.hr.avg, 'avg bpm']] : []),
        ...(post.stats.elevationM ? [[post.stats.elevationM, 'm elev']] : []),
      ]
    : []

  function toggleKudos() {
    setKudos(k => k + (liked ? -1 : 1))
    setLiked(!liked)
  }

  function addComment() {
    const text = commentText.trim()
    if (!text) return
    setComments([...comments, { user: currentUser.name, avatar: currentUser.avatar, text }])
    setCommentText('')
    setShowCommentInput(false)
    setShowAllComments(true)
  }

  function goToMedia(i) {
    trackRef.current?.scrollTo({ x: i * mediaW, animated: true })
    setActiveMedia(i)
  }

  const mediaH = Math.min(mediaW, 460)

  return (
    <Card padding="none" style={st.post}>
      <Row gap={3} style={{ padding: space[4] }}>
        {/* /u/<me> redirects to /profile */}
        <Pressable onPress={() => router.push(`/u/${post.user.username}`)} accessibilityLabel={`${post.user.name}'s profile`}>
          <Avatar src={post.user.avatar} size="md" />
        </Pressable>
        <View style={st.who}>
          <Text numberOfLines={1}>
            <UserLink user={post.user}>{post.user.name}</UserLink>
            <Text variant="dim"> · {post.when}</Text>
          </Text>
          <Row>
            <UserLink user={post.user} style={st.handle}>@{post.user.username}</UserLink>
            {post.type === 'workout' && <Text variant="overline" color={colors.accent} style={st.typeTag}>Workout</Text>}
          </Row>
        </View>
        {!!post.sport && <SportIcon sport={post.sport} size="sm" />}
      </Row>

      {!!(post.title || post.text || post.badge) && (
        <View style={st.body}>
          {!!post.title && <Text variant="h3" weight="semibold">{post.title}</Text>}
          {!!post.text && <Text style={{ lineHeight: 24 }}>{post.text}</Text>}
          {!!post.badge && <Badge tone="accent" icon={post.badge.icon}>{post.badge.label}</Badge>}
        </View>
      )}

      {media.length > 0 && (
        <View onLayout={e => setMediaW(e.nativeEvent.layout.width)}>
          {mediaW > 0 && (
            <ScrollView
              ref={trackRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={e => setActiveMedia(Math.round(e.nativeEvent.contentOffset.x / mediaW))}
            >
              {media.map((m, i) => (
                <View key={i} style={{ width: mediaW, height: mediaH }}>
                  <Image
                    source={{ uri: m.type === 'video' ? m.thumb : m.url }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                    accessibilityLabel={post.title || 'Post media'}
                  />
                  {/* ponytail: video shows its poster only — needs expo-video to play */}
                  {m.type === 'video' && (
                    <View style={st.play}><Ionicons name="play-circle" size={56} color="rgba(255,255,255,0.9)" /></View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
          {media.length > 1 && (
            <>
              {activeMedia > 0 && (
                <Pressable style={[st.arrow, { left: space[3] }]} onPress={() => goToMedia(activeMedia - 1)} accessibilityLabel="Previous">
                  <Text color="#fff" style={st.arrowText}>‹</Text>
                </Pressable>
              )}
              {activeMedia < media.length - 1 && (
                <Pressable style={[st.arrow, { right: space[3] }]} onPress={() => goToMedia(activeMedia + 1)} accessibilityLabel="Next">
                  <Text color="#fff" style={st.arrowText}>›</Text>
                </Pressable>
              )}
              <Text variant="dim" weight="medium" color="#fff" style={st.counter}>{activeMedia + 1}/{media.length}</Text>
              <Row gap={1} justify="center" style={st.dots}>
                {media.map((_, i) => (
                  <Pressable key={i} onPress={() => goToMedia(i)} style={[st.dot, i === activeMedia && st.dotActive]} accessibilityLabel={`Media ${i + 1}`} />
                ))}
              </Row>
            </>
          )}
        </View>
      )}

      {stats.length > 0 && (
        <View style={[st.section, st.stats]}>
          {stats.map(([v, l]) => (
            <View key={l}>
              <Text variant="h3">{v}</Text>
              <Text variant="overline" weight="regular">{l}</Text>
            </View>
          ))}
        </View>
      )}

      {detailBits.length > 0 && (
        <Pressable style={st.detailsToggle} onPress={() => setShowDetails(!showDetails)} accessibilityState={{ expanded: showDetails }}>
          <Text variant="overline" weight="regular">{detailBits.join(' · ')}</Text>
          <Text variant="dim">{showDetails ? '▴' : '▾'}</Text>
        </Pressable>
      )}

      {showDetails && splits.length > 0 && (
        <View style={st.section}>
          <Row align="baseline" justify="space-between">
            <Text variant="overline">Splits</Text>
            <Text variant="dim">fastest {fastestSplit.pace} /km</Text>
          </Row>
          <View style={st.splits}>
            {splits.map(s => (
              <View key={s.km} style={st.split}>
                {s.fastest && <Text variant="dim" weight="semibold" color={colors.accent} style={st.tiny}>{s.pace}</Text>}
                <View style={[st.splitCol, s.fastest && { backgroundColor: colors.accent }, { height: `${s.pct * 0.7}%` }]} />
                <Text variant="dim" style={st.tiny}>{s.km}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {showDetails && hrZones.length > 0 && (
        <View style={st.section}>
          <Row align="baseline" justify="space-between">
            <Text variant="overline">Heart rate</Text>
            <Text variant="dim">avg {post.hr.avg} · max {post.hr.max} bpm</Text>
          </Row>
          <View style={st.hrStrip}>
            {hrZones.filter(z => z.min > 0).map(z => (
              <View key={z.z} style={{ flex: z.pct, minWidth: 4, backgroundColor: z.color }} />
            ))}
          </View>
          <Row gap={3} wrap>
            {hrZones.map(z => (
              <Row key={z.z} gap={1} style={z.min === 0 && { opacity: 0.4 }}>
                <View style={[st.hrDot, { backgroundColor: z.color }]} />
                <Text variant="dim" weight="semibold" color={colors.textMuted}>Z{z.z}</Text>
                <Text variant="dim">{z.min}m</Text>
              </Row>
            ))}
          </Row>
        </View>
      )}

      {showDetails && exercises.length > 0 && (
        <View style={st.section}>
          <Row align="baseline" justify="space-between">
            <Text variant="overline">Exercises</Text>
            {totalVolumeKg > 0 && <Text variant="dim">{totalVolumeKg.toLocaleString()} kg total</Text>}
          </Row>
          {exercises.map(ex => (
            <View key={ex.name} style={{ gap: 5 }}>
              <Row>
                <Text variant="small" weight="medium" style={{ flex: 1, minWidth: 0 }}>{ex.name}</Text>
                {ex.pr && <Text variant="dim" weight="bold" color={colors.accentInk} style={st.pr}>PR</Text>}
                <Text variant="dim">{ex.sets}×{ex.reps}{ex.weightKg ? ` · ${ex.weightKg} kg` : ''}</Text>
              </Row>
              <View style={st.track}>
                <View style={[st.bar, ex.pr && { backgroundColor: colors.accent }, { width: `${ex.pct}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      <Row style={st.actions}>
        <Pressable style={st.btn} onPress={toggleKudos} accessibilityLabel="Give kudos">
          <Text>{liked ? '💚' : '🤍'}</Text>
          <Text variant="muted" weight="medium" color={liked ? colors.accent : undefined}>{kudos}</Text>
        </Pressable>
        <Pressable style={st.btn} onPress={() => setShowCommentInput(!showCommentInput)} accessibilityLabel="Comment">
          <Text>💬</Text>
          <Text variant="muted" weight="medium" color={showCommentInput ? colors.accent : undefined}>{comments.length}</Text>
        </Pressable>
        {/* ponytail: share is a dead button, like the original */}
        <Pressable style={st.btn} accessibilityLabel="Share">
          <Text>📤</Text>
        </Pressable>
      </Row>

      {(comments.length > 0 || showCommentInput) && (
        <View style={st.comments}>
          {visibleComments.map((c, i) => (
            <Row key={i} align="flex-start">
              <Avatar src={c.avatar} size="xs" />
              <Text variant="small" style={st.bubble}>
                <Text variant="small" weight="semibold">{c.user}  </Text>
                <Text variant="muted">{c.text}</Text>
              </Text>
            </Row>
          ))}

          {hiddenCount > 0 && !showAllComments && (
            <Pressable onPress={() => setShowAllComments(true)}>
              <Text variant="muted" color={colors.textDim} style={{ paddingVertical: space[1] }}>
                View {hiddenCount} more {hiddenCount === 1 ? 'comment' : 'comments'}
              </Text>
            </Pressable>
          )}

          {showCommentInput && (
            <Row style={{ paddingTop: space[1] }}>
              <Avatar src={currentUser.avatar} size="xs" />
              <TextInput
                autoFocus
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={addComment}
                placeholder="Add a comment…"
                placeholderTextColor={colors.textDim}
                returnKeyType="send"
                accessibilityLabel="Comment"
                style={st.commentInput}
              />
              <Button size="sm" onPress={addComment} disabled={!commentText.trim()}>Post</Button>
            </Row>
          )}
        </View>
      )}
    </Card>
  )
}

const overlay = { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)' }
const st = StyleSheet.create({
  post: { overflow: 'hidden', gap: 0 },
  tiny: { fontSize: 10 },

  who: { flex: 1, minWidth: 0, gap: 2 },
  handle: { fontSize: fs.xs, color: colors.textDim, fontWeight: fw.regular },
  typeTag: { fontSize: 10, backgroundColor: colors.accentSoft, paddingVertical: 1, paddingHorizontal: 6, borderRadius: radius.pill, overflow: 'hidden' },

  body: { paddingHorizontal: space[4], paddingBottom: space[3], gap: space[2] },

  play: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  arrow: { ...overlay, top: '50%', marginTop: -16, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 22, lineHeight: 24, marginTop: -2 },
  counter: { ...overlay, top: space[3], right: space[3], paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, overflow: 'hidden' },
  dots: { position: 'absolute', bottom: space[3], left: 0, right: 0, gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.38)' },
  dotActive: { width: 18, backgroundColor: '#fff' },

  section: { padding: space[4], borderTopWidth: 1, borderTopColor: colors.border, gap: space[3] },
  stats: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space[6], rowGap: space[3] },

  detailsToggle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: 1, borderTopColor: colors.border,
  },

  splits: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], height: 84 },
  split: { flex: 1, minWidth: 0, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  splitCol: { width: '100%', maxWidth: 28, backgroundColor: colors.surface2, borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  hrStrip: { flexDirection: 'row', gap: 2, height: 12, borderRadius: radius.pill, overflow: 'hidden' },
  hrDot: { width: 8, height: 8, borderRadius: 4 },

  pr: { fontSize: 10, letterSpacing: 0.5, backgroundColor: colors.accent, paddingVertical: 1, paddingHorizontal: 5, borderRadius: radius.pill, overflow: 'hidden' },
  track: { height: 4, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.textDim, borderRadius: radius.pill },

  actions: { paddingVertical: space[2], paddingHorizontal: space[4], borderTopWidth: 1, borderTopColor: colors.border },
  btn: { flexDirection: 'row', alignItems: 'center', gap: space[2], paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md },

  comments: { gap: space[2], paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgElevated },
  bubble: { flex: 1, backgroundColor: colors.surface2, borderRadius: radius.md, overflow: 'hidden', paddingVertical: space[2], paddingHorizontal: space[3] },
  commentInput: {
    flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill,
    paddingVertical: space[2], paddingHorizontal: space[3], color: colors.text, fontSize: fs.sm,
  },
})
