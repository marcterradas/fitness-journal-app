import { Image, View } from 'react-native'
import { colors } from '@/ui/theme'

// size: xs | sm | md | lg | xl | number. ring: none | accent | story
const AVATAR = { xs: 24, sm: 32, md: 40, lg: 64, xl: 96 }
export default function Avatar({ src, size = 'md', ring = 'none' }) {
  const d = AVATAR[size] || size
  const ringColor = ring === 'accent' ? colors.accent : ring === 'story' ? colors.mood : null
  return (
    <View style={ringColor && { borderWidth: 2, borderColor: ringColor, borderRadius: d, padding: 2 }}>
      <Image source={{ uri: src }} style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: colors.surface2 }} />
    </View>
  )
}
