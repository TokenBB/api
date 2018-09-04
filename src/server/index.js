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

app.post('/posts', auth, createPost)
app.get('/posts', auth, listPosts)

server.listen(PORT, () => {
  console.log('listening on ', PORT)
})

function createPost (req, res) {
  var { author, permlink } = req.body
  var values = [ author, permlink ]

  db.execute('insert into posts (author, permlink) values (?, ?)', values, err => {
    if (err) return console.log(err, res.status(500).end())

    return res.end()
  })
}

function listPosts (req, res) {
  db.execute('select * from posts', (err, rows) => {
    if (err) return console.log(err, res.status(500).end())

    return res.json(rows)
  })
}
