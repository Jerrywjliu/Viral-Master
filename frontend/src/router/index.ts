import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/viral-master',
  },
  {
    path: '/viral-master',
    name: 'ViralMaster',
    component: () => import('@/views/viral-master/index.vue'),
    meta: {
      title: '爆款大师',
      icon: 'flame',
      department: 'viral-master',
    },
  },
  {
    path: '/video-creation/domestic',
    name: 'VideoCreationDomestic',
    component: () => import('@/views/video-creation/domestic/index.vue'),
    meta: {
      title: '一键大片国内版',
      icon: 'film',
      department: 'video-creation',
    },
  },
  {
    path: '/video-creation/international',
    name: 'VideoCreationInternational',
    component: () => import('@/views/video-creation/international/index.vue'),
    meta: {
      title: '一键大片国际版',
      icon: 'globe',
      department: 'video-creation',
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Route guard — could add auth check here
router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '爆款大师'} - Viral Master`
  next()
})

export default router
