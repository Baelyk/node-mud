const log = require('./logger')
const yaml = require('js-yaml')
const path = require('path')
const fs = require('fs-jetpack')

class Adventure {
  /**
   * @param {String} adventure - Path to the adventure folder
   * @param {String} name - Name of the adventure for the log
   * @param {Function} output - The function to call when there is something to display
   */
  constructor (adventure, name, output = undefined) {
    this.log = log('Adventure: ' + name)
    this.adventurePath = adventure
    this.output = output || log.info
  }
  /**
   * @param {Array} rooms - Array of room configs from a rooms.yaml
   */
  createRooms (rooms) {
    let roomInstances = [] // Array of Room instances
    rooms.forEach(room => {
      roomInstances.push(new Room(room))
    })
    return roomInstances
  }
  init () {
    this.log.info('Initializing adventure...')
    const roomsFile = path.resolve(this.adventurePath, 'rooms.yaml')
    this.rooms = this.createRooms(yaml.safeLoad(fs.read(roomsFile)))
    this.commands = {
      move: (args) => {
        this.currentRoom = this.rooms[this.currentRoom.move(args[0])]
        this.output(`You have entered ${this.currentRoom.name}`)
        this.output(this.currentRoom.describe())
      },
      look: () => {
        this.output(this.currentRoom.describe())
      }
    }

    this.currentRoom = this.rooms[0]
    this.output(this.currentRoom.describe())
  }
  /**
   * @param {String} command - The command that was input, e.g. 'move Hallway'
   */
  input (command) {
    command = command.split(' ')
    if (command[0] in this.commands) {
      this.commands[command[0]](command.slice(1))
    } else {
      this.log.warn(`Unknown command ${command[0]} with arguments ${command}`)
      this.output(`Unknown command ${command[0]}`)
    }
  }
}

class Room {
  /**
   * @param {Object} room - Room configuration from the rooms.yaml
   */
  constructor (room) {
    this.name = room.name
    this.description = room.description
    this.exits = room.exits
  }
  describe () {
    let exits = '\n\nExits: '
    this.exits.forEach(exit => {
      exits += `${exit.name} (${exit.key})\n`
    })
    return this.description + exits
  }
  findExitByKey (key) {
    for (let i = 0; i < this.exits.length; i++) {
      if (this.exits[i].key === key) return this.exits[i]
    }
  }
  findExitByName (name) {
    for (let i = 0; i < this.exits.length; i++) {
      if (this.exits[i].name === name) return this.exits[i]
    }
  }
  /**
  * @param {String, Number} exit - The key, name, or id of the desired exit
  */
  move (exit) {
    if (typeof exit === 'string') {
      let desiredExit = this.findExitByKey(exit) || this.findExitByName(exit)
      return desiredExit.room
    } else if (typeof exit === 'number' && exit < this.exits.length && exit > 0) {
      let desiredExit = this.exits[exit]
      return desiredExit.room
    }
    return new Error(`Unable to find exit '${exit}'`)
  }
}

module.exports = Adventure
