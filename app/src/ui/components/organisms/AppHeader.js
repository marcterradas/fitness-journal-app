import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { colors, radius, space } from '@/ui/theme'
import Icon from '../atoms/Icon'
import IconButton from '../atoms/IconButton'
import Row from '../atoms/Row'
import Text from '../atoms/Text'

// Top bar: brand + notifications + settings (old NavBar.vue).
// ponytail: navigates with expo-router directly; for Storybook mock expo-router (or add onPress props then).
export default function AppHeader() {
  return (
    <Row justify="space-between" style={{ paddingBottom: space[3], borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Pressable onPress={() => router.navigate('/')} accessibilityRole="link" accessibilityLabel="Home">
        <Row>
          <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text weight="black" color={colors.accentInk}>JF</Text>
          </View>
          <Text variant="h3">Journal Fit</Text>
        </Row>
      </Pressable>
      <Row gap={0}>
        <IconButton label="Notifications" onPress={() => router.push('/notifications')}>
          <Icon name="bell" />
          <View style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mood }} />
        </IconButton>
        <IconButton icon="gear" label="Settings" onPress={() => router.push('/settings')} />
      </Row>
    </Row>
  )
}
