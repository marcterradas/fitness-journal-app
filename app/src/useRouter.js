import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import LoginView from './LoginView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})