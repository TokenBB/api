import steem from '@/services/steem.service'
import router from '@/router'

const ACCESS_TOKEN_KEY = process.env.APP_ACCOUNT + ':access-token'
const USERNAME_KEY = process.env.APP_ACCOUNT + ':username'

export default {
  namespaced: true,
  state: {
    accessToken: '',
    username: ''
  },
  mutations: {
    logout (state) {
      window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      window.sessionStorage.removeItem(USERNAME_KEY)

      state.accessToken = ''
      state.username = ''
    },
    storeSession () {
      window.sessionStorage.setItem(ACCESS_TOKEN_KEY, router.currentRoute.query.access_token)
      window.sessionStorage.setItem(USERNAME_KEY, router.currentRoute.query.username)

      router.replace('/')
    },
    loadSession (state) {
      var accessToken = window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
      var username = window.sessionStorage.getItem(USERNAME_KEY)

      if (accessToken && username) {
        steem.connect.setAccessToken(accessToken)

        state.accessToken = accessToken
        state.username = username
      }
    }
  },
  actions: {

  }
}
