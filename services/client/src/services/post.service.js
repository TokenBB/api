import steem from '@/services/steem.service'
import api from '@/services/api.service'

export default {
  listTopics,
  getTopic,
  editPost,
  deleteTopic,
  createTopic,
  createReply
}

function listTopics (category) {
  var promises = [
    api.listValidTopics(category),
    steem.listAllTopics()
  ]

  return Promise.all(promises).then(([ validTopicPosts, topicPosts ]) => {
    var filtered = filterInvalidPosts(validTopicPosts, topicPosts)

    return filtered.map(postToTopic)
  })
}

function postToTopic (post) {
  var { tokenbb } = JSON.parse(post.json_metadata)

  return {
    categoryId: tokenbb.category,
    author: post.author,
    permlink: post.permlink,
    title: post.title,
    created: post.created,
    pendingPayout: post.total_pending_payout_value,
    body: post.body,
    numberOfReplies: post.children
  }
}

function getTopic (author, permlink) {
  var validReplies

  return api.getValidTopic(author, permlink)
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

function editPost (post, content) {
  return steem.broadcastPatch(Object.assign({}, post, { content }))
}

function deleteTopic (topic) {
  return api.deleteTopic(topic)
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
    .then(topic => api.publishTopic(topic).then(() => topic))
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
    .then(reply => api.publishReply(parent, message).then(() => reply))
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
