var db_host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';

require('mongoose').connect('mongodb://'+ db_host + '/writeitdown');
process.env.LOGGING = true;

var WriteItDown = require('./lib/writeitdown').WriteItDown;
new WriteItDown().start();
