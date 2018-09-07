var db = require('../db')

module.exports = {
  list,
  create,
  get
}

function list (req, res) {
  var { category } = req.query

  var statement = 'select * from topics'
  if (category) statement += ' where category = ?'

  var values = category ? [ category ] : null

  db.execute(statement, values, (err, rows) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(rows)
  })
}

function create (req, res) {
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
