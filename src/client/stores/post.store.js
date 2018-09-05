var postService = require('../services/post.service')

module.exports = postStore

function postStore (state, emitter) {
  state.app = {
    categories: [{ name: 'All Categories' }],
    tabs: [{ name: 'Latest' }, { name: 'Top' }]
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

    emitter.on('create-topic', createTopic)
  })

  function createTopic (category, title, content) {
    state.topics.posting = true
    emitter.emit('render')

    var author = state.auth.username
    category = 8

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

  function listTopics () {
    return postService.listTopics(null)
      .then(topics => {
        state.topics.list = topics
        state.topics.loading = false

        emitter.emit('render')
      })
      .catch(err => {
        state.topics.loading = false
        emitter.emit('render')

        return console.error(err)
      })
  }

  function init () {
    listTopics()
  }
}
