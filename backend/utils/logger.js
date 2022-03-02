require('express-async-errors');
const { createLogger, transports, format } = require('winston');
const moment = require('moment');
const { combine, timestamp, printf, colorize, simple } = format;

const logFormat = printf(
  ({ level, message, timestamp }) => `${timestamp}|${level}|${message}`
);

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console({
      level: 'info',
      format: combine(colorize(), simple())
    }),
    new transports.File({
      filename: `/app/data/logs/${moment().format('YYYYMMDD')}-error.log`,
      level: 'error',
      handleExceptions: true,
      handleRejections: true
    }),
    new transports.File({
      filename: `/app/data/logs/${moment().format('YYYYMMDD')}-info.log`
    })
  ],
  exitOnError: false
});

module.exports = logger;
