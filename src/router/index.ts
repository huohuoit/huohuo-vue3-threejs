import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/scene',
    name: 'scene',
    component: () => import('@/views/SceneView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 