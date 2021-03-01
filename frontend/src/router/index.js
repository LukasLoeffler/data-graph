import Vue from 'vue'
import VueRouter from 'vue-router'
import Editor from '../views/Editor.vue'
import Settings from '../views/Settings.vue'
import About from '../views/About.vue'
import Wiki from '../views/Wiki.vue'

Vue.use(VueRouter)

const routes = [
    {
    path: '/',
    redirect: '/workspace/1'
  },
  {
    path: '/workspace/:index',
    name: 'workspace',
    component: Editor
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/wiki/:term',
    name: 'Wiki',
    component: Wiki
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
