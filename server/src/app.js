//configure mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/writeitdown');

//configure express middleware
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
app.use(bodyParser.json());
app.use(morgan());

//configure routes
var postHandler = require('./handlers/postHandler');
app.get('/api/posts', postHandler.getPosts);
app.get('/api/posts/:id', postHandler.getPost);
app.post('/api/posts', postHandler.createPost);
app.delete('/api/posts/:id', postHandler.deletePost);

app.listen(8080);
console.log('Listening on 8080');
