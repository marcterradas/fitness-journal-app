import { StyleSheet } from 'react-native'
import { colors, fs, fw, radius, space } from '@/ui/theme'

// Styles shared by the Journal sections.
export const js = StyleSheet.create({
  primary: { paddingVertical: space[3], paddingHorizontal: space[5], backgroundColor: colors.accent, borderRadius: radius.md, alignItems: 'center' },
  primaryText: { color: colors.accentInk, fontWeight: fw.semibold },
  eyebrow: { fontSize: fs.xs, color: colors.textDim, letterSpacing: 1, marginBottom: space[1] },
  sectionH: { fontSize: fs.md, fontWeight: fw.semibold, color: colors.textMuted },
  link: { color: colors.accent, fontSize: fs.sm, fontWeight: fw.medium },
  itemText: { color: colors.text, fontSize: fs.sm },
  itemMeta: { color: colors.textDim, fontSize: fs.sm },
})
