import Vue from 'vue'
import Buefy from 'buefy'

import App from './App.vue'
import router from './router'
import store from './store/index.js'
import steem from './services/steem.service'

import './registerServiceWorker'

Vue.config.productionTip = false

steem.start({
  account: process.env.VUE_APP_ACCOUNT_NAME,
  network: process.env.VUE_APP_STEEM_NETWORK
})

Vue.use(Buefy)

global.router = router

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
