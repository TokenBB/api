var assert = require('assert')
var postService = require('../services/post.service')

module.exports = topicStore

function topicStore (state, emitter) {
  state.topic = {
    route: 'topics/:author/:permlink',
    active: null,
    editing: {
      toggled: false,
      title: '',
      category: null
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on(state.events.NAVIGATE, onNavigate)
    emitter.on('topic:show-edit-title', showEditTitle)

    onNavigate()
  })

  function onNavigate () {
    unloadTopic()

    if (state.route === state.topic.route) {
      var { author, permlink } = state.params

      return loadTopic(author, permlink)
    }
  }

  function unloadTopic () {
    state.topic.active = null
  }

  function loadTopic (author, permlink) {
    postService.getTopic(author, permlink).then(topic => {
      if (!topic) return notFound()

      state.topic.active = topic
      emitter.emit('render')
    })
  }

  function notFound () {
    emitter.emit(this.state.events.PUSH_STATE, '/404')
  }

  function showEditTitle (topic) {
    assert.ok(topic, 'showEditTitle: topic arg is required')

    state.topic.editing.title = topic.title
    state.topic.editing.category = topic.metadata.tokenbb.category
    state.topic.editing.toggled = true

    emitter.emit('render')
  }
}
