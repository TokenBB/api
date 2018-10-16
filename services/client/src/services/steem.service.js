import assert from 'assert'
import steem from '@steemit/steem-js'
import { promisify } from 'es6-promisify'
import networks from 'steem-networks'

console.log(steem)

require('sc2-sdk')

var getContentAsync = promisify(steem.api.getContent)
var getContentRepliesAsync = (author, permlink) => steem.api.callAsync('condenser_api', 'get_content_replies', [ author, permlink ])

class SteemService {
  start (opts) {
    this.opts = this._validateOptions(opts)
    this.network = networks[opts.network]

    this.opts.parentPost = {
      author: this.opts.account,
      permlink: this.opts.account + '-topics'
    }

    steem.api.setOptions({ url: this.network.rpc })
    steem.config.set('address_prefix', this.network.prefix)
    steem.config.set('chain_id', this.network.chainId)

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
    var { author, permlink } = this.opts.parentPost

    return getContentRepliesAsync(author, permlink)
  }

  listReplies (author, permlink) {
    return getContentRepliesAsync(author, permlink)
  }

  broadcastPatch (post) {
    var args = [
      post.parent_author,
      post.parent_permlink,
      post.author,
      post.permlink,
      post.title,
      post.content,
      post.metadata
    ]

    return this._broadcast(args)
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
    var api = global.sc2.Initialize({
      app: process.env.VUE_APP_STEEM_CONNECT_ACCOUNT,
      callbackURL: process.env.BASE_URL,
      accessToken: 'access_token',
      scope: [ 'comment', 'vote' ]
    })

    api.setBaseURL(process.env.VUE_APP_STEEM_CONNECT_HOST)

    return api
  }

  _validateOptions (opts) {
    var required = [ 'network', 'account' ]

    required.forEach(key => {
      assert.ok(opts[key], `SteemService: options '${key}' is required`)
    })

    return opts
  }
}

export default new SteemService()
