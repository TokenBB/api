var layout = require('./layout')
var TopicPage = require('./pages/TopicPage')

module.exports = router

function router (state, emitter, app) {
  var routes = [{
    route: '/',
    view: require('./views/topics.view')
  }, {
    route: '/topics/:author/:permlink',
    view: TopicPage
  }, {
    route: '/new',
    view: require('./views/new-topic.view')
  }]

  routes.forEach(({ route, view }) => app.route(route, layout(view)))
}
