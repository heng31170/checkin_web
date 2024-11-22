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
  // 员工管理
  {
    path: '/emp',
    name: 'emp',
    component: () => import('../views/tlias/EmpView.vue')
  },
  // 登录管理
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/tlias/LoginView.vue')
  }
  ,
  // 注册管理
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/tlias/RegisterView.vue')
  }
  ,
  // 个人中心管理
  {
    path: '/person',
    name: 'person',
    component: () => import('../views/tlias/PersonView.vue')
  }
  ,
  // 普通员工管理
  {
    path: '/cemp',
    name: 'cemp',
    component: () => import('../views/tlias/CommonEmp.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
