import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from "@/views/register.vue";
import Order from '../views/order.vue'
<<<<<<<<< Temporary merge branch 1
import OrderManagement from '../views/OrderManagement.vue'
=========
import User from '../views/user.vue'
>>>>>>>>> Temporary merge branch 2
import Header from '../components/header.vue'
import AddCargo from '../views/addCargo.vue'
import User from "@/views/user.vue";

Vue.use(VueRouter)

const routes = [
    {
    path: '/login',
    name: 'Login',
    component: Login
  },
    {
        path: '/Register',
        name: 'Regsiter',
        component: Register
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
      path: '/user',
      name: 'User',
      component: User
     },
     {
      path: '/addCargo',
      name: 'addCargo',
      component: AddCargo
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
  },
    {
        path: '/CargoManagement',
        name: 'CargoManagement',
        component: CargoManagement  // 使用你的货物列表组件
    }
]

const router = new VueRouter({
  routes
})

export default router
