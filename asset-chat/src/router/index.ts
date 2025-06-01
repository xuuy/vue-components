import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SealDemo from '../pages/Seal'
import AssetChatDemo from '../pages/AssetChat'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/seal'
  },
  {
    path: '/seal',
    name: 'Seal',
    component: SealDemo
  },
  {
    path: '/asset-chat',
    name: 'AssetChat',
    component: AssetChatDemo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
