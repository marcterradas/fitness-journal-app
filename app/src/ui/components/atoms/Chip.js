import { Pressable, Text } from 'react-native'
import { colors, fs, fw, radius } from '@/ui/theme'

// Selectable pill. size: sm | md
export default function Chip({ children, active, onPress, size = 'md' }) {
  const small = size === 'sm'
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[
        { paddingVertical: small ? 4 : 6, paddingHorizontal: small ? 10 : 14, borderRadius: radius.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
        active && { backgroundColor: colors.accent, borderColor: colors.accent },
      ]}
    >
      <Text style={{ color: active ? colors.accentInk : colors.textMuted, fontSize: small ? fs.xs : fs.sm, fontWeight: fw.semibold }}>
        {children}
      </Text>
    </Pressable>
  )
}
