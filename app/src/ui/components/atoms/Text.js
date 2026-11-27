import { Text as RNText } from 'react-native'
import { colors, fs, fw } from '@/ui/theme'

// Every piece of copy goes through this. Pick a `variant`; `color`/`weight`/`align` tweak it.
// variant: h1 | h2 | h3 | body | small | muted | dim | label | overline | link
const VARIANTS = {
  h1: { color: colors.text, fontSize: fs.xxl, fontWeight: fw.bold, letterSpacing: -0.5 },
  h2: { color: colors.text, fontSize: fs.xl, fontWeight: fw.bold },
  h3: { color: colors.text, fontSize: fs.lg, fontWeight: fw.bold },
  body: { color: colors.text, fontSize: fs.md },
  small: { color: colors.text, fontSize: fs.sm },
  muted: { color: colors.textMuted, fontSize: fs.sm },
  dim: { color: colors.textDim, fontSize: fs.xs },
  label: { color: colors.textMuted, fontSize: fs.sm, fontWeight: fw.medium },
  overline: { color: colors.textDim, fontSize: fs.xs, fontWeight: fw.semibold, letterSpacing: 0.8, textTransform: 'uppercase' },
  link: { color: colors.accent, fontSize: fs.sm, fontWeight: fw.semibold },
}

export default function Text({ variant = 'body', color, weight, align, style, ...props }) {
  return (
    <RNText
      style={[VARIANTS[variant], color && { color }, weight && { fontWeight: fw[weight] }, align && { textAlign: align }, style]}
      {...props}
    />
  )
}
