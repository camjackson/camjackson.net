var marked = require('marked');

var log = require('../logging').logger;
var models = require('../models');
var Config = models.Config;
var Post = models.Post;

function PostHandler() {

}

PostHandler.prototype.getRoot = function(req, res) {
  res.render('index.jade', {
    marked: marked,
    config: Config.findOne({}),
    posts: Post.find({})
  }, errorHandler(res, 'Error while rendering home page'));
};

PostHandler.prototype.getPost = function(req, res) {

};

PostHandler.prototype.getWrite = function(req, res) {
  res.render('write.jade', {
    config: Config.findOne({})
  }, errorHandler(res, 'Error while rendering write page'));
};

PostHandler.prototype.createOrUpdatePost = function(req, res) {
  return Post.update({slug: req.body.slug}, req.body, {upsert: true}).exec().then(function() {
    res.redirect(303, '/posts/' + req.body.slug);
  });
};

function errorHandler(res, errorMessage) {
  return function (err, html) {
    if (err) {
      log.error(errorMessage + ' : ' + err);
      res.status(500).render('error.jade');
    } else {
      res.status(200).send(html);
    }
  };
}

exports.PostHandler = PostHandler;
