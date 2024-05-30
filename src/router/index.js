import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from "@/views/register.vue";
import Order from '../views/order.vue'
import CargoManagement from '../views/CargoManagement.vue'
import OrderManagement from '../views/OrderManagement.vue'
import StoreManagement from '../views/StoreManagement.vue' // 新增
import WareManagement from '../views/WareManagement.vue' // 新增
import CarManagement from '../views/CarManagement.vue' // 新增
import ShelfManagement from '../views/ShelfManagement.vue' // 新增
import StateManagement from "@/views/StateManagement.vue";

import User from '../views/user.vue'
import Header from '../components/header.vue'
import AddCargo from '../views/addCargo.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/Register',
        name: 'Register',
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
        path: '/profile',
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
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/CargoManagement',
        name: 'CargoManagement',
        component: CargoManagement
    },
    {
        path: '/StoreManagement',
        name: 'StoreManagement',
        component: StoreManagement // 新增
    },
    {
        path: '/WareManagement',
        name: 'WareManagement',
        component: WareManagement // 新增
    },
    {
        path: '/CarManagement',
        name: 'CarManagement',
        component: CarManagement // 新增
    },
    {
        path: '/ShelfManagement',
        name: 'ShelfManagement',
        component: ShelfManagement // 新增
    },
    {
        path: '/StateManagement',
        name: 'StateManagement',
        component: StateManagement // 新增
    }

]

const router = new VueRouter({
    routes
})

export default router
