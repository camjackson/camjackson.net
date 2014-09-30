var express = require('express');
var expressPromise = require('express-promise');
var log = require('./logging').logger;
var PostHandler = require('./handlers/postHandler').PostHandler;

function WriteItDown(postHandler) {
  this.app = express();
  this.app.set('view engine', 'jade');
  this.app.use(expressPromise());
  this.app.use(express.static('public'));
  this.app.use(errorHandler);

  postHandler = postHandler || new PostHandler();
  this.app.get('/', postHandler.getRoot);
  this.app.get('/write', postHandler.getWrite);
  this.app.put('/posts/:slug', postHandler.createPost);
}

WriteItDown.prototype.start = function() {
  log.info('Starting app...');
  this.server = app.listen(8080);
  log.info('App listening on 8080');
};

WriteItDown.prototype.stop = function(done) {
  log.info('App shutting down...');
  this.server.close(done);
  log.info('App stopped')
};

function errorHandler(err, req, res, next) {
  log.error(err);
  res.status(500).render('error.jade');
}

exports.WriteItDown = WriteItDown;
