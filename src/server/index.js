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

app.post('/topics', auth, createTopic)
app.get('/topics', auth, listTopics)

server.listen(PORT, () => {
  console.log('listening on ', PORT)
})

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
