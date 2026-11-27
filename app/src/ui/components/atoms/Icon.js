import Ionicons from '@expo/vector-icons/Ionicons'
import { colors } from '@/ui/theme'

// Old SVG icon names → Ionicons. Any Ionicons name also works.
const ICONS = {
  house: 'home', book: 'book', search: 'search', message: 'chatbubble-ellipses', user: 'person',
  bell: 'notifications', gear: 'settings', send: 'send', camera: 'camera', heart: 'heart',
  google: 'logo-google', apple: 'logo-apple', back: 'arrow-back', close: 'close',
}
export default function Icon({ name, size = 20, color = colors.text }) {
  return <Ionicons name={ICONS[name] || name} size={size} color={color} />
}
