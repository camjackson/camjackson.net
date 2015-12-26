'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');

const log = require('./logging').logger;
const views = require('./views');
const auth = require('./auth');
const createOrUpdatePost = require('./createOrUpdatePost');
const getFeed = require('./getFeed');

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'default secret', //TODO!
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: false
};

const wrap = lambda => (
  (req, res) => {
    const payload = {
      slug: req.params.slug || req.query.post,
      isAuthenticated: req.isAuthenticated()
    };
    const context = {
      succeed: html => res.send(html),
      fail: (status, location) => (res.redirect(status, location))
    };
    lambda({payload}, context);
  }
);

function bodyMethodOverrider (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method
  }
}

function errorHandler(err, req, res, next) {
  log.error(err);
  res.status(500).send('Something went wrong :(');
}

function App() {
  this.app = express();
  this.app.disable('x-powered-by');
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(methodOverride(bodyMethodOverrider));
  this.app.use(express.static('public'));
  this.app.use(expressSession(sessionOptions));
  this.app.use(passport.initialize());
  this.app.use(passport.session());
  this.app.use(errorHandler);

  this.app.use(helmet.xssFilter());
  this.app.use(helmet.frameguard('deny'));
  this.app.use(helmet.ieNoOpen());
  this.app.use(helmet.noSniff());
  this.app.use(helmet.hsts({ maxAge: 10886400000, includeSubDomains: true,  preload: true, force: true })); //18 weeks
  this.app.use(helmet.csp({
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://oss.maxcdn.com', 'https://www.google-analytics.com'],
    styleSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com', 'https://cdn.jsdelivr.net'],
    imgSrc: ["'self'", 'https://www.google-analytics.com'],
    fontSrc: ['https://maxcdn.bootstrapcdn.com'],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    reportUri: 'https://report-uri.io/report/camjackson'
  }));

  this.app.get('/', wrap(views.index));
  this.app.get('/archive/', wrap(views.archive));
  this.app.get('/post/:slug', wrap(views.post));
  this.app.get('/atom.xml', getFeed);
  this.app.get('/login', wrap(views.login));
  this.app.get('/write', auth.authorise, wrap(views.write));
  this.app.put('/posts/', auth.authorise, createOrUpdatePost);
  this.app.post('/login', auth.authenticate);
  this.app.post('/logout', auth.logOut);

  //For letsencrypt:
  this.app.get('/.well-known/acme-challenge/M5rHkTUg7nfVEF9K8J4bl8xsyXHInorJzY02ppGRCoQ', (req, res) => {
    res.type('text/plain');
    res.send('M5rHkTUg7nfVEF9K8J4bl8xsyXHInorJzY02ppGRCoQ.8RYOGbfpg_HSBz35otVictQhkbvFgKlGr7OIBKFFAdI');
  });
  this.app.get('/.well-known/acme-challenge/R9oTAu1wreSm3kCy_GVz_BGBeIDtkWXRhqYHvBgPhk0', (req, res) => {
    res.type('text/plain');
    res.send('R9oTAu1wreSm3kCy_GVz_BGBeIDtkWXRhqYHvBgPhk0.8RYOGbfpg_HSBz35otVictQhkbvFgKlGr7OIBKFFAdI');
  });

  //Redirects for annoying 404s:
  const redirects = [
    { from: '/feed', to: '/atom.xml' },
    { from: '/atom', to: '/atom.xml' },
    { from: '/rss', to: '/atom.xml' },
    { from: '/.rss', to: '/atom.xml' },
    { from: '/favicon.png', to: '/favicon.ico' },
    { from: '/new', to: '/' }
  ];

  redirects.forEach((redirect) => {
    this.app.get(redirect.from, (_, res) => { res.redirect(301, redirect.to)});
  })
}

App.prototype.start = function() {
  log.info('Starting app...');
  this.server = this.app.listen(process.env.PORT ||  8080);
  log.info('App listening on 8080');
};

App.prototype.stop = function(done) {
  log.info('App shutting down...');
  this.server.close(done);
  log.info('App stopped')
};

module.exports = App;
