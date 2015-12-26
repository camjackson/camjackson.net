'use strict';
const bunyan = require('bunyan');

if (process.env.LOGGING) {
  exports.logger = bunyan.createLogger({name: 'camjackson.net'});
} else {
  exports.logger = {
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {}
  }
}
