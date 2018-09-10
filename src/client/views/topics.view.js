var html = require('choo/html')
var Dropdown = require('../components/Dropdown')

var dropdownConfig = {
  defaultOption: {
    name: 'Uncategorized'
  }
}

module.exports = topics

function topics (state, emit) {
  if (state.topics.loading) return html`<div class="container tc"><div class="button is-loading"></div></div>`

  return html`
    <div class="container">
      ${nav(state, emit)}

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th style="width: 30%">Topic</th>
            <th style="min-width: 20ex">Category</th>
            <th>Replies</th>
            <th>Upvotes</th>
            <th>Pending Payout</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          ${formatTopics(state.topics.list)}
        </tbody>

      </table>
    </div>`

  function formatTopics (topics) {
    return topics
      .filter(topic => (
        !state.categories.selected.id ||
        topic.metadata.tokenbb.category === state.categories.selected.id))
      .map(topic => row(topic, state, emit))
  }
}

function nav (state, emit) {
  var { categories } = state

  return html`
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <div class="" style="min-width: 12rem; text-align: left;">
          ${state.cache(Dropdown, 'filter-by-category', dropdownConfig).render(categories.list)}
          </div>
        </div>
      </div>
      
      <div class="level-item">
    
      </div>

      <div class="level-right">
        <div class="level-item">
          <a href="/new" class="button has-icon">
            New Topic
          </a>
        </div>
      </div>
    </nav>`
}

function row (topic, state, emit) {
  return html`
    <tr class="is-vcentered" style="min-height: 3rem; ">
      <td>
        <a href="/topics/${topic.author}/${topic.permlink}">
          ${topic.title}
        </a>
      </td>
      <td>${categoryEl(topic, state)}</td>
      <td>${topic.children}</td>
      <td>${topic.net_votes}</td>
      <td>
        <div class="select is-small">
          <select>
            <option>${topic.pending_payout_value}</option>
          </select>
        </div>
      </td>
      <td>
        <a class="button is-small" onclick=${e => deleteTopic(topic)}>
          <span class="icon is-small">
            <i class="fa fa-trash"></i>
          </span>
        </a>
      </td>
    </tr>`

  function deleteTopic (topic) {
    emit('delete-topic', topic)
  }
}

function categoryEl (topic, state) {
  var id = topic.metadata.tokenbb.category
  var category = state.categories.byId[id]

  return category ? category.name : 'Uncategorized'
}
