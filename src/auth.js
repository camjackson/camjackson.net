'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const log = require('./logging').logger;
const User = require('./models').User;

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({username: username}).exec().then((user) => {
      if (!user) {
        done(null, false, { message: 'Incorrect username or password.' });
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            log.err('Error during bcrypt.compare: ' + err);
          }
          if (result) {
            log.info('User authenticated: ' + username);
            done(null, user);
          } else {
            log.info('User authentication failed: ' + username);
            done(null, false, { message: 'Incorrect username or password.' })
          }
        });
      }
    }, (err) => {
      log.err('Error retrieving username from database: ' + err);
      done(err);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).exec().then((user) => {
    if (!user) {
      log.warn('No user found when deserialising session with id: ' + id);
    }
    done(null, user);
  }, (err) => {
    log.err('Error deserialising user: ' + err);
    done(err, null);
  });
});

exports.authenticate = passport.authenticate( 'local', { successRedirect: '/write', failureRedirect: '/login'});

exports.authorise = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect(303, '/login');
  } else {
    next();
  }
};

exports.logOut = (req, res) => {
  req.logout();
  res.redirect(303, '/');
};
