var requestAsync = require('request-promise')
var steem = require('./steem.service')

module.exports = {
  listCategories,
  addCategory,
  removeCategory,
  listValidTopics,
  listValidReplies,
  publishTopic
}

function listCategories () {
  var opts = {
    method: 'GET',
    json: true,
    url: process.env.API_URL + '/categories'
  }

  return requestAsync(opts)
}

function addCategory (name) {
  var opts = {
    method: 'POST',
    json: true,
    url: process.env.API_URL + '/categories/' + name
  }

  return requestAsync(opts)
}

function removeCategory (name) {
  var opts = {
    method: 'DELETE',
    json: true,
    url: process.env.API_URL + '/categories/' + name
  }

  return requestAsync(opts)
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
