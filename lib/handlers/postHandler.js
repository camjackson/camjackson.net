var marked = require('marked');

var models = require('../models');
var Post = models.Post;
var Config = models.Config;

var log = require('../logging').logger;

exports.root = function(req, res) {
  res.render('index.jade', {
    marked: marked,
    config: Config.findOne({}),
    posts: Post.find({})
  });
};
