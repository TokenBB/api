require('dotenv').config()

const { MYSQL_USER, MYSQL_PASSWORD } = process.env
const PORT = 8000

var http = require('http')
var express = require('express')
var helmet = require('helmet')
var cors = require('cors')
var bodyParser = require('body-parser')
var steem = require('@steemit/steem-js')
var mysql = require('mysql2')

var auth = require('./auth.middleware')

var app = express()
var server = http.createServer(app)
var db = mysql.createConnection({
  database: 'tokenbb',
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
})

steem.api.setOptions({ url: 'wss://' + process.env.STEEMD_URL })
steem.config.set('address_prefix', process.env.ADDRESS_PREFIX)
steem.config.set('chain_id', process.env.CHAIN_ID)

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.get('/categories', auth, listCategories)
app.post('/categories/:categoryName', auth, addCategory)
app.delete('/categories/:categoryName', auth, removeCategory)

app.post('/topics', auth, createTopic)
app.get('/topics', auth, listTopics)

server.listen(PORT, () => {
  console.log('listening on ', PORT)
})

function listCategories (req, res) {
  var statement = 'select * from categories'

  db.execute(statement, (err, categories) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(categories)
  })
}

function addCategory (req, res) {
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

function removeCategory (req, res) {
  var { categoryName } = req.params

  var statement = 'delete from categories where name = ?'
  var values = [ categoryName ]

  db.execute(statement, values, (err, result) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(result)
  })
}

function createTopic (req, res) {
  var { author, permlink } = req.body

  var statement = 'insert into topics (author, permlink) values (?, ?)'
  var values = [ author, permlink ]

  db.execute(statement, values, err => {
    if (err) return console.log(err, res.status(500).end())

    return res.end()
  })
}

function listTopics (req, res) {
  var { category } = req.query

  var statement = 'select * from topics'
  if (category) statement += ' where category = ?'

  var values = category ? [ category ] : null

  db.execute(statement, values, (err, rows) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(rows)
  })
}
