var choo = require('choo')
var devtools = require('choo-devtools')

var authStore = require('./stores/auth.store')
var postStore = require('./stores/post.store')
var topicStore = require('./topic/topic.store')
var router = require('./router')
var steem = require('./services/steem.service')

var app = choo()

steem.start({
  url: process.env.STEEMD_URL,
  addressPrefix: process.env.ADDRESS_PREFIX,
  chainId: process.env.CHAIN_ID,
  parentPost: {
    author: process.env.APP_ACCOUNT,
    permlink: process.env.APP_ACCOUNT + '-topics'
  }
})

app.use(devtools())
app.use(router)
app.use(authStore)
app.use(postStore)
app.use(topicStore)

app.mount('body')
