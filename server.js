var db_connection_string = process.env.MONGOLAB_URI || 'mongodb://localhost/writeitdown';
require('mongoose').connect(db_connection_string);

process.env.LOGGING = true;

process.env.SESSION_SECRET = 'super duper secret'; //TODO!

var WriteItDown = require('./lib/writeitdown').WriteItDown;
new WriteItDown({}).start();
