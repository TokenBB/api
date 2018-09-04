var steem = require('./steem.service')
var wp = require('./wp.service')

module.exports = {
  listTopics,
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
      topics = filterInvalidTopics(validTopics, topics)
      topics = exposeTopicMetadata(topics)

      cb(null, topics)
    })
    .catch(err => cb(err))
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

function filterInvalidTopics (validTopics, topics) {
  var permlinks = validTopics.map(vt => vt.permlink)
  var authors = validTopics.map(vt => vt.author)

  return topics.filter(topic => {
    return (
      permlinks.includes(topic.permlink) &&
      authors.includes(topic.author)
    )
  })
}

function exposeTopicMetadata (topics) {
  return topics.map(t => {
    t.metadata = JSON.parse(t.json_metadata)
    return t
  })
}
