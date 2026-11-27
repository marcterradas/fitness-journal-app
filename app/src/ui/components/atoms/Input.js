import { Text, TextInput, View } from 'react-native'
import { colors, fs, fw, radius, space } from '@/ui/theme'

// Text field with optional label + error. Other props go to TextInput.
export default function Input({ label, error, style, ...props }) {
  return (
    <View style={{ gap: space[1] }}>
      {!!label && <Text style={{ color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.medium }}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textDim}
        accessibilityLabel={label}
        style={[
          { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14, color: colors.text, fontSize: fs.md },
          error && { borderColor: colors.danger },
          style,
        ]}
        {...props}
      />
      {!!error && <Text style={{ color: colors.danger, fontSize: fs.xs }}>{error}</Text>}
    </View>
  )
}
