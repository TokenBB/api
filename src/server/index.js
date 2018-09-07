require('dotenv').config()

const PORT = 8000

var http = require('http')
var express = require('express')
var helmet = require('helmet')
var cors = require('cors')
var bodyParser = require('body-parser')
var steem = require('@steemit/steem-js')

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

app.get('/categories', auth, categories.list)
app.post('/categories/:categoryName', auth, categories.add)
app.delete('/categories/:categoryName', auth, categories.remove)

app.get('/topics', auth, topics.list)
app.get('/topics/:author/:permlink', auth, topics.get)
app.post('/topics', auth, topics.create)
app.delete('/topics', auth, topics.del)

app.post('/replies', auth, replies.create)

server.listen(PORT, () => {
  console.log('listening on ', PORT)
})
