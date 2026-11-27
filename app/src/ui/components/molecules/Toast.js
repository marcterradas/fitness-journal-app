import { View } from 'react-native'
import { colors, radius, space } from '@/ui/theme'
import Text from '../atoms/Text'

// Floating message at the bottom; pair with useToast(). Pass children (e.g. a Link) instead of message to make it tappable.
export default function Toast({ message, children }) {
  if (!message && !children) return null
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ position: 'absolute', bottom: space[4], alignSelf: 'center', backgroundColor: colors.text, paddingVertical: space[3], paddingHorizontal: space[5], borderRadius: radius.pill, pointerEvents: children ? 'auto' : 'none' }}
    >
      <Text variant="small" weight="semibold" color={colors.bg}>{children ?? message}</Text>
    </View>
  )
}
