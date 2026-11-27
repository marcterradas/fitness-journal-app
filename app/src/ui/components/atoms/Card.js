import { View } from 'react-native'
import { colors, radius, space } from '@/ui/theme'

// padding: none | sm | md | lg. variant: surface | elevated | ghost | accent
const PAD = { none: 0, sm: space[3], md: space[4], lg: space[6] }
const VARIANT = {
  surface: { backgroundColor: colors.surface, borderColor: colors.border },
  elevated: { backgroundColor: colors.bgElevated, borderColor: colors.borderStrong },
  ghost: { backgroundColor: 'transparent', borderColor: colors.border },
  accent: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
}
export default function Card({ children, padding = 'md', variant = 'surface', style }) {
  return (
    <View style={[{ borderRadius: radius.lg, borderWidth: 1, gap: space[3], padding: PAD[padding] }, VARIANT[variant], style]}>
      {children}
    </View>
  )
}
