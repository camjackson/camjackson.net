//configure mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/writeitdown');

//configure express
var app = require('express')();
app.use(require('morgan')());
app.set('view engine', 'jade');

//routes
var postHandler = require('./handlers/postHandler');
app.get('/', postHandler.root);

//run
app.listen(8080);
console.log('Listening on 8080');
