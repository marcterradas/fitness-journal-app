import { useRef, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Avatar, Badge, Card, UserLink } from '@/ui/components/ui'
import SportIcon from '@/ui/components/SportIcon'
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
      <View style={st.head}>
        <Pressable onPress={() => router.push(post.user.username === currentUser.username ? '/profile' : `/u/${post.user.username}`)}>
          <Avatar src={post.user.avatar} size="md" />
        </Pressable>
        <View style={st.who}>
          <Text numberOfLines={1}>
            <UserLink user={post.user}>{post.user.name}</UserLink>
            <Text style={st.dim}> · {post.when}</Text>
          </Text>
          <View style={st.row}>
            <UserLink user={post.user} style={st.handle}>@{post.user.username}</UserLink>
            {post.type === 'workout' && <Text style={st.typeTag}>WORKOUT</Text>}
          </View>
        </View>
        {!!post.sport && <SportIcon sport={post.sport} size="sm" />}
      </View>

      {!!(post.title || post.text || post.badge) && (
        <View style={st.body}>
          {!!post.title && <Text style={st.title}>{post.title}</Text>}
          {!!post.text && <Text style={st.text}>{post.text}</Text>}
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
                  <Text style={st.arrowText}>‹</Text>
                </Pressable>
              )}
              {activeMedia < media.length - 1 && (
                <Pressable style={[st.arrow, { right: space[3] }]} onPress={() => goToMedia(activeMedia + 1)} accessibilityLabel="Next">
                  <Text style={st.arrowText}>›</Text>
                </Pressable>
              )}
              <Text style={st.counter}>{activeMedia + 1}/{media.length}</Text>
              <View style={st.dots}>
                {media.map((_, i) => (
                  <Pressable key={i} onPress={() => goToMedia(i)} style={[st.dot, i === activeMedia && st.dotActive]} />
                ))}
              </View>
            </>
          )}
        </View>
      )}

      {stats.length > 0 && (
        <View style={[st.section, st.stats]}>
          {stats.map(([v, l]) => (
            <View key={l}>
              <Text style={st.statV}>{v}</Text>
              <Text style={st.statL}>{l}</Text>
            </View>
          ))}
        </View>
      )}

      {detailBits.length > 0 && (
        <Pressable style={st.detailsToggle} onPress={() => setShowDetails(!showDetails)} accessibilityState={{ expanded: showDetails }}>
          <Text style={st.detailsText}>{detailBits.join(' · ')}</Text>
          <Text style={st.detailsText}>{showDetails ? '▴' : '▾'}</Text>
        </Pressable>
      )}

      {showDetails && splits.length > 0 && (
        <View style={st.section}>
          <View style={st.chartHead}>
            <Text style={st.chartTitle}>Splits</Text>
            <Text style={st.dim}>fastest {fastestSplit.pace} /km</Text>
          </View>
          <View style={st.splits}>
            {splits.map(s => (
              <View key={s.km} style={st.split}>
                {s.fastest && <Text style={st.splitPace}>{s.pace}</Text>}
                <View style={[st.splitCol, s.fastest && { backgroundColor: colors.accent }, { height: `${s.pct * 0.7}%` }]} />
                <Text style={st.splitKm}>{s.km}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {showDetails && hrZones.length > 0 && (
        <View style={st.section}>
          <View style={st.chartHead}>
            <Text style={st.chartTitle}>Heart rate</Text>
            <Text style={st.dim}>avg {post.hr.avg} · max {post.hr.max} bpm</Text>
          </View>
          <View style={st.hrStrip}>
            {hrZones.filter(z => z.min > 0).map(z => (
              <View key={z.z} style={{ flex: z.pct, minWidth: 4, backgroundColor: z.color }} />
            ))}
          </View>
          <View style={st.hrLegend}>
            {hrZones.map(z => (
              <View key={z.z} style={[st.row, { gap: 4 }, z.min === 0 && { opacity: 0.4 }]}>
                <View style={[st.hrDot, { backgroundColor: z.color }]} />
                <Text style={st.hrZ}>Z{z.z}</Text>
                <Text style={st.dim}>{z.min}m</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {showDetails && exercises.length > 0 && (
        <View style={st.section}>
          <View style={st.chartHead}>
            <Text style={st.chartTitle}>Exercises</Text>
            {totalVolumeKg > 0 && <Text style={st.dim}>{totalVolumeKg.toLocaleString()} kg total</Text>}
          </View>
          {exercises.map(ex => (
            <View key={ex.name} style={{ gap: 5 }}>
              <View style={st.row}>
                <Text style={st.exName}>{ex.name}</Text>
                {ex.pr && <Text style={st.pr}>PR</Text>}
                <Text style={st.dim}>{ex.sets}×{ex.reps}{ex.weightKg ? ` · ${ex.weightKg} kg` : ''}</Text>
              </View>
              <View style={st.track}>
                <View style={[st.bar, ex.pr && { backgroundColor: colors.accent }, { width: `${ex.pct}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={st.actions}>
        <Pressable style={st.btn} onPress={toggleKudos} accessibilityLabel="Give kudos">
          <Text style={st.btnIcon}>{liked ? '💚' : '🤍'}</Text>
          <Text style={[st.btnCount, liked && { color: colors.accent }]}>{kudos}</Text>
        </Pressable>
        <Pressable style={st.btn} onPress={() => setShowCommentInput(!showCommentInput)} accessibilityLabel="Comment">
          <Text style={st.btnIcon}>💬</Text>
          <Text style={[st.btnCount, showCommentInput && { color: colors.accent }]}>{comments.length}</Text>
        </Pressable>
        {/* ponytail: share is a dead button, like the original */}
        <Pressable style={st.btn} accessibilityLabel="Share">
          <Text style={st.btnIcon}>📤</Text>
        </Pressable>
      </View>

      {(comments.length > 0 || showCommentInput) && (
        <View style={st.comments}>
          {visibleComments.map((c, i) => (
            <View key={i} style={st.comment}>
              <Avatar src={c.avatar} size="xs" />
              <Text style={st.bubble}>
                <Text style={st.commentName}>{c.user}  </Text>
                <Text style={st.commentText}>{c.text}</Text>
              </Text>
            </View>
          ))}

          {hiddenCount > 0 && !showAllComments && (
            <Pressable onPress={() => setShowAllComments(true)}>
              <Text style={st.more}>View {hiddenCount} more {hiddenCount === 1 ? 'comment' : 'comments'}</Text>
            </Pressable>
          )}

          {showCommentInput && (
            <View style={[st.row, { paddingTop: space[1] }]}>
              <Avatar src={currentUser.avatar} size="xs" />
              <TextInput
                autoFocus
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={addComment}
                placeholder="Add a comment…"
                placeholderTextColor={colors.textDim}
                returnKeyType="send"
                style={st.commentInput}
              />
              <Pressable onPress={addComment} disabled={!commentText.trim()} style={[st.submit, !commentText.trim() && { opacity: 0.35 }]}>
                <Text style={st.submitText}>Post</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </Card>
  )
}

const overlay = { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)' }
const st = StyleSheet.create({
  post: { overflow: 'hidden', gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  dim: { fontSize: fs.xs, color: colors.textDim },

  head: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4] },
  who: { flex: 1, minWidth: 0, gap: 2 },
  handle: { fontSize: fs.xs, color: colors.textDim, fontWeight: fw.regular },
  typeTag: {
    fontSize: 10, fontWeight: fw.semibold, letterSpacing: 0.7, color: colors.accent, backgroundColor: colors.accentSoft,
    paddingVertical: 1, paddingHorizontal: 6, borderRadius: radius.pill, overflow: 'hidden',
  },

  body: { paddingHorizontal: space[4], paddingBottom: space[3], gap: space[2] },
  title: { fontSize: fs.lg, fontWeight: fw.semibold, color: colors.text },
  text: { color: colors.text, fontSize: fs.md, lineHeight: 24 },

  play: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  arrow: { ...overlay, top: '50%', marginTop: -16, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: '#fff', fontSize: 22, lineHeight: 24, marginTop: -2 },
  counter: {
    ...overlay, top: space[3], right: space[3], color: '#fff', fontSize: fs.xs, fontWeight: fw.medium,
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, overflow: 'hidden',
  },
  dots: { position: 'absolute', bottom: space[3], left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.38)' },
  dotActive: { width: 18, backgroundColor: '#fff' },

  section: { padding: space[4], borderTopWidth: 1, borderTopColor: colors.border, gap: space[3] },
  stats: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space[6], rowGap: space[3] },
  statV: { fontSize: fs.lg, fontWeight: fw.bold, color: colors.text },
  statL: { fontSize: fs.xs, color: colors.textDim, textTransform: 'uppercase', letterSpacing: 0.7 },

  detailsToggle: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: 1, borderTopColor: colors.border,
  },
  detailsText: { color: colors.textDim, fontSize: fs.xs, textTransform: 'uppercase', letterSpacing: 0.6 },

  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  chartTitle: { fontSize: fs.xs, fontWeight: fw.semibold, textTransform: 'uppercase', letterSpacing: 0.8, color: colors.textDim },

  splits: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], height: 84 },
  split: { flex: 1, minWidth: 0, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  splitCol: { width: '100%', maxWidth: 28, backgroundColor: colors.surface2, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  splitPace: { fontSize: 10, fontWeight: fw.semibold, color: colors.accent },
  splitKm: { fontSize: 10, color: colors.textDim },

  hrStrip: { flexDirection: 'row', gap: 2, height: 12, borderRadius: radius.pill, overflow: 'hidden' },
  hrLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  hrDot: { width: 8, height: 8, borderRadius: 4 },
  hrZ: { fontSize: fs.xs, fontWeight: fw.semibold, color: colors.textMuted },

  exName: { flex: 1, minWidth: 0, fontSize: fs.sm, fontWeight: fw.medium, color: colors.text },
  pr: {
    fontSize: 10, fontWeight: fw.bold, letterSpacing: 0.5, color: colors.accentInk, backgroundColor: colors.accent,
    paddingVertical: 1, paddingHorizontal: 5, borderRadius: radius.pill, overflow: 'hidden',
  },
  track: { height: 4, backgroundColor: colors.surface2, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.textDim, borderRadius: radius.pill },

  actions: { flexDirection: 'row', gap: space[2], paddingVertical: space[2], paddingHorizontal: space[4], borderTopWidth: 1, borderTopColor: colors.border },
  btn: { flexDirection: 'row', alignItems: 'center', gap: space[2], paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.md },
  btnIcon: { fontSize: fs.md },
  btnCount: { fontSize: fs.sm, fontWeight: fw.medium, color: colors.textMuted },

  comments: { gap: space[2], paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgElevated },
  comment: { flexDirection: 'row', alignItems: 'flex-start', gap: space[2] },
  bubble: {
    flex: 1, backgroundColor: colors.surface2, borderRadius: radius.md, overflow: 'hidden',
    paddingVertical: space[2], paddingHorizontal: space[3], fontSize: fs.sm,
  },
  commentName: { fontWeight: fw.semibold, color: colors.text },
  commentText: { color: colors.textMuted },
  more: { color: colors.textDim, fontSize: fs.sm, paddingVertical: space[1] },
  commentInput: {
    flex: 1, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill,
    paddingVertical: space[2], paddingHorizontal: space[3], color: colors.text, fontSize: fs.sm,
  },
  submit: { backgroundColor: colors.accent, borderRadius: radius.pill, paddingVertical: space[2], paddingHorizontal: space[3] },
  submitText: { color: colors.accentInk, fontSize: fs.sm, fontWeight: fw.semibold },
})
