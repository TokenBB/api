var html = require('choo/html')

module.exports = avatar

function avatar () {
  return html`
    <figure class="image  is-48x48 avatar">
      <img class="is-rounded" src="https://bulma.io/images/placeholders/256x256.png">
    </figure>`
}
