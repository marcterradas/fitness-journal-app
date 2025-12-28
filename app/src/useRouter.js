import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import ProfileView from './views/ProfileView.vue'
import JournalView from './views/JournalView.vue'
import WorkoutView from './views/WorkoutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView },
  { path: '/journal', component: JournalView },
  { path: '/workout', component: WorkoutView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})