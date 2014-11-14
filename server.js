require('mongoose').connect(process.env.MONGOLAB_URI || 'mongodb://localhost/writeitdown');

process.env.LOGGING = true;

process.env.SESSION_SECRET = 'super duper secret'; //TODO!

var WriteItDown = require('./lib/writeitdown').WriteItDown;
new WriteItDown({}).start();
