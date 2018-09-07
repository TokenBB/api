var html = require('choo/html')

module.exports = layout

function layout (view) {
  return function (state, emit) {
    return html`
      <body>
        <div class="container">
          <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
              <a href="/" class="navbar-item">
                tokenbb
              </a>
            </div>
            
            <div class="navbar-start">
              <a href="/settings" class="navbar-item">
                Settings
              </a>
            </div>

            <div class="navbar-end">
              <div class="navbar-item">
                ${profile(state, emit)}
              </div>
            </div>
          </nav>
        </div>

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
      ${state.auth.username}
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
