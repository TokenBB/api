require('dotenv').config()

const PORT = 8080

var http = require('http')
var express = require('express')
var helmet = require('helmet')
var cors = require('cors')
var bodyParser = require('body-parser')
var steem = require('@steemit/steem-js')

var db = require('./db')

var auth = require('./auth.middleware')
var categories = require('./routes/categories')
var topics = require('./routes/topics')
var replies = require('./routes/replies')

var app = express()
var server = http.createServer(app)

steem.api.setOptions({ url: process.env.STEEMD_URL })
steem.config.set('address_prefix', process.env.ADDRESS_PREFIX)
steem.config.set('chain_id', process.env.CHAIN_ID)

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.get('/api/v1/categories', auth, categories.list)
app.post('/api/v1/categories/:categoryName', auth, categories.add)
app.delete('/api/v1/categories/:categoryName', auth, categories.remove)

app.get('/api/v1/topics', auth, topics.list)
app.get('/api/v1/topics/:author/:permlink', auth, topics.get)
app.post('/api/v1/topics', auth, topics.create)
app.delete('/api/v1/topics', auth, topics.del)

app.post('/api/v1/replies', auth, replies.create)

db.start().then(() => {
  server.listen(PORT, () => {
    console.log('listening on ', PORT)
  })
})
