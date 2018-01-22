const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const log = require('./logger')

function start (port = 3000) {
  app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../index.html'))
  })

  io.on('connection', socket => {
    log.info('a user connected')

    socket.on('message', msg => {
      io.emit('message', msg)
      log.info(msg)
    })

    socket.on('disconnect', () => {
      log.info('user disconnected')
    })
  })

  http.listen(port, () => {
    log.info(`listening on *:${port}`)
  })
}

module.exports.start = start
