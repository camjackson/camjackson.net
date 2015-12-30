'use strict';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const log = require('./logging').logger;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2callback"
  },
  (accessToken, refreshToken, profile, done) => {
    if (profile.id === process.env.ALLOWED_GOOGLE_ID) {
      log.info('Cam Jackson has been logged in, using profile ID:', profile.id);
      return done(null, profile);
    } else {
      log.info('Unauthorised user attempting login:', profile.id);
      return done(null, false, 'Only Cam Jackson is allowed.')
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

exports.login = passport.authenticate('google', { scope: 'openid profile' });
exports.authenticate = passport.authenticate('google', { successRedirect: '/write', failureRedirect: '/loginFailure' });

exports.authorise = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect(303, '/login');
  } else {
    next();
  }
};

exports.logOut = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.redirect(303, '/');
};
