import { View } from 'react-native'
import { space } from '@/ui/theme'
import Text from '../atoms/Text'

// Placeholder for empty lists. children = optional call to action.
export default function EmptyState({ icon = '🌱', title = 'Nothing yet', description, children }) {
  return (
    <View style={{ alignItems: 'center', gap: space[2], padding: space[8] }}>
      <Text style={{ fontSize: 40 }}>{icon}</Text>
      <Text variant="h3">{title}</Text>
      {!!description && <Text variant="muted" align="center">{description}</Text>}
      {children}
    </View>
  )
}
