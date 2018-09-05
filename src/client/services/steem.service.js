var assert = require('assert')
var steem = require('@steemit/steem-js')
var { promisify } = require('es6-promisify')
var sc2 = require('sc2-sdk')

var getContentAsync = promisify(steem.api.getContent)
var getContentRepliesAsync = promisify(steem.api.getContentReplies)

class SteemService {
  start (opts) {
    this.opts = this._validateOptions(opts)

    steem.api.setOptions({ url: 'wss://' + opts.url })

    steem.config.set('address_prefix', opts.addressPrefix)
    steem.config.set('chain_id', opts.chainId)

    this.connect = this._createConnectAPI()
  }

  getTopic (author, permlink, cb) {
    var promises = [
      getContentAsync(author, permlink),
      getContentRepliesAsync(author, permlink)
    ]

    return Promise.all(promises)
      .then(([ topic, replies ]) => {
        topic.replies = replies
        topic.metadata = JSON.parse(topic.json_metadata)

        return topic
      })
      .catch(err => cb(err))
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

  broadcast (message, callback) {
    var { author, category, title, content, parent, permlink } = message

    var parentAuthor = parent ? parent.author : this.opts.parentPost.author
    var parentPermlink = parent ? parent.permlink : this.opts.parentPost.permlink

    var metadata = {
      'app': 'tokenbb/0.1',
      'format': 'markdown',
      'tags': [ 'tokenbb' ],
      'images': [],
      'videos': [],
      'tokenbb': {
        'account': this.opts.parentPost.author,
        'type': parent ? 'reply' : 'topic',
        'author': author,
        'title': title,
        'category': category || null,
        'tags': []
      }
    }

    return this.connect.comment(
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
