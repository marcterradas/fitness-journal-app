// The API port: the only door from the frontend to data. Screens call `api.<resource>.<method>()`
// and never import fixtures. Every method is async and returns plain JSON, like HTTP would.
//
// Adapters implementing it:
//   api/mock/  fake server on in-memory fixtures (now)
//   api/http/  fetch() against the real backend (soon) — same resources, same method names
//
// Contract (keep both adapters in sync with this list):
//   me            get() · update(patch)
//   users         get(handle) · workouts(handle) · posts(handle) · suggestions()
//   journal       list() · create(entry) · progress()
//   saved         list() · add(workout) · remove(id)
//   plans         today() · week() · setDay(dayId, workout | null)
//   feed          posts() · stories() · challenges() · quote()
//   leaderboard   friends() · global()
//   reviews       queue() · stats() · vote(id, verdict)
//   exercises     list() · plans()
//   notifications list() · markRead(id) · markAllRead()
//   messages      conversations() · send(conversationId, text)
import * as mock from './mock/index.js'

export const api = mock
