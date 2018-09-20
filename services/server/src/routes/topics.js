var db = require('../db')

module.exports = {
  del,
  list,
  create,
  get
}

function del (req, res) {
  if (!req.user) return res.status(403).end('not authenticated')
  if (req.user.name !== req.body.author) return res.status(403).end('not the author')

  var { permlink } = req.body
  var author = req.user.name

  var statement = 'delete from topics where author = ? and permlink = ?'
  var values = [ author, permlink ]

  db.execute(statement, values, err => {
    if (err) return console.log(err, res.status(500).end())

    return res.end()
  })
}

function list (req, res) {
  var { category } = req.query

  console.log('list topics!', category)

  var statement = 'select * from topics'
  if (category) statement += ' where category = ?'

  var values = category ? [ category ] : null

  console.log(statement, values)

  db.execute(statement, values, (err, rows) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(rows)
  })
}

function create (req, res) {
  if (!req.user) return res.status(403).end()

  var { author, permlink } = req.body

  var statement = 'insert into topics (author, permlink) values (?, ?)'
  var values = [ author, permlink ]

  db.execute(statement, values, err => {
    if (err) return console.log(err, res.status(500).end())

    return res.end()
  })
}

function get (req, res) {
  var { author, permlink } = req.params

  var statement = 'select * from topics where author = ? and permlink = ?;'
  var values = [ author, permlink ]

  db.execute(statement, values, (err, topics) => {
    if (err) return console.log(err, res.status(500).end())

    if (!topics.length) return res.status(404).end()

    listReplies(author, permlink, (err, replies) => {
      if (err) return console.log(err, res.status(500).end())

      var topic = topics[0]

      topic.replies = replies

      return res.json(topic)
    })
  })
}

function listReplies (author, permlink, cb) {
  console.log(author, permlink)
  var statement =
    `select replies.* from replies
    inner join topics 
    on replies.parent_id = topics.id 
    where topics.author = ? and topics.permlink = ?`

  var values = [ author, permlink ]

  db.execute(statement, values, (err, replies) => {
    if (err) return cb(err)

    console.log(replies)

    return cb(null, replies)
  })
}
