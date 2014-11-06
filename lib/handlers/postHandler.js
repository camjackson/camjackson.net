var marked = require('marked');

var models = require('../models');
var Config = models.Config;
var Post = models.Post;

function PostHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

PostHandler.prototype.getRoot = function(req, res) {
  res.render('index.jade', {
    marked: marked,
    config: Config.findOne({}),
    posts: Post.find({})
  }, this.createResponder(res, 'Error while rendering home page'));
};

PostHandler.prototype.getPost = function(req, res) {
  res.render('post.jade', {
    marked: marked,
    config: Config.findOne({}),
    post: Post.findOne({slug: req.params.slug})
  }, this.createResponder(res, 'Error while rendering post page'))
};

PostHandler.prototype.getWrite = function(req, res) {
  res.render('write.jade', {
    config: Config.findOne({})
  }, this.createResponder(res, 'Error while rendering write page'));
};

PostHandler.prototype.createOrUpdatePost = function(req, res) {
  return Post.update({slug: req.body.slug}, req.body, {upsert: true}).exec().then(function() {
    res.redirect(303, '/post/' + req.body.slug);
  });
};

exports.PostHandler = PostHandler;
