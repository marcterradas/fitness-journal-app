import { View } from 'react-native'
import { space } from '@/ui/theme'

// Horizontal stack. gap: theme space key. align/justify: flexbox values.
export default function Row({ gap = 2, align = 'center', justify, wrap, style, ...props }) {
  return (
    <View
      style={[{ flexDirection: 'row', alignItems: align, justifyContent: justify, gap: space[gap] ?? gap }, wrap && { flexWrap: 'wrap' }, style]}
      {...props}
    />
  )
}
