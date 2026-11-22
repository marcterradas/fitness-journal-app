// Shared primitives, ported from the old Vue components (Avatar, Button, Card, Chip, Badge,
// Input, EmptyState, Stat, Icon, UserLink, NavBar). One file on purpose: they are tiny.
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors, fs, fw, layoutMax, radius, space, sport } from '@/ui/theme'
import { currentUser } from '@/api/mock/data/user'

// Old SVG icon names → Ionicons.
const ICONS = {
  house: 'home', book: 'book', search: 'search', message: 'chatbubble-ellipses', user: 'person',
  bell: 'notifications', gear: 'settings', send: 'send', camera: 'camera', heart: 'heart',
  google: 'logo-google', apple: 'logo-apple',
}
export function Icon({ name, size = 20, color = colors.text }) {
  return <Ionicons name={ICONS[name] || name} size={size} color={color} />
}

// Scrollable page body with safe area + centered max-width column (web/tablet).
export function Screen({ children, scroll = true, edges = ['top'], style }) {
  const Body = scroll ? ScrollView : View
  const bodyProps = scroll
    ? { contentContainerStyle: [s.screenInner, style], keyboardShouldPersistTaps: 'handled' }
    : { style: [s.screenInner, { flex: 1 }, style] }
  return (
    <SafeAreaView edges={edges} style={s.screen}>
      <Body {...bodyProps}>{children}</Body>
    </SafeAreaView>
  )
}

// Top bar: brand + notifications + settings (old NavBar.vue).
export function AppHeader() {
  return (
    <View style={s.header}>
      <Pressable onPress={() => router.navigate('/')} style={s.row}>
        <View style={s.logo}><Text style={s.logoText}>JF</Text></View>
        <Text style={s.brand}>Journal Fit</Text>
      </Pressable>
      <View style={s.row}>
        <Pressable onPress={() => router.push('/notifications')} style={s.iconBtn} accessibilityLabel="Notifications">
          <Icon name="bell" />
          <View style={s.dot} />
        </Pressable>
        <Pressable onPress={() => router.push('/settings')} style={s.iconBtn} accessibilityLabel="Settings">
          <Icon name="gear" />
        </Pressable>
      </View>
    </View>
  )
}

const AVATAR = { xs: 24, sm: 32, md: 40, lg: 64, xl: 96 }
export function Avatar({ src, size = 'md', ring = 'none' }) {
  const d = AVATAR[size] || size
  const ringColor = ring === 'accent' ? colors.accent : ring === 'story' ? colors.mood : null
  return (
    <View style={ringColor && { borderWidth: 2, borderColor: ringColor, borderRadius: d, padding: 2 }}>
      <Image source={{ uri: src }} style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: colors.surface2 }} />
    </View>
  )
}

const BTN = {
  primary: { bg: colors.accent, fg: colors.accentInk },
  secondary: { bg: colors.surface2, fg: colors.text },
  ghost: { bg: 'transparent', fg: colors.text },
  danger: { bg: 'rgba(248,113,113,0.14)', fg: colors.danger },
}
const BTN_SIZE = { sm: [6, 12, fs.sm], md: [10, 16, fs.md], lg: [14, 20, fs.lg] }
export function Button({ children, onPress, variant = 'primary', size = 'md', disabled, style }) {
  const v = BTN[variant]; const [py, px, f] = BTN_SIZE[size]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, { backgroundColor: v.bg, paddingVertical: py, paddingHorizontal: px, opacity: pressed || disabled ? 0.7 : 1 }, style]}
    >
      {typeof children === 'string'
        ? <Text style={{ color: v.fg, fontSize: f, fontWeight: fw.semibold }}>{children}</Text>
        : children}
    </Pressable>
  )
}

const CARD_P = { none: 0, sm: space[3], md: space[4], lg: space[6] }
const CARD_V = {
  surface: { backgroundColor: colors.surface, borderColor: colors.border },
  elevated: { backgroundColor: colors.bgElevated, borderColor: colors.borderStrong },
  ghost: { backgroundColor: 'transparent', borderColor: colors.border },
  accent: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
}
export function Card({ children, padding = 'md', variant = 'surface', style }) {
  return <View style={[s.card, CARD_V[variant], { padding: CARD_P[padding] }, style]}>{children}</View>
}

export function Chip({ children, active, onPress, size = 'md' }) {
  const small = size === 'sm'
  return (
    <Pressable onPress={onPress} style={[s.chip, small && { paddingVertical: 4, paddingHorizontal: 10 }, active && s.chipActive]}>
      <Text style={{ color: active ? colors.accentInk : colors.textMuted, fontSize: small ? fs.xs : fs.sm, fontWeight: fw.semibold }}>
        {children}
      </Text>
    </Pressable>
  )
}

