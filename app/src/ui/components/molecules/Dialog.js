import { Modal, Pressable, ScrollView, View } from 'react-native'
import { colors, radius, space } from '@/ui/theme'
import IconButton from '../atoms/IconButton'
import Row from '../atoms/Row'
import Text from '../atoms/Text'

// Centered modal with header + scrollable body.
export default function Dialog({ open, onClose, title, sub, children }) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: space[4] }} onPress={onClose}>
        {/* Inner Pressable swallows taps so only the backdrop closes. */}
        <Pressable
          style={{ width: '100%', maxWidth: 560, maxHeight: '85%', backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' }}
          onPress={() => {}}
        >
          <Row gap={3} align="flex-start" style={{ padding: space[4], borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="h3">{title}</Text>
              {!!sub && <Text variant="dim">{sub}</Text>}
            </View>
            <IconButton icon="close" label="Close" size={28} onPress={onClose} />
          </Row>
          <ScrollView contentContainerStyle={{ padding: space[4], gap: space[3] }}>{children}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
