process.env.LOGGING = true;
process.env.WRITEITDOWN_DB_STRING = 'mongodb://localhost/writeitdown';
require('./lib/app').start();