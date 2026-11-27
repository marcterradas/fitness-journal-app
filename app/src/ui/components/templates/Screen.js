import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, layoutMax, space } from '@/ui/theme'

// Page shell: safe area + centered max-width column (web/tablet). scroll=false for fixed layouts.
export default function Screen({ children, scroll = true, edges = ['top'], style }) {
  const inner = { width: '100%', maxWidth: layoutMax, alignSelf: 'center', padding: space[4], gap: space[3], paddingBottom: space[10] }
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.bg }}>
      {scroll
        ? <ScrollView contentContainerStyle={[inner, style]} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        : <View style={[inner, { flex: 1 }, style]}>{children}</View>}
    </SafeAreaView>
  )
}
