var assert = require('assert')
var steem = require('@steemit/steem-js')
var { promisify } = require('es6-promisify')
var sc2 = require('sc2-sdk')

var getContentAsync = promisify(steem.api.getContent)
var getContentRepliesAsync = promisify(steem.api.getContentReplies)

class SteemService {
  start (opts) {
    this.opts = this._validateOptions(opts)

    steem.api.setOptions({ url: opts.url })
    steem.config.set('address_prefix', opts.addressPrefix)
    steem.config.set('chain_id', opts.chainId)

    this.connect = this._createConnectAPI()
  }

  getTopic (author, permlink) {
    var promises = [
      getContentAsync(author, permlink),
      getContentRepliesAsync(author, permlink)
    ]

    return Promise.all(promises).then(([ topic, replies ]) => {
      topic.replies = replies
      topic.metadata = JSON.parse(topic.json_metadata)

      return topic
    })
  }

  listAllTopics () {
    return getContentRepliesAsync(
      this.opts.parentPost.author,
      this.opts.parentPost.permlink
    )
  }

  listReplies (author, permlink) {
    return getContentRepliesAsync(author, permlink)
  }

  broadcastTopic (topic) {
    var args = [
      this.opts.parentPost.author,
      this.opts.parentPost.permlink,
      topic.author,
      topic.permlink,
      topic.title,
      topic.content,
      this._createPostMetadata(topic)
    ]

    return this._broadcast(args)
  }

  broadcastReply (parent, reply) {
    var args = [
      parent.author,
      parent.permlink,
      reply.author,
      reply.permlink,
      reply.title,
      reply.content,
      this._createPostMetadata(reply)
    ]

    return this._broadcast(args)
  }

  _createPostMetadata (post) {
    return {
      'app': 'tokenbb/0.1',
      'format': 'markdown',
      'tags': [ 'tokenbb' ],
      'images': [],
      'videos': [],
      'tokenbb': {
        'account': this.opts.parentPost.author,
        'category': post.category || null,
        'tags': []
      }
    }
  }

  _broadcast (args) {
    var broadcastFn = promisify(this.connect.comment).bind(this.connect)

    return broadcastFn(...args).then(() => {
      var author = args[2]
      var permlink = args[3]

      return this.getTopic(author, permlink)
    })
  }

  _createConnectAPI () {
    var api = sc2.Initialize({
      app: process.env.CONNECT_ACCOUNT,
      callbackURL: process.env.HOST + process.env.CALLBACK_ROUTE,
      accessToken: 'access_token',
      scope: [ 'comment', 'vote' ]
    })

    api.setBaseURL(process.env.BASE_URL)

    return api
  }

  _validateOptions (opts) {
    var required = [ 'url', 'addressPrefix', 'chainId', 'parentPost' ]

    required.forEach(key => {
      assert.ok(opts[key], `SteemService: options '${key}' is required`)
    })

    return opts
  }
}

module.exports = new SteemService()
