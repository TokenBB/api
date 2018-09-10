var Component = require('nanocomponent')
var html = require('choo/html')

var wp = require('../services/wp.service')

class SettingsPage extends Component {
  constructor (name, state, emit) {
    super(name)

    this.state = state
    this.emit = emit

    this.categories = null

    this.addCategory = this.addCategory.bind(this)
  }

  createElement (state, emit) {
    if (!this.categories) return html`<div class="container tc"><a class="button is-loading"></a></div>`

    return html`
      <div>
        <h2 class="title is-4">Settings</h2>
        <ul>
          ${this.categories.map(c => html`
            <li>
              <span>${c.name}</span> 
              <a class="button is-small" onclick=${e => this.removeCategory(c.name)}>
                <span class="icon is-small">
                  <i class="fa fa-minus-circle"></i>
                </span>
              </a>
            </li>
          `)}
        </ul>

        <form onsubmit=${this.addCategory}>
          <input name="category_name" type="text">

          <button role="submit" class="button">add</button>

        </form>
      </div>`
  }

  addCategory (e) {
    e.preventDefault()

    wp.addCategory(e.target.category_name.value).then(result => {
      this.categories.push(result)
      this.rerender()
    })
  }

  removeCategory (name) {
    wp.removeCategory(name).then(() => {
      var idx = this.categories.findIndex(c => c.name === name)

      this.categories.splice(idx, 1)
      this.rerender()
    })
  }

  update () {
    return true
  }

  load () {
    wp.listCategories().then(categories => {
      this.categories = categories
      this.rerender()
    })
  }

  unload () {
    this.categories = null
  }
}

module.exports = function (state, emit) {
  return state.cache(SettingsPage, 'settings-page').render(state, emit)
}
