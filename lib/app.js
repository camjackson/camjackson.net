var express = require('express');
var app = express();
app.use(require('express-promise')());
app.use(errorHandler);
app.set('view engine', 'jade');
app.use(express.static('public'));

var log = require('./logging').logger;

var mongoose = require('mongoose');
mongoose.connect(process.env.WRITEITDOWN_DB_STRING);

var postHandler = require('./handlers/postHandler');
app.get('/', postHandler.root);

exports.app = app;

var server;
exports.start = function() {
  log.info('Starting app...');
  server = app.listen(8080);
  log.info('App listening on 8080');
};

exports.stop = function(done) {
  log.info('App shutting down...');
  server.close(done);
  log.info('App stopped')
};

function errorHandler(err, req, res, next) {
  log.error(err);
  res.status(500).render('error.jade');
}
