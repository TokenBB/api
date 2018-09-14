const ACCESS_TOKEN_KEY = process.env.APP_ACCOUNT + ':access-token'
const USERNAME_KEY = process.env.APP_ACCOUNT + ':username'

var steem = require('../services/steem.service')

module.exports = store

function store (state, emitter, app) {
  var storage = window.sessionStorage

  resetAuthState()

  emitter.on('DOMContentLoaded', () => {
    emitter.on('logout', logout)

    onInit()
  })

  function onInit () {
    if (state.query.access_token) storeSession()

    loadSession()

    emitter.emit('render')
  }

  function logout () {
    clearSession()
    resetAuthState()
  }

  function resetAuthState () {
    state.auth = {
      loginURL: steem.connect.getLoginURL(),
      accessToken: null,
      username: ''
    }

    emitter.emit('render')
  }

  function storeSession () {
    storage.setItem(ACCESS_TOKEN_KEY, state.query.access_token)
    storage.setItem(USERNAME_KEY, state.query.username)

    emitter.emit(state.events.REPLACESTATE, '/')
  }

  function loadSession () {
    var accessToken = storage.getItem(ACCESS_TOKEN_KEY)
    var username = storage.getItem(USERNAME_KEY)

    if (accessToken && username) {
      steem.connect.setAccessToken(accessToken)

      state.auth.accessToken = accessToken
      state.auth.username = username
    }

    emitter.emit('render')
  }

  function clearSession () {
    storage.removeItem(ACCESS_TOKEN_KEY)
    storage.removeItem(USERNAME_KEY)
  }
}
