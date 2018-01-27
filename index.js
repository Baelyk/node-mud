const server = require('./lib/server')
const Adventure = require('./lib/adventure')
const output = require('./lib/output')
const emitter = require('./lib/emitter')
const log = require('./lib/logger')('main')

const adventure = new Adventure('test/test-adventure-1', 'Test 1', output.output)

emitter.on('message', (message) => {
  console.log(message)
})

emitter.on('input', (input) => {
  adventure.input(input)
})

emitter.once('server-started', () => {
  adventure.init()
})

server.start(3001)
