var Component = require('nanocomponent')
var html = require('choo/html')

var steem = require('../services/steem.service')

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

    return html`
      <div>
        <a href="/">◄ Back</a> 

        <h2 class="title is-1">${this.topic.title}</h2>
        <p class="subtitle is-5">${this.topic.metadata.category || 'Uncategorized'}</p>

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

    this.emit('create-comment', this.topic, content.value)
  }

  update () {
    return true
  }

  load () {
    var { author, permlink } = this.state.params

    steem.getTopic(author, permlink, (err, topic) => {
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
        <figure class="image" style="width: 64px; height: 64px; display: inline-block; padding: 0 2px;">
         <img class="is-rounded" src="https://bulma.io/images/placeholders/256x256.png">
        </figure>
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
          <figure class="image" style="width: 64px; height: 64px; display: inline-block; padding: 0 2px;">
           <img class="is-rounded" src="https://bulma.io/images/placeholders/256x256.png">
          </figure>
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

module.exports = function (state, emit) {
  return state.cache(TopicPage, 'topic-page').render(state, emit)
}
