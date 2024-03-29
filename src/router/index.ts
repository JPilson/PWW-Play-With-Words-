import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import RegisterVocab from "@/views/RegisterVocab.vue";
import PlayView from "@/views/PlayView.vue";
import LoginView from "@/views/LoginView.vue";

Vue.use(VueRouter)

export enum appRouter {
  root="/",
  home="/",
  splash= "/splash",
  register="/word/register",
  play="/word/play"
}

 export const appRoutePush = (route:VueRouter,path:appRouter)=>{
  return route.push(path)
}
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: Home
  },{
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path:appRouter.play,
    name: 'Play',
    component: PlayView
  },{
    path:appRouter.register,
    name: 'register',
    component: RegisterVocab
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
