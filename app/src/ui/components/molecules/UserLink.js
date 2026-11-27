import { Link } from 'expo-router'
import { colors, fw } from '@/ui/theme'
import Text from '../atoms/Text'

// A person's name/@handle that opens their profile (/u/<handle>; that route redirects to /profile when it's me).
// user: user object or handle string.
export default function UserLink({ user, children, style }) {
  const handle = (typeof user === 'string' ? user : user?.username || '').replace(/^@/, '')
  const textStyle = [{ color: colors.text, fontWeight: fw.semibold }, style]
  if (!handle) return <Text style={textStyle}>{children}</Text>
  return <Link href={`/u/${handle}`} style={textStyle}>{children ?? `@${handle}`}</Link>
}
