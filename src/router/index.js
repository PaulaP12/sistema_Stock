import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/last_movements',
  //   name: 'Ultimos movimientos',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: function () {
  //     return import(/* webpackChunkName: "about" */ '../views/last_movements.vue')
  //   }
  // }
  {
    path: '/lastmovements',
    name: 'LastMovements',
    component: function () {
       return import('../views/LastMovements.vue')
    }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: function () {
       return import('../views/Articles.vue')
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: function () {
       return import('../views/Categories.vue')
    }
  },
  {
    path: '/receipts',
    name: 'Receipts',
    component: function () {
       return import('../views/Receipts.vue')
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
