import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import Login from '../views/Login.vue'
import Order from '../views/order.vue'
import OrderManagement from '../views/OrderManagement.vue'
import Header from '../components/header.vue'
Vue.use(VueRouter)

const routes = [
    {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/OrderManagement',
    name: 'OrderManagement',
    component: OrderManagement
  },
    {
     path: '/order',
     name: 'Order',
     component: Order
    },
  {
    path: '/',
    name: 'Home',
    component: HomeView
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
  routes
})

export default router
