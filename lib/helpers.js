'use strict';
const prompt = require('prompt');
const log = require('./logging').logger;

function trimPost(postBody, postLink) {
  const foldText = /\r\n\[\/\/]: # \(fold\)\r\n.*/;
  const foldLocation = postBody.search(foldText);

  if (foldLocation === -1) {
    return postBody;
  }

  const trimmedPost = postBody.substr(0, foldLocation);
  return trimmedPost + '\r\n[Read more...](' + postLink + ')\r\n';
}

function confirm(message) {
  const Q = require('q');
  return Q.Promise(function(resolve, reject) {
    prompt.start();

    const property = {
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
function bodyMethodOverrider(req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method
  }
}

function addUserToResLocals(req, res, next) {
  res.locals.user = req.user;
  next();
}

function getEnvConfig() {
  return {
    title: process.env.SITE_TITLE,
    heading: process.env.SITE_HEADING,
    sub_heading: process.env.SITE_SUB_HEADING,
    domain: process.env.SITE_DOMAIN,
    google_analytics_id: process.env.GOOGLE_ANALYTICS_ID
  };
}

function errorHandler(err, req, res, next) {
  log.error(err);
  res.status(500).render('pages/error.jade');
}

function createResponder(res, errorMessage) {
  return function (err, html) {
    if (err) {
      log.error(errorMessage + ' : ' + err);
      res.status(500).render('pages/error.jade');
    } else {
      res.status(200).send(html);
    }
  };
}

exports.trimPost = trimPost;
exports.confirm = confirm;
exports.bodyMethodOverrider = bodyMethodOverrider;
exports.addUserToResLocals = addUserToResLocals;
exports.getEnvConfig = getEnvConfig;
exports.errorHandler = errorHandler;
exports.createResponder = createResponder;
