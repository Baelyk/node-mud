const winston = require('winston')

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.simple()
    )
  }))
}

module.exports = logger
