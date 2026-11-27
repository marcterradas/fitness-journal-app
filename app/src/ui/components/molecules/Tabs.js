import { Pressable, View } from 'react-native'
import { colors, radius, space } from '@/ui/theme'
import Text from '../atoms/Text'

// Segmented pill tabs. tabs: [{ id, label }], value = selected id.
export default function Tabs({ tabs, value, onChange }) {
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', gap: space[1], padding: 4, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill }}
    >
      {tabs.map(t => {
        const on = value === t.id
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[{ flex: 1, padding: space[2], borderRadius: radius.pill, alignItems: 'center' }, on && { backgroundColor: colors.accent }]}
            onPress={() => onChange(t.id)}
          >
            <Text variant="muted" weight="semibold" color={on ? colors.accentInk : undefined}>{t.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}
