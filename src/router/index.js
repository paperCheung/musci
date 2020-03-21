import Vue from 'vue'
import VueRouter from 'vue-router'
// import Recommend from '../components/Recommend/index.vue'
// import Singer from '../components/Singer/index.vue'
// import Rank from '../components/Rank/index.vue'
// import Search from '../components/Search/index.vue'
// import Detail from 'components/Detail'
// import User from 'components/User'
// 路由懒加载
const Recommend = () => import('components/Recommend')
const Singer = () => import('components/Singer')
const Rank = () => import('components/Rank')
const Search = () => import('components/Search')
const Detail = () => import('components/Detail')
const User = () => import('components/User')

Vue.use(VueRouter)

const routes = [{
    name: 'user',
    path: '/user',
    components: {
      second: User
    }
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: ':recdetail',
      name: 'recdetail',
      component: Detail
    }]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':singerdetail',
      name: 'singerdetail',
      component: Detail
    }]
  },
  {
    path: '/rank',
    component: Rank,
    children: [{
      path: ':rankdetail',
      name: 'rankdetail',
      component: Detail
    }]
  },
  {
    path: '/search',
    component: Search,
    children: [{
      path: ':searchdetail',
      name: 'searchdetail',
      component: Detail
    }]
  },
  {
    path: '/',
    redirect: '/recommend'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
