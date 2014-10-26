var Q = require('q');
var prompt = require('prompt');

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

exports.confirm = confirm;