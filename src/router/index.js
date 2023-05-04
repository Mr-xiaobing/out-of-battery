import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Recovery from '../views/Recovery.vue'
import Login from '../views/Login.vue'
import Information from "../views/Information.vue"
import Test from "../views/Test.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:"/recovery",
    name:"Recovery",
    component:Recovery
  },
  {
    path:"/information",
    name:"Information",
    component:Information
  },
  {
    path:"/test",
    name:"Login",
    component:Login
  },
  {
    path:"/login",
    name:"test",
    component:Test
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
