import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/auth.store'
import topics from '@/store/topics.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    topics
  }
})
