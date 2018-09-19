module.exports = alertStore

function alertStore (state, emitter) {
  state.alerts = {
    messages: []
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('alert:error', onError)
    start()
  })

  function start () {
    setInterval(() => {
      var now = Date.now()

      state.alerts.messages.forEach((message, i) => {
        if (now - message.timestamp > 3000) {
          state.alerts.messages.splice(i, 1)
          emitter.emit('render')
        }
      })
    }, 1000)
  }

  function onError (text) {
    state.alerts.messages.push({
      timestamp: Date.now(),
      text
    })

    emitter.emit('render')
  }
}
