var html = require('choo/html')
var alertsEl = require('./alerts/alerts.el')

module.exports = layout

function layout (view) {
  return function (state, emit) {
    return html`
      <body>
        ${alertsEl(state, emit)}
        ${navbar(state, emit)}

        <section class="section mt3">
          ${view(state, emit)}
        </section>
      </body>`
  }
}

function navbar (state, emit) {
  return html`
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a href="/" class="navbar-item">
            TokenBB
          </a>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div class="navbar-menu">
          <div class="navbar-start">
            <div class="navbar-item">
              <a href="/settings" class="navbar-item">
                Settings
              </a>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item is-expanded tr">
              ${profile(state, emit)}
            </div>
          </div>
        </div>
      </div>
    </nav>`
}

function profile (state, emit) {
  if (state.auth.accessToken === null) return connect(state, emit)

  return html`
    <p class="tr">
      ${state.auth.username}
      (<a onclick=${e => emit('logout')}>logout</a>)
    </p>`
}

function connect (state, emit) {
  return html`
    <p class="tr is-right">
      <a class="button is-primary" href="${state.auth.loginURL}">
        Connect
      </a>
    </p>`
}
