var requestAsync = require('request-promise')
var steem = require('./steem.service')

module.exports = {
  listValidTopics,
  listValidReplies,
  publishTopic
}

function listValidTopics (category) {
  var url = process.env.API_URL + '/topics'

  if (category) url = url + `?category=${category}`

  var opts = {
    method: 'GET',
    json: true,
    url
  }

  return requestAsync(opts)
}

function listValidReplies (post) {
  var { author, permlink } = post
  var url = process.env.API_URL + `/replies?author=${author}&permlink=${permlink}`

  var opts = {
    method: 'GET',
    json: true,
    url
  }

  return requestAsync(opts)
}

function publishTopic (message) {
  var { author, permlink } = message

  var opts = {
    method: 'POST',
    url: process.env.API_URL + `/posts`,
    json: true,
    headers: { authorization: steem.connect.options.accessToken },
    body: {
      author,
      permlink
    }
  }

  return requestAsync(opts)
}
