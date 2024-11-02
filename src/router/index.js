import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  // 根路径
  {
    path: '/',
    redirect: '/emp'
  },
  {
    path: '/emp',
    name: 'emp',
    component: () => import('../views/tlias/EmpView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
