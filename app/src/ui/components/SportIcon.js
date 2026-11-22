import { Text, View } from 'react-native'
import { sportOf } from '@/domain/catalog'
import { radius, sportColor } from '@/ui/theme'

const SIZE = { sm: [28, 14], md: [40, 18], lg: [48, 22] }

export default function SportIcon({ sport, size = 'md' }) {
  const emoji = sportOf(sport)?.emoji || '🏃'
  const [d, f] = SIZE[size]
  return (
    <View style={{ width: d, height: d, borderRadius: radius.md, backgroundColor: sportColor(sport) + '2e', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: f }}>{emoji}</Text>
    </View>
  )
}
