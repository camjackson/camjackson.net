var async = require('async');

var models = require('../models');
var Post = models.Post;
var Config = models.Config;

var log = require('../logging').logger;

exports.root = function(req, res) {
  async.parallel({
    config: function(callback) {
      Config.find({}, function(err, config) {
        if (err){
          callback(err);
        } else {
          callback(null, config[0]);
        }
      });
    },
    posts: function(callback) {
      Post.find({}, function(err, posts) {
        if (err) {
          callback(err);
        } else {
          callback(null, posts);
        }
      });
    }
  }, function(err, data) {
    if (err) {
      log.error('Could not GET /root: ' + err);
      res.render('error.jade');
    } else {
      res.render('index.jade', data)
    }
  });
};
