import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/',
      name: 'Editor',
      component: () => import('./index.vue')
    },
    {
      path: '/Dialog',
      name: 'DemoPage',
      component: () => import('./CodeDialog.vue')
    },
    {
      path: '/EditViewCopy',
      name: 'DemoPage',
      component: () => import('./EditViewCopy.vue')
    }
  ]

  const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL),
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })

  export default router
