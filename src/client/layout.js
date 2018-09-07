var html = require('choo/html')

module.exports = layout

function layout (view) {
  return function (state, emit) {
    return html`
      <body>
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <div class="navbar-item">
              tokenbb
            </div>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              ${profile(state, emit)}
            </div>
          </div>
        </nav>

        <section class="section">
          ${view(state, emit)}
        </section>
      </body>`
  }
}

function profile (state, emit) {
  if (state.auth.accessToken === null) return connect(state, emit)

  return html`
    <p>
      currently logged in as ${state.auth.username}
      (<a onclick=${e => emit('logout')}>logout</a>)
    </p>`
}

function connect (state, emit) {
  return html`
    <p>
      <a class="button is-primary" href="${state.auth.loginURL}">
        Connect
      </a>
    </p>`
}
