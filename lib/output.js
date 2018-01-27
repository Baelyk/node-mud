const emitter = require('./emitter')

function output (message) {
  emitter.emit('message', message)
}

module.exports.output = output
