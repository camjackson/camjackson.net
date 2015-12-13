'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressPromise = require('express-promise');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const log = require('./logging').logger;
const helpers = require('./helpers');
const AuthHandler = require('./handlers/authHandler').AuthHandler;
const UserHandler = require('./handlers/userHandler').UserHandler;
const SettingsHandler = require('./handlers/settingsHandler').SettingsHandler;
const PostHandler = require('./handlers/postHandler').PostHandler;
const Post = require('./models').Post;

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'default secret', //TODO!
  resave: true,
  saveUninitialized: true
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');

function renderNewSite(_, res) {
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

function renderNewPost(req, res) {
  Post.findOne({slug: req.params.slug}).exec().then((post) => {
    res.send(ReactDOMServer.renderToStaticMarkup(<PostComponent post={post}/>));
  });
}

function WriteItDown(handlers) {
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
  this.app.use(helmet.csp({
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'https://oss.maxcdn.com"],
    styleSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com', 'https://cdn.jsdelivr.net'],
    fontSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com'],
    formAction: ["'self"],
    frameAncestors: ["'none"],
    reportUri: 'https://report-uri.io/report/camjackson'
  }));

  this.app.get('/', renderNewSite);
  this.app.get('/archive/', renderArchive);
  this.app.get('/post/:slug', renderNewPost);

  const authHandler = handlers.authHandler || new AuthHandler();
  this.app.get('/login', authHandler.getLogin.bind(authHandler));
  this.app.post('/login', authHandler.authenticate.bind(authHandler));
  this.app.post('/logout', authHandler.logOut.bind(authHandler));

  const userHandler = handlers.userHandler || new UserHandler();
  this.app.put('/user/:username', authHandler.authorise, userHandler.updateUser.bind(userHandler));

  const settingsHandler = handlers.settingsHandler || new SettingsHandler();
  this.app.get('/settings', authHandler.authorise, settingsHandler.getSettings.bind(settingsHandler));
  this.app.put('/settings', authHandler.authorise, settingsHandler.updateSettings.bind(settingsHandler));

  const postHandler = handlers.postHandler || new PostHandler();
  this.app.get('/write', authHandler.authorise, postHandler.getWrite.bind(postHandler));
  this.app.put('/posts/', authHandler.authorise, postHandler.createOrUpdatePost.bind(postHandler));

  //For letsencrypt:
  this.app.get('/.well-known/acme-challenge/M5rHkTUg7nfVEF9K8J4bl8xsyXHInorJzY02ppGRCoQ', (req, res) => {
    res.type('text/plain');
    res.send('M5rHkTUg7nfVEF9K8J4bl8xsyXHInorJzY02ppGRCoQ.8RYOGbfpg_HSBz35otVictQhkbvFgKlGr7OIBKFFAdI');
  })
}

WriteItDown.prototype.start = function() {
  log.info('Starting app...');
  this.server = this.app.listen(process.env.PORT ||  8080);
  log.info('App listening on 8080');
};

WriteItDown.prototype.stop = function(done) {
  log.info('App shutting down...');
  this.server.close(done);
  log.info('App stopped')
};

exports.WriteItDown = WriteItDown;
