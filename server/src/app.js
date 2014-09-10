process.env.LOGGING = true;

var app = require('express')();
app.use(require('morgan')('dev'));
app.set('view engine', 'jade');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/writeitdown');

var postHandler = require('./handlers/postHandler');
app.get('/', postHandler.root);

app.listen(8080);
console.log('Listening on 8080');
