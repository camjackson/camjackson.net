var helpers = require('../helpers');

function SettingsHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

SettingsHandler.prototype.getSettings = function(req, res) {
  res.render('settings.jade', {
    config: helpers.getEnvConfig(),
    errorMessage: req.flash('errorMessage')
  }, this.createResponder(res, 'Error while rendering settings page'))
};

exports.SettingsHandler = SettingsHandler;
