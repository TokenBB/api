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
  })

  function init () {
    postService.listTopics(null, (err, topics) => {
      if (err) return console.error(err)

      state.topics.list = topics
      state.topics.loading = false

      emitter.emit('render')
    })
  }
}
