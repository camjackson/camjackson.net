process.env.LOGGING = true;

var express = require('express');
var app = express();
app.use(require('morgan')('dev'));
app.set('view engine', 'jade');
app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/writeitdown');

var postHandler = require('./lib/handlers/postHandler');
app.get('/', postHandler.root);

app.listen(8080);
console.log('Listening on 8080');
