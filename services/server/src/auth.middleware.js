if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
}

var request = require('request')

const HOST = process.env.STEEM_CONNECT_HOST || 'https://connect.tokenbb.io'

module.exports = auth

function auth (req, res, next) {
  var opts = {
    json: true,
    method: 'GET',
    url: HOST + '/api/me',
    headers: {
      authorization: req.headers.authorization
    }
  }

  request(opts, (err, data) => {
    if (err) return console.log(err, res.status(403).end())

    if (data.body && data.body.user) {
      req.user = {
        name: data.body.user
      }
    }

    next()
  })
}
