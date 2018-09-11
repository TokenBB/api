var html = require('choo/html')

module.exports = alertsEl

function alertsEl (state) {
  var messages = state.alerts.messages

  return html`
    <div class="alert-area pv2 ph5">
      <div class="flex flex-column items-end">
        ${messages.map(message => messageEl(message))}
      </div>
    </div>`
}

function messageEl (message) {
  return html`
    <div class="notification is-danger w5">
      ${message.text}
    </div>`
}
