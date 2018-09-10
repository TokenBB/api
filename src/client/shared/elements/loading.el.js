var html = require('choo/html')

module.exports = loadingEl

function loadingEl () {
  return html`
    <div class="container tc">
      <a class="button is-loading"></a>
    </div>`
}
