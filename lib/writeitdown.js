var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressPromise = require('express-promise');
var log = require('./logging').logger;
var PostHandler = require('./handlers/postHandler').PostHandler;

function WriteItDown(postHandler) {
  this.app = express();
  this.app.set('view engine', 'jade');
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(methodOverride(bodyMethodOverrider));
  this.app.use(express.static('public'));
  this.app.use(expressPromise());
  this.app.use(errorHandler);

  postHandler = postHandler || new PostHandler();
  this.app.get('/', postHandler.getRoot);
  this.app.get('/posts/:slug', postHandler.getPost);
  this.app.get('/write', postHandler.getWrite);
  this.app.put('/posts/', postHandler.createOrUpdatePost);
}

WriteItDown.prototype.start = function() {
  log.info('Starting app...');
  this.server = this.app.listen(8080);
  log.info('App listening on 8080');
};

WriteItDown.prototype.stop = function(done) {
  log.info('App shutting down...');
  this.server.close(done);
  log.info('App stopped')
};

function bodyMethodOverrider(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method
  }
}

function errorHandler(err, req, res, next) {
  log.error(err);
  res.status(500).render('error.jade');
}

exports.WriteItDown = WriteItDown;
