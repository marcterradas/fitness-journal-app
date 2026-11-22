// Mock adapter: implements the contract in api/index.js on top of ./data fixtures.
// ponytail: state lives in module memory — survives navigation, resets on reload.
import { newId, respond } from './server.js'
import { currentUser, friends } from './data/user.js'
import { exerciseProgress, journalEntries, todayWorkout } from './data/workouts.js'
import { savedWorkouts } from './data/saved.js'
import { weeklyTemplates } from './data/templates.js'
import { challenges, feedPosts, motivationalQuotes, stories, userPosts } from './data/social.js'
import { friendsBoard, globalBoard, reviewQueue } from './data/leaderboard.js'
import { exercises as exerciseList, workoutPlans } from './data/exercises.js'
import { notifications as notificationList } from './data/notifications.js'
import { conversations as conversationList } from './data/conversations.js'
import { personOf } from './data/directory.js'
import { workoutsOf } from './data/publicWorkouts.js'
import { myVote, vote as castVote, reviewedCount } from './reviewsStore.js'

const nowTime = () => new Date().toTimeString().slice(0, 5)

export const me = {
  get: () => respond(currentUser),
  update: patch => respond(Object.assign(currentUser, patch)),
}

export const users = {
  get: handle => respond(personOf(handle)),
  workouts: handle => respond(workoutsOf(handle)),
  // ponytail: fixtures only have posts for me; other athletes' posts come from the feed.
  posts: handle => respond(handle === currentUser.username ? userPosts : feedPosts.filter(p => p.user?.username === handle)),
  suggestions: () => respond(friends),
}

export const journal = {
  list: () => respond(journalEntries),
  create: entry => {
    const created = { ...entry, id: newId('j') }
    journalEntries.unshift(created)
    return respond(created)
  },
  progress: () => respond(exerciseProgress),
}

export const saved = {
  list: () => respond(savedWorkouts),
  add: workout => {
    const created = { ...workout, id: newId('s'), savedAt: 'Just now' }
    savedWorkouts.unshift(created)
    return respond(created)
  },
  remove: id => {
    const i = savedWorkouts.findIndex(w => w.id === id)
    if (i > -1) savedWorkouts.splice(i, 1)
    return respond()
  },
}

export const plans = {
  today: () => respond(todayWorkout),
  week: () => respond(weeklyTemplates),
  setDay: (dayId, workout) => {
    weeklyTemplates[dayId] = workout && {
      ...workout,
      id: newId(`t_${dayId}`),
      exercises: workout.exercises.map(e => ({ ...e, id: newId('ex') })),
    }
    return respond(weeklyTemplates[dayId])
  },
}

export const feed = {
  posts: () => respond(feedPosts),
  stories: () => respond(stories),
  challenges: () => respond(challenges),
  quote: () => respond(motivationalQuotes[new Date().getDate() % motivationalQuotes.length]),
}

export const leaderboard = {
  friends: () => respond(friendsBoard),
  global: () => respond(globalBoard),
}

// Submissions come back with `myVote` so the client can compute the tally (domain/reviews).
export const reviews = {
  queue: () => respond(reviewQueue.map(s => ({ ...s, myVote: myVote(s.id) }))),
  stats: () => respond({ reviewed: reviewedCount() }),
  vote: (id, verdict) => {
    castVote(id, verdict)
    return respond({ id, myVote: myVote(id) })
  },
}

export const exercises = {
  list: () => respond(exerciseList),
  plans: () => respond(workoutPlans),
}

export const notifications = {
  list: () => respond(notificationList),
  markRead: id => {
    const n = notificationList.find(x => x.id === id)
    if (n) n.read = true
    return respond()
  },
  markAllRead: () => {
    notificationList.forEach(n => { n.read = true })
    return respond()
  },
}

export const messages = {
  conversations: () => respond(conversationList),
  send: (conversationId, text) => {
    const c = conversationList.find(x => x.id === conversationId)
    const message = { id: newId('m'), text, isMe: true, time: nowTime() }
    c?.messages.push(message)
    return respond(message)
  },
}
