const PORT = 8000

var http = require('http')

var server = http.createServer(function (req, res) {
  res.end('ok.\n')
})

server.listen(PORT, () => {
  console.log('listening on ', PORT)
})
