require('mongoose').connect('mongodb://localhost/writeitdown');
process.env.LOGGING = true;

require('./lib/app').start();