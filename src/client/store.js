const ACCESS_TOKEN_KEY = process.env.APP_ACCOUNT + ':access-token'
const USERNAME_KEY = process.env.APP_ACCOUNT + ':username'
const TOPIC_PARENT_AUTHOR = process.env.APP_ACCOUNT
const TOPIC_PARENT_PERMLINK = process.env.APP_ACCOUNT + '-topics'
const DEFAULT_POST_METADATA = {
  'app': 'tokenbb/0.1',
  'format': 'markdown',
  'tags': [
    'tokenbb'
  ],
  'images': [],
  'videos': []
}

var steem = require('@steemit/steem-js')
var sc2 = require('sc2-sdk')
var request = require('request')

var storage = window.sessionStorage
var connect = createConnectAPI()

steem.api.setOptions({ url: 'wss://' + process.env.STEEMD_URL })
steem.config.set('address_prefix', process.env.ADDRESS_PREFIX)
steem.config.set('chain_id', process.env.CHAIN_ID)

module.exports = store

function store (state, emitter, app) {
  state.app = {
    categories: [{ name: 'All Categories' }, { name: 'Bacon' }],
    tabs: [{ name: 'Latest' }, { name: 'Top' }],
    loginURL: connect.getLoginURL()
  }

  state.topics = {
    loading: true,
    posting: false,
    list: [],
    filters: {
      category: null
    }
  }

  resetAuthState()

  emitter.on('DOMContentLoaded', () => {
    emitter.on('create-topic', createTopic)
    emitter.on('create-reply', createReply)
    emitter.on('logout', logout)

    onInit()
  })

  function onInit () {
    if (state.query.access_token) storeSession()

    loadTopics()
    loadSession()

    emitter.emit('render')
  }

  function createTopic (category, title, content) {
    state.topics.posting = true
    emitter.emit('render')

    var message = {
      author: state.auth.username,
      permlink: permlinkFrom(title),
      category,
      title,
      content
    }

    broadcast(message, (err, result) => {
      if (err) return handlePostingErrors(err)

      publish(message, (err, response) => {
        if (err) return handlePostingErrors(err)

        state.topics.posting = false
        emitter.emit('render')

        var route = `/topics/${message.author}/${message.permlink}`

        emitter.emit(state.events.PUSHSTATE, route)
      })
    })
  }

  function createReply (parent, content) {
    state.topics.posting = true
    emitter.emit('render')

    var message = {
      parent,
      author: state.auth.username,
      title: `re: ${parent.title}`,
      content
    }

    broadcast(message, (err, post) => {
      if (err) return handlePostingErrors(err)

      publish(message, (err) => {
        if (err) return handlePostingErrors(err)

        state.topics.posting = false
        emitter.emit('render')
      })
    })
  }

  function handlePostingErrors (err) {
    console.error(err)
    state.topics.posting = false
    emitter.emit('render')
  }

  function logout () {
    clearSession()
    resetAuthState()
  }

  function resetAuthState () {
    state.auth = {
      accessToken: null,
      username: ''
    }

    emitter.emit('render')
  }

  function loadTopics () {
    var opts = {
      method: 'GET',
      url: process.env.API_URL + '/posts',
      json: true
    }

    request(opts, (err, response, posts) => {
      if (err) return console.error(err)

      var permlinks = posts.map(post => post.permlink)

      steem.api.getContentReplies(TOPIC_PARENT_AUTHOR, TOPIC_PARENT_PERMLINK, (err, topics) => {
        if (err) return console.error(err)

        state.topics.list = topics.filter(topic => {
          return permlinks.includes(topic.permlink)
        })

        state.topics.loading = false

        emitter.emit('render')
      })
    })
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
      connect.setAccessToken(accessToken)

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

function createConnectAPI () {
  var api = sc2.Initialize({
    app: process.env.CONNECT_ACCOUNT,
    callbackURL: process.env.HOST + process.env.CALLBACK_ROUTE,
    accessToken: 'access_token',
    scope: [ 'comment', 'vote' ]
  })

  api.setBaseURL(process.env.BASE_URL)

  return api
}

function broadcast (message, callback) {
  var { author, category, title, content, parent, permlink } = message

  var parentAuthor = parent ? parent.author : TOPIC_PARENT_AUTHOR
  var parentPermlink = parent ? parent.permlink : TOPIC_PARENT_PERMLINK

  var metadata = Object.assign({}, DEFAULT_POST_METADATA, {
    'tokenbb': {
      'account': process.env.APP_ACCOUNT,
      'type': parent ? 'reply' : 'topic',
      'author': author,
      'title': title,
      'category': category || null,
      'tags': []
    }
  })

  return connect.comment(
    parentAuthor,
    parentPermlink,
    author,
    permlink,
    title,
    content,
    metadata,
    callback
  )
}

function publish (message, callback) {
  var { author, permlink } = message
  var opts = {
    method: 'POST',
    url: process.env.API_URL + `/posts`,
    json: true,
    headers: { authorization: connect.options.accessToken },
    body: {
      author,
      permlink
    }
  }

  request(opts, callback)
}

function permlinkFrom (text) {
  return removeSpecialChars(text.toLowerCase()).split(' ').join('-').slice(0, 63)
}

function removeSpecialChars (str) {
  return str.replace(/[^\w\s]/gi, '')
}
