const PORT = 8000

var http = require('http')
var express = require('express')
var level = require('level')
var helmet = require('helmet')
var cors = require('cors')
var bodyParser = require('body-parser')

var auth = require('./auth.middleware')

var app = express()
var server = http.createServer(app)
var db = level('./_data')

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.post('/topics', auth, createTopic)
app.patch('/topics/:topicId', auth, updateTopic)
app.get('/topics', auth, listTopics)
app.get('/topics/:topicId', auth, getTopicById)

app.post('/replies', auth, createReply)
app.patch('/replies', auth, updateReply)

server.listen(PORT, () => {
  console.log('listening on ', PORT)
})

function createTopic (req, res) {
  var { category, slug, title, content } = req.body
  var postedOn = Date.now()
  var id = `${req.user.name}_${slug}`
  var author = req.user.name
  var status = 'draft'
  var topic = { status, id, postedOn, author, category, slug, title, content }
  var key = `topic:${id}`

  db.get(key, (err, value) => {
    if (!err || !err.notFound) return res.status(409).end('A topic with this id already exists.')

    db.put(`topic:${id}`, JSON.stringify(topic), err => {
      if (err) return console.error(err, res.status(500).end())

      return res.json(topic)
    })
  })
}

function updateTopic (req, res) {
  var { topicId } = req.params
  var { status } = req.body

  if (status !== 'publish') return res.status(400).end()

  db.get(`topic:${topicId}`, (err, topic) => {
    if (err && err.notFound) return res.status(404).end()

    topic = JSON.parse(topic)

    if (req.user.name !== topic.author) return res.status(403).end()

    topic.status = 'publish'

    db.put(`topic:${topicId}`, JSON.stringify(topic), err => {
      if (err) return console.error(err, res.status(500).end())

      return res.json(topic)
    })
  })
}

function listTopics (req, res) {
  var key = 'topic:'
  var opts = {
    gte: key,
    lte: String.fromCharCode(key.charCodeAt(0) + 1),
    keys: false
  }

  var topics = []

  db.createReadStream(opts)
    .on('data', val => topics.push(JSON.parse(val)))
    .on('end', () => res.json(topics))
    .on('err', err => console.error(err, res.status(500).end()))
}

function getTopicById (req, res) {
  var { topicId } = req.params

  db.get(`topic:${topicId}`, (err, topic) => {
    if (err) return console.error(err, res.status(404).end())

    findTopicReplies(topicId, (err, replies) => {
      if (err) return console.error(err, res.status(500).end())

      return res.json({
        topic: JSON.parse(topic),
        replies
      })
    })
  })
}

function createReply (req, res) {
  var { parent, content } = req.body
  var postedOn = Date.now()
  var author = req.user.name
  var status = 'draft'
  var reply = { status, parent, author, postedOn, content }

  db.put(`reply:${parent.id}:${postedOn}`, JSON.stringify(reply), err => {
    if (err) return console.error(err, res.status(500).end())

    return res.json(reply)
  })
}

function updateReply (req, res) {
  var { status, parent, postedOn } = req.body
  if (status !== 'publish') return res.status(400).end()

  db.get(`reply:${parent.id}:${postedOn}`, (err, reply) => {
    if (err && err.notFound) return res.status(404).end()

    reply = JSON.parse(reply)

    if (req.user.name !== reply.author) return res.status(403).end()

    reply.status = 'publish'

    db.put(`reply:${parent.id}:${postedOn}`, JSON.stringify(reply), err => {
      if (err) return console.error(err, res.status(500).end())

      return res.json(reply)
    })
  })
}

function findTopicReplies (topicId, callback) {
  var key = `reply:${topicId}:`
  var opts = {
    gte: key,
    lte: String.fromCharCode(key.charCodeAt(0) + 1),
    keys: false
  }

  var replies = []

  db.createReadStream(opts)
    .on('data', val => replies.push(JSON.parse(val)))
    .on('end', () => callback(null, replies))
    .on('error', err => callback(err))
}
