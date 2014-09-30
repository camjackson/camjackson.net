require('mongoose').connect('mongodb://localhost/writeitdown');
process.env.LOGGING = true;

var WriteItDown = require('./lib/writeitdown').WriteItDown;
new WriteItDown().start();
