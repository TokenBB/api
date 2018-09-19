var html = require('choo/html')
var Dropdown = require('../components/Dropdown')
var loadingEl = require('../shared/elements/loading.el')

var dropdownConfig = {
  defaultOption: {
    name: 'Uncategorized'
  }
}

module.exports = topicsPage

function topicsPage (state, emit) {
  if (state.topics.loading) return loadingEl()

  return html`
    <div class="container">
      ${nav(state, emit)}
      <table class="table is-fullwidth">
        ${theadEl(state, emit)}
        ${tbodyEl(state, emit)}
      </table>
    </div>`
}

function nav (state, emit) {
  var { categories } = state

  return html`
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          ${state.cache(Dropdown, 'filter-by-category', dropdownConfig).render(categories.list)}
        </div>
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

function theadEl (state, emit) {
  return html`
    <thead>
      <tr>
        <th>Topic</th>
        <th>Category</th>
        <th class="tc">Replies</th>
        <th class="tc">Upvotes</th>
        <th class="tc is-hidden-mobile">Pending Payout</th>
        <th class="tc is-hidden-mobile"></th>
      </tr>
    </thead>`
}

function tbodyEl (state, emit) {
  return html`<tbody>${formatRows()}</tbody>`

  function formatRows () {
    return state.topics.list
      .filter(topic => {
        return (
          !state.categories.selected.id ||
          topic.metadata.tokenbb.category === state.categories.selected.id
        )
      })
      .map(topic => row(topic, state, emit))
  }
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
      <td class="tc">${topic.children}</td>
      <td class="tc">${topic.net_votes}</td>
      <td class="tc is-hidden-mobile">
        <div class="select is-small">
          <select>
            <option>${topic.pending_payout_value}</option>
          </select>
        </div>
      </td>
      <td class="tc is-hidden-mobile">
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
