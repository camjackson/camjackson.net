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
exports.createResponder = createResponder;
