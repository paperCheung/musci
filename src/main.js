import Vue from 'vue'
import App from './App.vue'
import './style/base.css'
import 'animate.css/animate.css'
import router from './router'
import VueLazyload from 'vue-lazyload'
import store from './store'
import 'style/icon/iconfont.css'
// 引入MintUI
import  MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.use(MintUI)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/logo.png',
  loading: '/logo.png',
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
