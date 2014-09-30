var marked = require('marked');

var log = require('../logging').logger;
var models = require('../models');
var Post = models.Post;
var Config = models.Config;

function PostHandler() {

}

PostHandler.prototype.getRoot = function(req, res) {
  res.render('index.jade', {
    marked: marked,
    config: Config.findOne({}),
    posts: Post.find({})
  }, function(err, html) {
    if (err) {
      log.error('Error while rendering home page: ' + err);
      res.status(500).render('error.jade');
    } else {
      res.status(200).send(html);
    }
  });
};

PostHandler.prototype.getWrite = function(req, res) {
  res.render('write.jade', {
    config: Config.findOne({})
  }, function(err, html) {
    if (err) {
      log.error('Error while rendering write page: ' + err);
      res.status(500).render('error.jade');
    } else {
      res.status(200).send(html);
    }
  });
};

PostHandler.prototype.createPost = function(req, res) {

};

exports.PostHandler = PostHandler;
