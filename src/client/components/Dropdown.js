var html = require('choo/html')
var Component = require('choo/component')

function noop () {}

module.exports = class Dropdown extends Component {
  constructor (name, state, emit, config) {
    super(name)

    this.name = name
    this.state = state
    this.emit = emit
    this.config = Object.assign({
      defaultOption: {
        name: 'Select an option'
      }
    }, config)

    this.toggled = false
    this.selected = null

    this.trigger = this.trigger.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.select = this.select.bind(this)
  }

  update (options, selected) {
    return true
  }

  createElement (options) {
    this.el = html`
      <div class="dropdown ${this.toggled ? 'is-active' : ''}">
        <div class="dropdown-trigger" onclick=${this.trigger}>
          <button class="button" 
            aria-haspopup="true" 
            aria-controls="dropdown-menu">
            <span>${this.selected ? this.selected.name : this.config.defaultOption.name}</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>

        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            ${options.map(option => html`
              <a href="#" class="dropdown-item" 
                onclick=${e => this.select(option)}>
                ${option.name}
              </a>`)}
          </div>
        </div>
      </div>`

    return this.el
  }

  trigger (e) {
    e.preventDefault()
    e.stopPropagation()

    if (!this.toggled) {
      this.open()
    }
  }

  open () {
    this.toggled = true
    this.rerender()
    document.addEventListener('click', this.close)
  }

  close () {
    this.toggled = false
    this.rerender()
    document.removeEventListener('click', this.close)
  }

  select (option) {
    this.selected = option

    this.emit(`${this.name}:select`, option)

    this.close()
  }
}
