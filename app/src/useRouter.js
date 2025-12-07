import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import LoginView from './LoginView.vue'
import ProfileView from './ProfileView.vue'
import SocialView from './SocialView.vue'
import StatsView from './StatsView.vue'
import JournalView from './JournalView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView },
  { path: '/social', component: SocialView },
  { path: '/stats', component: StatsView },
  { path: '/journal', component: JournalView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})