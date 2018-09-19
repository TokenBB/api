var html = require('choo/html')

module.exports = loadingEl

function loadingEl () {
  return html`
    <div class="container tc pv5">
      <div class="spinner"></div>
    </div>`
}
