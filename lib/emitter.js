const EventEmitter = require('events')
const log = require('./logger')('Emitter')

const emitter = new EventEmitter()

emitter.on('uncaughtException', error => {
  log.error(error)
})

module.exports = emitter
