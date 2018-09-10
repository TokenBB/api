var keyBy = require('lodash.keyBy')
var postService = require('../services/post.service')
var wpService = require('../services/wp.service')

module.exports = postStore

function postStore (state, emitter) {
  state.topic = {
    viewed: null,
    editing: {
      toggled: false,
      title: '',
      category: null
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('topic:show-edit-title', showEditTitle)
  })

  function showEditTitle () {
    var topic = state.topics.viewed

    if (!topic) return console.warn('no topic currently viewed')

    state.topic.editing.title = topic.title
    state.topic.editing.category = topic.metadata.tokenbb.category
    state.topic.editing.toggled = true

    emitter.emit('render')
  }
}
