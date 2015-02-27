var Profile = require('../models').Profile;
var helpers = require('../helpers');

function SettingsHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

SettingsHandler.prototype.getSettings = function(req, res) {
  res.render('pages/settings.jade', {
    config: helpers.getEnvConfig(),
    profile: Profile.findOne(),
    errorMessage: req.flash('errorMessage')
  }, this.createResponder(res, 'Error while rendering settings page'));
};

SettingsHandler.prototype.updateSettings = function(req, res) {
  return Profile.findOneAndUpdate({}, {
    text: req.body.profileText,
    image: req.body.profileImage
  }, { upsert: true }).exec().then(function() {
    res.redirect(303, 'settings');
  });
};

exports.SettingsHandler = SettingsHandler;