const TONE = { neutral: colors.textMuted, accent: colors.accent, success: colors.success, warning: colors.warning, danger: colors.danger, mood: colors.mood, ...sport }
export function Badge({ children, tone = 'neutral', icon }) {
  const c = TONE[tone] || colors.textMuted
  return (
    <View style={[s.badge, { backgroundColor: c + '22' }]}>
      <Text style={{ color: c, fontSize: fs.xs, fontWeight: fw.semibold }}>{icon ? `${icon} ` : ''}{children}</Text>
    </View>
  )
}

export function Input({ label, error, style, ...props }) {
  return (
    <View style={{ gap: space[1] }}>
      {!!label && <Text style={s.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textDim}
        style={[s.input, error && { borderColor: colors.danger }, style]}
        {...props}
      />
      {!!error && <Text style={{ color: colors.danger, fontSize: fs.xs }}>{error}</Text>}
    </View>
  )
}

export function EmptyState({ icon = '🌱', title = 'Nothing yet', description, children }) {
  return (
    <View style={s.empty}>
      <Text style={{ fontSize: 40 }}>{icon}</Text>
      <Text style={s.h3}>{title}</Text>
      {!!description && <Text style={[s.muted, { textAlign: 'center' }]}>{description}</Text>}
      {children}
    </View>
  )
}

export function Stat({ value, label, icon, align = 'center' }) {
  return (
    <View style={{ alignItems: align === 'center' ? 'center' : 'flex-start', gap: 2 }}>
      {!!icon && <Text>{icon}</Text>}
      <Text style={{ color: colors.text, fontSize: fs.lg, fontWeight: fw.bold }}>{value}</Text>
      <Text style={{ color: colors.textDim, fontSize: fs.xs }}>{label}</Text>
    </View>
  )
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <View style={[s.row, { justifyContent: 'space-between', marginTop: space[2] }]}>
      <Text style={s.h3}>{children}</Text>
      {!!action && <Pressable onPress={onAction}><Text style={{ color: colors.accent, fontSize: fs.sm }}>{action}</Text></Pressable>}
    </View>
  )
}

// A person's name/@handle that opens their profile. My own handle → /profile.
export function UserLink({ user, children, style }) {
  const handle = (typeof user === 'string' ? user : user?.username || '').replace(/^@/, '')
  const textStyle = [{ color: colors.text, fontWeight: fw.semibold }, style]
  if (!handle) return <Text style={textStyle}>{children}</Text>
  const href = handle === currentUser.username ? '/profile' : `/u/${handle}`
  return <Link href={href} style={textStyle}>{children ?? `@${handle}`}</Link>
}

// Floating message at the bottom; pair with useToast().
export function Toast({ message }) {
  if (!message) return null
  return (
    <View style={[s.toast, { pointerEvents: 'none' }]}>
      <Text style={s.toastText}>{message}</Text>
    </View>
  )
}

// Segmented pill tabs. tabs: [{ id, label }]
export function Tabs({ tabs, value, onChange }) {
  return (
    <View style={s.tabs} accessibilityRole="tablist">
      {tabs.map(t => (
        <Pressable
          key={t.id}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === t.id }}
          style={[s.tab, value === t.id && s.tabActive]}
          onPress={() => onChange(t.id)}
        >
          <Text style={[s.tabText, value === t.id && { color: colors.accentInk }]}>{t.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

// Common text styles, reuse via `import { s as ui } from '@/ui/components/ui'`.
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenInner: { width: '100%', maxWidth: layoutMax, alignSelf: 'center', padding: space[4], gap: space[3], paddingBottom: space[10] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  h1: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.black },
  h2: { color: colors.text, fontSize: fs.xl, fontWeight: fw.bold },
  h3: { color: colors.text, fontSize: fs.lg, fontWeight: fw.bold },
  body: { color: colors.text, fontSize: fs.md },
  muted: { color: colors.textMuted, fontSize: fs.sm },
  dim: { color: colors.textDim, fontSize: fs.xs },
  label: { color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.medium },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: space[3], borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: colors.accentInk, fontWeight: fw.black },
  brand: { color: colors.text, fontSize: fs.lg, fontWeight: fw.bold },
  iconBtn: { padding: space[2] },
  dot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mood },

  btn: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: space[2] },
  card: { borderRadius: radius.lg, borderWidth: 1, gap: space[3] },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  badge: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14, color: colors.text, fontSize: fs.md },
  empty: { alignItems: 'center', gap: space[2], padding: space[8] },
  toast: { position: 'absolute', bottom: space[4], alignSelf: 'center', backgroundColor: colors.text, paddingVertical: space[3], paddingHorizontal: space[5], borderRadius: radius.pill },
  toastText: { color: colors.bg, fontWeight: fw.semibold, fontSize: fs.sm },
  tabs: { flexDirection: 'row', gap: space[1], padding: 4, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  tab: { flex: 1, padding: space[2], borderRadius: radius.pill, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.semibold },
})
