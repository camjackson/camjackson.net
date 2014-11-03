var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressPromise = require('express-promise');
var expressSession = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var log = require('./logging').logger;
var helpers = require('./helpers');
var bodyMethodOverrider = helpers.bodyMethodOverrider;
var errorHandler = helpers.errorHandler;
var PostHandler = require('./handlers/postHandler').PostHandler;
var AuthHandler = require('./handlers/authHandler').AuthHandler;

var sessionOptions = {
  secret: process.env.SESSION_SECRET || 'default secret', //TODO!
  resave: true,
  saveUninitialized: true
};

function WriteItDown(handlers) {
  this.app = express();
  this.app.set('view engine', 'jade');
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(methodOverride(bodyMethodOverrider));
  this.app.use(express.static('public'));
  this.app.use(expressPromise());
  this.app.use(expressSession(sessionOptions));
  this.app.use(flash());
  this.app.use(passport.initialize());
  this.app.use(passport.session());
  this.app.use(errorHandler);

  var authHandler = handlers.authHandler || new AuthHandler();
  this.app.post('/login', authHandler.authenticate.bind(authHandler));
  this.app.get('/login', authHandler.getLogin.bind(authHandler));

  var postHandler = handlers.postHandler || new PostHandler();
  this.app.get('/', postHandler.getRoot.bind(postHandler));
  this.app.get('/posts/:slug', postHandler.getPost.bind(postHandler));
  this.app.get('/write', postHandler.getWrite.bind(postHandler));
  this.app.put('/posts/', postHandler.createOrUpdatePost.bind(postHandler));
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

exports.WriteItDown = WriteItDown;
