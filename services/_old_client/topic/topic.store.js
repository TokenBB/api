var { samePost } = require('../shared/utils')
var postService = require('../services/post.service')

module.exports = topicStore

function topicStore (state, emitter) {
  state.topic = {
    route: 'topics/:author/:permlink',
    active: null,
    edit: {
      fetching: false,
      post: null
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on(state.events.NAVIGATE, onNavigate)

    emitter.on('topic:edit-post', editPost)
    emitter.on('topic:show-edit-post', showEditPost)
    emitter.on('topic:hide-edit-post', hideEditPost)
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

  function editPost (topic, content) {
    state.topic.edit.fetching = true
    emitter.emit('render')

    return postService.editPost(topic, content)
      .then(post => {
        replacePost(post)

        state.topic.edit.post = null
        state.topic.edit.fetching = false
        emitter.emit('render')
      })
      .catch(err => {
        console.error(err)

        state.topic.edit.fetching = false
        emitter.emit('render')
      })
  }

  function replacePost (post) {
    var topic = state.topic.active

    if (samePost(topic, post)) {
      topic.body = post.body
    } else {
      var reply = topic.replies.find(reply => samePost(reply, post))

      reply.body = post.body
    }

    emitter.emit('render')
  }

  function showEditPost (post) {
    state.topic.edit.post = Object.assign({}, post)

    emitter.emit('render')
  }

  function hideEditPost (post) {
    state.topic.edit.post = null

    emitter.emit('render')
  }

  function showEditTitle (topic) {
    state.topic.edit.title = topic.title
    state.topic.edit.category = topic.metadata.tokenbb.category
    state.topic.edit.toggled = true

    emitter.emit('render')
  }
}
