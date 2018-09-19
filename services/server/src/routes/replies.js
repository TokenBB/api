var db = require('../db')

module.exports = {
  create
}

function create (req, res) {
  var { parent, author, permlink } = req.body

  var statement =
    `insert into replies (parent_id, author, permlink) 
      select id, ?, ?
      from topics 
      where author = ? and permlink = ?`
  var values = [ author, permlink, parent.author, parent.permlink ]

  db.execute(statement, values, err => {
    if (err) return console.log(err, res.status(500).end())

    return res.end()
  })
}
