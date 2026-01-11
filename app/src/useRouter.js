import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import ProfileView from './views/ProfileView.vue'
import JournalView from './views/JournalView.vue'
import WorkoutView from './views/WorkoutView.vue'
import MessagesView from './views/MessagesView.vue'
import SearchView from './views/SearchView.vue'
import NotificationView from './views/NotificationView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView },
  { path: '/journal', component: JournalView },
  { path: '/workout', component: WorkoutView },
  { path: '/messages', component: MessagesView },
  { path: '/search', component: SearchView },
  { path: '/notifications', component: NotificationView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})