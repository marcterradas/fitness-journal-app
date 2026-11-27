import { View } from 'react-native'
import Text from '../atoms/Text'

// Big number + caption. align: center | start
export default function Stat({ value, label, icon, align = 'center' }) {
  return (
    <View style={{ alignItems: align === 'center' ? 'center' : 'flex-start', gap: 2 }}>
      {!!icon && <Text>{icon}</Text>}
      <Text variant="h3">{value}</Text>
      <Text variant="dim">{label}</Text>
    </View>
  )
}
