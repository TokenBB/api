var html = require('choo/html')

var { samePost } = require('../shared/utils')
var loadingEl = require('../shared/elements/loading.el')
var avatarEl = require('../shared/elements/avatar.el')

module.exports = topicPage

function topicPage (state, emit) {
  var topic = state.topic.active

  if (!topic) {
    return loadingEl()
  }

  return html`
    <div class="container">
      ${topicTitleEl(state, emit)}

      ${topicEl(topic, state, emit)}

      ${topic.replies.map(reply => replyEl(reply, state, emit))}

      <hr>

      ${replyFormEl(state, emit)}
    </div>`
}

function topicTitleEl (state, emit) {
  if (false) return editTopicTitleEl(state, emit)

  var topic = state.topic.active
  var id = topic.metadata.tokenbb.category
  var category = state.categories.byId[id]

  return html`
    <header>
      <h2 class="title is-1">${topic.title}</h2>

      <p class="subtitle is-5">
        <span class="tag">
          ${category ? category.name : 'Uncategorized'}
        </span>
      </p>
    </header>`
}

function editTopicTitleEl (state, emit) {
  return html`
    <form>
      <input type="text" value=${state.topic.edit.post.title}>
      ${categoryDropdown(state.topic.edit.post.category, emit)}
      <a class="button">confirm</a><a class="button">cancel</a>
    </form>
  `
}

function categoryDropdown (state, emit) {
  return html`<select><option>category</option></select>`
}

function topicEl (topic, state, emit) {
  return html`
  <div>
    <hr>

    <div class="columns">
      <div class="column is-narrow">
        ${avatarEl()}
      </div>
      <div class="column is-8">
        <header class="level">
          <div class="level-left">
            <div class="level-item">
              ${topic.author}
            </div>
          </div>

          <div class="level-right">
            <p class="level-item">
              ${new Date(topic.created).toLocaleString()}
            </p>
          </div>
        </header>

        ${postBody(topic, state, emit)}

        <footer class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <p class="buttons">

                ${editPostButtonEl(topic, state, emit)}

              </p>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  </div>`
}

function postBody (post, state, emit) {
  return state.topic.edit.post && samePost(post, state.topic.edit.post)
    ? editPostEl(state.topic.edit.post, state, emit)
    : postContentEl(post, emit)
}

function postContentEl (post, emit) {
  return html`
    <article class="content">
      ${post.body}
    </article>`
}

function editPostEl (post, state, emit) {
  return html`
    <form class="form" onsubmit=${onSubmit}>

      <div class="field">
        <div class="control">
          <textarea  class="textarea" rows="3" name="content">${post.body}</textarea>
        </div>
      </div>

      <p class="buttons">
        <button class="button ${state.topic.edit.fetching ? 'is-loading' : ''}" role="submit">
          Save
        </button>
        <a class="button" onclick=${onCancel}>
          Cancel
        </button>
      </p>
    </form>`

  function onSubmit (e) {
    e.preventDefault()

    emit('topic:edit-post', post, e.target.content.value)
  }

  function onCancel (e) {
    emit('topic:hide-edit-post')
  }
}

function editPostButtonEl (post, state, emit) {
  return html`
    <a class="button is-small" onclick=${e => emit('topic:show-edit-post', post)}>
      <span class="icon is-small">
        <i class="fa fa-edit"></i>
      </span>
    </a>`
}

function replyEl (reply, state, emit) {
  return html`
    <div>

      <hr>

      <div class="columns">
        <div class="column is-narrow">
          ${avatarEl()}
        </div>
        <div class="column is-8">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                ${reply.author}
              </div>
            </div>

            <div class="level-right">
              <p class="level-item">
                ${new Date(reply.created).toLocaleString()}
              </p>
            </div>
          </nav>

          ${postBody(reply, state, emit)}

          <footer class="level">
            <div class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <p class="buttons">

                  ${editPostButtonEl(reply, state, emit)}

                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>`
}

function replyFormEl (state, emit) {
  if (!state.auth.username) {
    return html`<p>You must be logged in to post a reply.</p>`
  }

  var topic = state.topic.active
  var loading = state.topics.posting ? 'is-loading' : ''

  return html`
    <form style="width: 500px;" onsubmit=${reply}>
      <div class="field">
        <div class="control">
          <textarea class="textarea"
            name="content" 
            placeholder="Type here."
            style="width: 450px;"></textarea>
        </div>
      </div>
    
      <div class="field">
        <div class="control">
          <button role="submit" 
            class="button is-primary ${loading}">
            Reply
          </button>        
        </div>
      </div>
    </form>`

  function reply (e) {
    e.preventDefault()

    var { content } = e.target

    emit('create-reply', topic, content.value)
  }
}
