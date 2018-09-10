var html = require('choo/html')

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
      ${topicTitle(state, emit)}

      ${post(topic, emit)}

      ${topic.replies.map(r => replyEl(r, emit))}

      <hr>

      ${replyFormEl(state, emit)}
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

    emit('topic:create-reply', topic, content.value)
  }
}

function topicTitle (state, emit) {
  if (state.topic.editing.toggled) return editTopicTitle(state, emit)

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
    <header>`
}

function editTopicTitle (state, emit) {
  return html`
    <form>
      <input type="text" value=${state.topic.editing.title}>
      ${categoryDropdown(state.topic.editing.category, emit)}
      <a class="button">confirm</a><a class="button">cancel</a>
    </form>
  `
}

function categoryDropdown (state, emit) {
  return html`<select><option>category</option></select>`
}

function post (topic, emit) {
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

        <article class="content">
          ${topic.body}
        </article>

        ${editPost(topic, emit)}

        <footer class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <p class="buttons">

                ${editButton(topic, emit)}

              </p>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  </div>`
}

function editPost (topic, emit) {
  return html`
    <form onsubmit=${onSubmit}>
      <input name="content" type="text" value=${topic.body}>
      <button>submit</button>
    </form>`

  function onSubmit (e) {
    e.preventDefault()

    emit('edit-post', topic, e.target.content.value)
  }
}

function editButton (topic, emit) {
  return ''

  // return html`
  //   <a class="button">
  //     <span class="icon">
  //       <i class="fa fa-edit"></i>
  //     </span>
  //   </a>`
}

function replyEl (data, emit) {
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
                ${data.author}
              </div>
            </div>

            <div class="level-right">
              <p class="level-item">
                ${new Date(data.created).toLocaleString()}
              </p>
            </div>
          </nav>

          <div class="content">${data.body}</div>
        </div>
      </div>
    </div>`
}
