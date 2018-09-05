var steem = require('./steem.service')
var wp = require('./wp.service')

module.exports = {
  listTopics,
  getTopic,
  createTopic,
  createReply
}

function listTopics (category, cb) {
  var promises = [
    wp.listValidTopics(category),
    steem.listAllTopics()
  ]

  Promise.all(promises)
    .then(([ validTopics, topics ]) => {
      topics = filterInvalidPosts(validTopics, topics)
      topics = exposePostsMetadata(topics)

      cb(null, topics)
    })
    .catch(err => cb(err))
}

function getTopic (author, permlink, cb) {
  var validReplies

  wp.getValidTopic(author, permlink)
    .then(validTopic => {
      if (!validTopic) return cb(null)

      validReplies = validTopic.replies

      return steem.getTopic(author, permlink)
    })
    .then(topic => {
      var replies = filterInvalidPosts(validReplies, topic.replies)

      replies = exposePostsMetadata(replies)
      topic.replies = replies

      cb(null, topic)
    })
}

function createTopic (author, category, title, content, cb) {
  var message = {
    permlink: permlinkFrom(title),
    author,
    category,
    title,
    content
  }

  steem.broadcast(message, (err, result) => {
    if (err) return cb(err)

    wp.publish(message, (err, response) => {
      if (err) return cb(err)

      cb(null, message)
    })
  })
}

function createReply (author, parent, content, cb) {
  var message = {
    title: `re: ${parent.title}`,
    parent,
    author,
    content
  }

  steem.broadcast(message, (err, post) => {
    if (err) return cb(err)

    wp.publish(message, (err) => {
      if (err) return cb(err)

      cb(null, message)
    })
  })
}

function permlinkFrom (text) {
  return removeSpecialChars(text.toLowerCase()).split(' ').join('-').slice(0, 63)
}

function removeSpecialChars (str) {
  return str.replace(/[^\w\s]/gi, '')
}

function filterInvalidPosts (validPosts, posts) {
  var permlinks = validPosts.map(vt => vt.permlink)
  var authors = validPosts.map(vt => vt.author)

  return posts.filter(topic => {
    return (
      permlinks.includes(topic.permlink) &&
      authors.includes(topic.author)
    )
  })
}

function exposePostsMetadata (posts) {
  return posts.map(post => {
    post.metadata = JSON.parse(post.json_metadata)

    return post
  })
}
