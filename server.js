var db_host = process.env.DB_HOST || 'localhost';
require('mongoose').connect('mongodb://'+ db_host + '/writeitdown');

process.env.LOGGING = true;

process.env.SESSION_SECRET = 'super duper secret'; //TODO!

var WriteItDown = require('./lib/writeitdown').WriteItDown;
new WriteItDown({}).start();
