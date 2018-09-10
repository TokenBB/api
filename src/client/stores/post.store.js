var keyBy = require('lodash.keyBy')
var postService = require('../services/post.service')
var wpService = require('../services/wp.service')

module.exports = postStore

function postStore (state, emitter) {
  state.app = {
    categories: [{ name: 'All Categories' }],
    tabs: [{ name: 'Latest' }, { name: 'Top' }]
  }

  state.categories = {
    fetching: true,
    list: [],
    byId: {},
    selected: {
      name: 'Uncategorized'
    }
  }

  state.topics = {
    loading: true,
    posting: false,
    list: [],
    filters: {
      category: null
    }
  }

  emitter.on('DOMContentLoaded', () => {
    init()

    emitter.on('edit-post', editPost)
    emitter.on('delete-topic', deleteTopic)
    emitter.on('create-topic', createTopic)
    emitter.on('create-reply', createReply)
  })

  function editPost (topic, content) {
    return postService.editPost(topic, content).then(() => {
      console.log('done!')
    })
  }

  function deleteTopic (topic) {
    var msg = 'are you sure you want to delete the topic titled: ' + topic.title + '?'

    if (window.confirm(msg)) {
      postService.deleteTopic(topic)
        .then(res => {
          var index = state.topics.list.findIndex(t => t.id === topic.id)

          state.topics.list.splice(index, 1)
          emitter.emit('render')
        })
        .catch(err => {
          console.error('oops!', err)
        })
    }
  }

  function createTopic (category, title, content) {
    state.topics.posting = true
    emitter.emit('render')

    var author = state.auth.username

    return postService.createTopic(author, category, title, content)
      .then(topic => {
        var route = `/topics/${author}/${topic.permlink}`

        state.topics.list.push(topic)
        emitter.emit(state.events.PUSHSTATE, route)
      })
      .catch(err => {
        state.topics.posting = false
        emitter.emit('render')

        return console.error(err)
      })
  }

  function createReply (parent, content) {
    state.topics.posting = true
    emitter.emit('render')

    var author = state.auth.username

    return postService.createReply(parent, author, content)
      .then(reply => {
        parent.replies.push(reply)
        state.topics.posting = false
        emitter.emit('render')
      })
      .catch(err => {
        state.topics.posting = false
        emitter.emit('render')

        return console.error(err)
      })
  }

  function listTopics () {
    return postService.listTopics(null)
      .then(topics => {
        state.topics.list = topics
        state.topics.loading = false

        emitter.emit('render')
      })
      .catch(err => {
        state.topics.loading = false
        emitter.emit('render')

        return console.error(err)
      })
  }

  function listCategories () {
    return wpService.listCategories()
      .then(categories => {
        var uncategorized = {
          name: 'Uncategorized'
        }

        state.categories.fetching = false
        state.categories.list = [ uncategorized, ...categories]
        state.categories.byId = keyBy(categories, c => c.id)

        emitter.emit('render')
      })
      .catch(err => {
        console.error('could not fetch categories :(', err)
      })
  }

  function init () {
    listTopics()
    listCategories()
  }
}
