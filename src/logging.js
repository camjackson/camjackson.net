'use strict';
const bunyan = require('bunyan');

const logger = bunyan.createLogger({name: 'camjackson.net'});

if (process.env.NO_LOGGING) {
  logger.level(bunyan.ERROR);
}

module.exports = logger;
