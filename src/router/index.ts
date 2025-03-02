import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/world',
    name: 'world',
    component: () => import('@/views/world/index.vue')
  },
  {
    path: '/earth',
    name: 'earth',
    component: () => import('@/views/earth/SceneView.vue')
  },
  {
    path: '/demo/imgParticle',
    name: 'imgParticle',
    component: () => import('@/views/demo/imgParticle/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
