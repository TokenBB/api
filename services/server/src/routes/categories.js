var db = require('../db')

module.exports = {
  list,
  add,
  remove
}

function list (req, res) {
  var statement = 'select * from categories'

  db.execute(statement, (err, categories) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(categories)
  })
}

function add (req, res) {
  var { categoryName } = req.params

  var statement = 'insert into categories (name) values (?) '
  var values = [ categoryName ]

  db.execute(statement, values, (err) => {
    if (err) return console.log(err, res.status(500).end())

    var statement = 'select * from categories where name = ?'

    db.execute(statement, values, (err, results) => {
      if (err) return console.log(err, res.status(500).end())

      return res.json(results[0])
    })
  })
}

function remove (req, res) {
  var { categoryName } = req.params

  var statement = 'delete from categories where name = ?'
  var values = [ categoryName ]

  db.execute(statement, values, (err, result) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(result)
  })
}
