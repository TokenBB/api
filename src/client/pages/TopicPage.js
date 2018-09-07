var Component = require('nanocomponent')
var html = require('choo/html')

var postService = require('../services/post.service')

class TopicPage extends Component {
  constructor (name, state, emit) {
    super(name)

    this.state = state
    this.emit = emit

    this.topic = null

    this.reply = this.reply.bind(this)
  }

  createElement (state, emit) {
    if (!this.topic) return html`<div><a class="button is-loading"></a></div>`

    var id = this.topic.metadata.tokenbb.category
    var category = state.categories.byId[id]

    return html`
      <div class="container">
        <h2 class="title is-1">${this.topic.title}</h2>
        <p class="subtitle is-5">
          <span class="tag">
            ${category ? category.name : 'Uncategorized'}
          </span>
        </p>

        ${post(this.topic, this.emit)}
        ${this.topic.replies.map(r => reply(r, this.emit))}

        <hr>

        ${this.form(state, emit)}
      </div>`
  }

  form (state, emit) {
    var loading = state.topics.posting ? 'is-loading' : ''

    return html`
      <form style="width: 500px;" onsubmit=${this.reply}>
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
  }

  reply (e) {
    e.preventDefault()

    var { content } = e.target

    this.emit('create-reply', this.topic, content.value)
  }

  update () {
    return true
  }

  notFound () {
    this.emit(this.state.events.PUSH_STATE, '/404')
  }

  load () {
    var { author, permlink } = this.state.params

    postService.getTopic(author, permlink).then(topic => {
      if (!topic) return this.notFound()

      this.topic = topic
      this.rerender()
    })
  }

  unload () {
    this.topic = null
  }
}

function post (topic, emit) {
  return html`
  <div>

    <hr>

    <div class="columns">
      <div class="column is-narrow">
        ${avatar()}
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

        <footer class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <p class="buttons">

                <a class="button">
                  <span class="icon">
                    <i class="fa fa-edit"></i>
                  </span>
                </a>

              </p>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  </div>`
}

function reply (data, emit) {
  return html`
    <div>

      <hr>

      <div class="columns">
        <div class="column is-narrow">
          ${avatar()}
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

function avatar () {
  return html`
    <figure class="image  is-48x48 avatar">
      <img class="is-rounded" src="https://bulma.io/images/placeholders/256x256.png">
    </figure>`
}

module.exports = function (state, emit) {
  return state.cache(TopicPage, 'topic-page').render(state, emit)
}
