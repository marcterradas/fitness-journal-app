// Design tokens, ported 1:1 from the old Vue main.css (rem → px, 1rem = 16).
export const colors = {
  bg: '#0b0d10',
  bgElevated: '#14171c',
  surface: '#1b1f26',
  surface2: '#232831',
  surfaceHover: '#2a3140',
  border: '#2a2f38',
  borderStrong: '#3a414d',

  text: '#f4f6fa',
  textMuted: '#a4abb8',
  textDim: '#6e7684',

  accent: '#b6f36b',
  accentSoft: 'rgba(182, 243, 107, 0.12)',
  accentInk: '#0b1500',
  secondary: '#6ea8ff',
  secondarySoft: 'rgba(110, 168, 255, 0.14)',

  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  rest: '#c084fc',
  mood: '#fb7185',
}

export const sport = {
  strength: '#fb923c',
  cardio: '#f87171',
  yoga: '#c084fc',
  cycling: '#38bdf8',
  running: '#4ade80',
  swimming: '#22d3ee',
}

export const fs = { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, xxxl: 36 }
export const fw = { regular: '400', medium: '500', semibold: '600', bold: '700', black: '800' }
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 }
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 }

// Content column max width on web/tablet.
export const layoutMax = 720

export const sportColor = id => sport[id] || colors.accent
