import { Pressable, Text } from 'react-native'
import { colors, fs, fw, radius, space } from '@/ui/theme'

// variant: primary | secondary | ghost | danger. size: sm | md | lg. String children get styled text.
const BTN = {
  primary: { bg: colors.accent, fg: colors.accentInk },
  secondary: { bg: colors.surface2, fg: colors.text },
  ghost: { bg: 'transparent', fg: colors.text },
  danger: { bg: 'rgba(248,113,113,0.14)', fg: colors.danger },
}
const SIZE = { sm: [6, 12, fs.sm], md: [10, 16, fs.md], lg: [14, 20, fs.lg] }
export default function Button({ children, onPress, variant = 'primary', size = 'md', disabled, style }) {
  const v = BTN[variant]; const [py, px, f] = SIZE[size]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: space[2] },
        { backgroundColor: v.bg, paddingVertical: py, paddingHorizontal: px, opacity: pressed || disabled ? 0.7 : 1 },
        style,
      ]}
    >
      {typeof children === 'string'
        ? <Text style={{ color: v.fg, fontSize: f, fontWeight: fw.semibold }}>{children}</Text>
        : children}
    </Pressable>
  )
}
