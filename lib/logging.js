var bunyan = require('bunyan');

if (process.env.LOGGING) {
  exports.logger = bunyan.createLogger({name: 'writeitdown'});
} else {
  exports.logger = {
    trace: function(){},
    debug: function(){},
    info: function(){},
    warn: function(){},
    error: function(){},
    fatal: function(){}
  }
}
