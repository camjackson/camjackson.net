'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressPromise = require('express-promise');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const log = require('./logging').logger;
const helpers = require('./helpers');
const AuthHandler = require('./handlers/authHandler').AuthHandler;
const PostHandler = require('./handlers/postHandler').PostHandler;
const FeedHandler = require('./handlers/feedHandler');
const Post = require('./models').Post;

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'default secret', //TODO!
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: false
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');
const LoginComponent = require('./components/login');
const WriteComponent = require('./components/write');

function renderIndex(_, res) {
  Post.find({}).sort({posted: 'descending'}).limit(2).exec().then((posts) => {
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    res.send(ReactDOMServer.renderToStaticMarkup(<IndexComponent posts={posts}/>));
  });
}

function renderArchive(_, res) {
  Post.find({}).sort({posted: 'descending'}).exec().then((posts) => {
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    res.send(ReactDOMServer.renderToStaticMarkup(<ArchiveComponent posts={posts}/>));
  });
}

function renderPost(req, res) {
  Post.findOne({slug: req.params.slug}).exec().then((post) => {
    res.send(ReactDOMServer.renderToStaticMarkup(<PostComponent post={post}/>));
  });
}

function renderLogin(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(303, '/write')
  } else {
    res.send(ReactDOMServer.renderToStaticMarkup(<LoginComponent/>))
  }
}

function renderWrite(req, res) {
  Post.findOne({ slug: req.query.post }).exec().then(function(post) {
    res.send(ReactDOMServer.renderToStaticMarkup(<WriteComponent post={post || {}}/>))
  });
}

function App(handlers) {
  this.app = express();
  this.app.set('view engine', 'jade');
  this.app.disable('x-powered-by');
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(methodOverride(helpers.bodyMethodOverrider));
  this.app.use(express.static('public'));
  this.app.use(expressPromise());
  this.app.use(expressSession(sessionOptions));
  this.app.use(flash());
  this.app.use(passport.initialize());
  this.app.use(passport.session());
  this.app.use(helpers.addUserToResLocals);
  this.app.use(helpers.errorHandler);

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

  const authHandler = handlers.authHandler || new AuthHandler();
  const authorise = authHandler.authorise;

  this.app.get('/', renderIndex);
  this.app.get('/archive/', renderArchive);
  this.app.get('/post/:slug', renderPost);
  this.app.get('/login', renderLogin);
  this.app.get('/write', authorise, renderWrite);

  this.app.post('/login', authHandler.authenticate.bind(authHandler));
  this.app.post('/logout', authHandler.logOut.bind(authHandler));

  const postHandler = handlers.postHandler || new PostHandler();
  this.app.put('/posts/', authorise, postHandler.createOrUpdatePost.bind(postHandler));

  const feedHandler = handlers.feedHandler || FeedHandler;
  this.app.get('/atom.xml', feedHandler.getFeed);

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

exports.App = App;
