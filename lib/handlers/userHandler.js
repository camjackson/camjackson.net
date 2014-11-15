var helpers = require('../helpers');
var User = require('../models').User;

function UserHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

UserHandler.prototype.getProfile = function(req, res) {
  res.render('profile.jade', {
      config: helpers.getEnvConfig(),
      errorMessage: req.flash('errorMessage')
  }, this.createResponder(res, 'Error while rendering profile page'));
};

UserHandler.prototype.updateUser = function(req, res) {
  if (!req.body.username) {
    req.flash('errorMessage', 'Please enter a username');
    res.redirect(303, '/profile')
  } else if (!req.body.password) {
    req.flash('errorMessage', 'Please enter a password');
    res.redirect(303, '/profile')
  } else if (req.body.password !== req.body.confirmPassword) {
    req.flash('errorMessage', 'Passwords do not match');
    res.redirect(303, '/profile')
  } else {
    return User.findOne({ username: req.params.username }).exec().then(function(user) {
      user.username = req.body.username;
      user.password = req.body.password;
      return user.save();
    }).then(function () {
      res.redirect(303, '/profile');
    }, function() {
      req.flash('errorMessage', 'Sorry, that username is taken');
      res.redirect(303, '/profile');
    });
  }
};

exports.UserHandler = UserHandler;
