import { Pressable } from 'react-native'
import { colors } from '@/ui/theme'
import Icon from './Icon'

// Round tap target around an icon (back, close, header actions). `label` is required for a11y.
// variant: plain | filled
export default function IconButton({ icon, label, onPress, size = 36, variant = 'plain', children, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 },
        variant === 'filled' && { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {children ?? <Icon name={icon} />}
    </Pressable>
  )
}
