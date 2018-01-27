const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const log = require('./logger')('Server')
const emitter = require('./emitter')

function start (port = 3000) {
  app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../index.html'))
  })

  io.on('connection', socket => {
    log.info('a user connected')

    socket.on('message', input => {
      emitter.emit('input', input)
      log.info(input)
    })

    socket.on('disconnect', () => {
      log.info('user disconnected')
    })
  })

  http.listen(port, () => {
    log.info(`listening on *:${port}`)
    log.info(emitter.emit('server-started'))
  })
}

module.exports.start = start
