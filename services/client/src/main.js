import Vue from 'vue'
import Buefy from 'buefy'

import App from './App.vue'
import router from './router'
import store from './store'
import steem from './services/steem.service'

import './registerServiceWorker'

Vue.config.productionTip = false

steem.start({
  url: process.env.VUE_APP_STEEMD_URL,
  addressPrefix: process.env.VUE_APP_ADDRESS_PREFIX,
  chainId: process.env.VUE_APP_CHAIN_ID,
  parentPost: {
    author: process.env.VUE_APP_APP_ACCOUNT,
    permlink: process.env.VUE_APP_APP_ACCOUNT + '-topics'
  }
})

Vue.use(Buefy)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
