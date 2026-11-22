import { FollowSuggestions } from '@/ui/components/FollowSuggestionsForYou'

const USERS = [
  { id: 1, name: 'Isabella Cruz', username: 'isabella_cycle', avatar: 'https://i.pravatar.cc/150?u=isabella' },
  { id: 2, name: 'Lucas Kim', username: 'lucas_lifts', avatar: 'https://i.pravatar.cc/150?u=lucas' },
  { id: 3, name: 'Charlotte Young', username: 'charlotte_y', avatar: 'https://i.pravatar.cc/150?u=charlotte' },
  { id: 4, name: 'Benjamin Hall', username: 'benji_balance', avatar: 'https://i.pravatar.cc/150?u=benjamin' },
]

export default function FollowSuggestionsTopAthletes() {
  return <FollowSuggestions title="Suggested top athletes" users={USERS} />
}
