import { Pressable } from 'react-native'
import { space } from '@/ui/theme'
import Row from '../atoms/Row'
import Text from '../atoms/Text'

// Heading with optional right-side action link.
export default function SectionTitle({ children, action, onAction }) {
  return (
    <Row justify="space-between" style={{ marginTop: space[2] }}>
      <Text variant="h3">{children}</Text>
      {!!action && <Pressable onPress={onAction} accessibilityRole="button"><Text variant="link">{action}</Text></Pressable>}
    </Row>
  )
}
