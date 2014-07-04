var express = require('express');
var mongoose = require('mongoose');
var postHandler = require('./handlers/postHandler');

var app = express();

mongoose.connect('mongodb://localhost/writeitdown');

app.get('/api/posts', postHandler.getPosts);
app.get('/api/posts/:post_id', postHandler.getPost);
app.post('/api/posts', postHandler.createPost);
app.delete('/api/posts/:post_id', postHandler.deletePost);

app.listen(8080);

console.log('Listening on :8080');
