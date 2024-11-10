import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  // 根路径
  {
    path: '/',
    redirect: '/emp'
  },
  // 其他路径
  {
    path: '/emp',
    name: 'emp',
    component: () => import('../views/tlias/EmpView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/tlias/LoginView.vue')
  }
  ,
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/tlias/RegisterView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
