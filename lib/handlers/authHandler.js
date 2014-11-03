var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var log = require('../helpers').logger;
var models = require('../models');
var Config = models.Config;
var User = models.User;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}).exec().then(function(user) {
      if (!user) {
        done(null, false, { message: 'Invalid credentials.' });
      } else {
        bcrypt.compare(password, user.password, function(err, result) {
          if (err) {
            log.err('Error during bcrypt.compare: ' + err);
          }
          if (result) {
            log.info('User authenticated: ' + username);
            done(null, user);
          } else {
            log.info('User authentication failed: ' + username);
            done(null, false, { message: 'Invalid credentials.' })
          }
        });
      }
    }, function(err) {
      log.err('Error retrieving username from database: ' + err);
      done(err);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).exec().then(function(user) {
    if (!user) {
      log.warn('No user found when deserialising session with id: ' + id);
    }
    done(null, user);
  }, function(err) {
    log.err('Error deserialising user: ' + err);
    done(err, null);
  });
});

function AuthHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

AuthHandler.prototype.authenticate = passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }
);

AuthHandler.prototype.getLogin = function(req, res) {
  res.render('login.jade', {
    config: Config.findOne({}),
    errorMessage: req.flash('error')[0]
  }, this.createResponder(res, 'Error while rendering home page'))
};

exports.AuthHandler = AuthHandler;
