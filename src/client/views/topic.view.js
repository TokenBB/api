var html = require('choo/html')

module.exports = view

function view (state, emit) {
  var { author, permlink } = state.params

  var topic = state.topics.list.find(t => {
    return t.permlink === permlink && t.author === author
  })

  if (!topic) return ''

  topic.replies = []

  return html`
    <div>
      <a href="/">◄ Back</a> 

      <h2 class="title is-1">${topic.title}</h2>
      <p>${topic.category}</p>

      ${post(topic, emit)}

      ${topic.replies.map(r => reply(r, emit))}

      <hr>

      <form style="width: 500px;" onsubmit=${onSubmit}>
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
              class="button is-primary ${state.topics.posting ? 'is-loading' : ''}">
              Reply
            </button>        
          </div>
        </div>
      </form>
    </div>`

  function onSubmit (e) {
    e.preventDefault()

    var { content } = e.target

    emit('create-comment', topic, content.value)
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
        <nav class="level">
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
        </nav>

        <div class="content">
          ${topic.body}
        </div>

        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <p class="buttons">

                <a class="button">
                  <span class="icon">
                    <i class="fa fa-edit"></i>
                  </span>
                </a>

                <a class="button">
                  <span class="icon is-small">
                    <i class="fa fa-reply"></i>
                  </span>
                  <span>Reply</span>
                </a>

              </p>
            </div>
          </div>
        </div>
        
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
                ${data.postedBy}
              </div>
            </div>

            <div class="level-right">
              <p class="level-item">
                ${new Date(data.postedOn).toLocaleString()}
              </p>
            </div>
          </nav>
        </div>
      </div>
    </div>`
}
