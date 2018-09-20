import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue')
    },
    {
      path: '/new',
      name: 'new-topic',
      component: () => import('./views/NewTopic.vue')
    },
    {
      path: '/topic/:author/:permlink',
      name: 'topic',
      component: () => import('./views/Topic.vue')
    }
  ]
})
