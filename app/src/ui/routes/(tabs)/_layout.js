import { Tabs } from 'expo-router'
import { Icon } from '@/ui/components/ui'
import { colors } from '@/ui/theme'

// Bottom tabs = old Footer.vue. Other routes (settings, workout, u/[handle]...) are stack screens on top.
const TABS = [
  ['index', 'Home', 'house'],
  ['journal', 'Journal', 'book'],
  ['search', 'Explore', 'search'],
  ['messages', 'Chat', 'message'],
  ['profile', 'Me', 'user'],
]

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {TABS.map(([name, title, icon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title, tabBarIcon: ({ color, size }) => <Icon name={icon} color={color} size={size} /> }}
        />
      ))}
    </Tabs>
  )
}
