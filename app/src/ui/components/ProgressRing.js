import { StyleSheet, View } from 'react-native'
import { colors } from '@/ui/theme'

// Circular progress without SVG: two clipped halves, each holding a ring whose
// top+right borders (a 180° arc) are rotated into view.
// ponytail: square line caps, no animation. Upgrade: react-native-svg if ever installed.
export default function ProgressRing({ value, size = 96, stroke = 8, color = colors.accent, trackColor = colors.surface2, children }) {
  const p = Math.max(0, Math.min(1, value))
  const half = size / 2
  const arc = (rot, left) => (
    <View
      style={{
        position: 'absolute', left, top: 0, width: size, height: size, borderRadius: half, borderWidth: stroke,
        borderColor: 'transparent', borderTopColor: color, borderRightColor: color,
        transform: [{ rotate: `${rot}deg` }],
      }}
    />
  )
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: half, borderWidth: stroke, borderColor: trackColor }]} />
      {/* right half: 0 → 180° */}
      <View style={{ position: 'absolute', left: half, top: 0, width: half, height: size, overflow: 'hidden' }}>
        {arc(-135 + 360 * Math.min(p, 0.5), -half)}
      </View>
      {/* left half: 180 → 360° */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: half, height: size, overflow: 'hidden' }}>
        {arc(45 + 360 * Math.max(0, p - 0.5), 0)}
      </View>
      <View style={{ alignItems: 'center' }}>{children}</View>
    </View>
  )
}
