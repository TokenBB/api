var html = require('choo/html')

var Dropdown = require('../components/Dropdown')

module.exports = newTopic

var dropdownConfig = {
  defaultOption: {
    name: 'Uncategorized'
  }
}

function newTopic (state, emit) {
  return html`
    <div>
      <a href="/">◄ Back</a> 

      <h2 class="title is-1">Create a New Topic</h2>

      <form style="width: 500px;" onsubmit=${onSubmit}>
        <div class="level">
          <div class="level-item">
            <input name="title" type="text" class="input" placeholder="Type title here">
          </div>

          <div class="level-item">
            ${state.cache(Dropdown, 'new-post-category', dropdownConfig).render(state.categories.list)}
          </div>
        </div>

        ${editor(state, emit)}

        <div class="field">
          <div class="control">
            <button role="submit" 
              class="button is-primary ${state.topics.posting ? 'is-loading' : ''}">
              Create Topic
            </button>
          </div>
        </div>
      </form>

    </div>`

  function onSubmit (e) {
    e.preventDefault()

    var { title, content } = e.target
    var category = state.cache(Dropdown, 'new-post-category').selected.id || null

    emit('create-topic', category, title.value, content.value)
  }
}

function editor (state, emit) {
  return html`
    <div class="field">
      <div class="control">
        <textarea name="content" 
          class="textarea" 
          placeholder="Type here." 
          style="width: 450px;"></textarea>
      </div>
    </div>`
}
