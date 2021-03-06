import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import { getCurrentUser } from '../firebase'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import("../views/Home.vue"),
    meta: {
      requiresAuth: true
    },
    children: [
      { path: '', name: 'Home', redirect: 'checkin' },
      {
        path: 'checkin',
        name: 'Checkin',
        component: () => import("../views/CheckIn.vue"),
      },
      {
        path: 'today',
        name: 'Today',
        component: () => import("../views/Today.vue"),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../views/Login.vue"),
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = await getCurrentUser()
  if (requiresAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
