import { Text, View } from 'react-native'
import { colors, fs, fw, radius, sport } from '@/ui/theme'

// Small colored label. tone: neutral | accent | success | warning | danger | mood | <sport id>
const TONE = { neutral: colors.textMuted, accent: colors.accent, success: colors.success, warning: colors.warning, danger: colors.danger, mood: colors.mood, ...sport }
export default function Badge({ children, tone = 'neutral', icon }) {
  const c = TONE[tone] || colors.textMuted
  return (
    <View style={{ alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill, backgroundColor: c + '22' }}>
      <Text style={{ color: c, fontSize: fs.xs, fontWeight: fw.semibold }}>{icon ? `${icon} ` : ''}{children}</Text>
    </View>
  )
}
