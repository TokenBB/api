var layout = require('./layout')
var SettingsPage = require('./pages/SettingsPage')

module.exports = router

function router (state, emitter, app) {
  var routes = [{
    route: '/',
    view: require('./views/topics.view')
  }, {
    route: '/topics/:author/:permlink',
    view: require('./topic/topic.page')
  }, {
    route: '/settings',
    view: SettingsPage
  }, {
    route: '/new',
    view: require('./views/new-topic.view')
  }]

  routes.forEach(({ route, view }) => app.route(route, layout(view)))
}
