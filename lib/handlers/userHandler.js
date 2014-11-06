var marked = require('marked');

var Config = require('../models').Config;

function UserHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

UserHandler.prototype.getProfile = function(req, res) {
  res.render('profile.jade', {
      marked: marked,
      config: Config.findOne({})
  }, this.createResponder(res, 'Error while rendering profile page'));
};

exports.UserHandler = UserHandler;
