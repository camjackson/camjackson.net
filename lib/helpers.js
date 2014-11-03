var Q = require('q');
var prompt = require('prompt');
var log = require('./logging').logger;

function confirm(message) {
  return Q.Promise(function(resolve, reject) {
    prompt.start();

    var property = {
      name: 'confirmation',
      message: message,
      validator: /^y|n$/,
      warning: 'Please enter (y)es or (n)o.'
    };
    prompt.get(property, function(err, result) {
      if (result.confirmation == 'y') {
        resolve();
      } else {
        reject();
      }
    });
  });
}

//This makes _method=PUT work with express routes.
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

function createResponder(res, errorMessage) {
  return function (err, html) {
    if (err) {
      log.error(errorMessage + ' : ' + err);
      res.status(500).render('error.jade');
    } else {
      res.status(200).send(html);
    }
  };
}

exports.confirm = confirm;
exports.bodyMethodOverrider = bodyMethodOverrider;
exports.errorHandler = errorHandler;
exports.createResponder = createResponder;
