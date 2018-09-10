var steem = require('./steem.service')
var wp = require('./wp.service')

module.exports = {
  editPost,
  deleteTopic,
  listTopics,
  getTopic,
  createTopic,
  createReply
}

function editPost (post, content) {
  return steem.broadcastTopic(Object.assign(post, { title: content, content }))
}

function deleteTopic (topic) {
  return wp.deleteTopic(topic)
}

function listTopics (category) {
  var promises = [
    wp.listValidTopics(category),
    steem.listAllTopics()
  ]

  return Promise.all(promises).then(([ validTopics, topics ]) => {
    topics = filterInvalidPosts(validTopics, topics)
    topics = exposePostsMetadata(topics)

    return topics
  })
}

function getTopic (author, permlink) {
  var validReplies

  return wp.getValidTopic(author, permlink)
    .then(validTopic => {
      if (!validTopic) return null

      validReplies = validTopic.replies

      return steem.getTopic(author, permlink)
    })
    .then(topic => {
      var replies = filterInvalidPosts(validReplies, topic.replies)

      replies = exposePostsMetadata(replies)
      topic.replies = replies

      return topic
    })
}

function createTopic (author, category, title, content) {
  var message = {
    permlink: permlinkFrom(title),
    author,
    category,
    title,
    content
  }

  return steem.broadcastTopic(message)
    .then(topic => wp.publishTopic(topic).then(() => topic))
}

function createReply (parent, author, content) {
  var title = `re: ${parent.title} ${Date.now()}`
  var message = {
    author,
    title,
    permlink: permlinkFrom(title),
    content
  }

  return steem.broadcastReply(parent, message)
    .then(reply => wp.publishReply(parent, message).then(() => reply))
}

// -----------------------------------------------------------------------------

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
