var moment = require('moment');
var marked = require('marked');

var helpers = require('../helpers');
var Post = require('../models').Post;

function PostHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

PostHandler.prototype.getRoot = function(req, res) {
  res.render('index.jade', {
    moment: moment,
    marked: marked,
    config: helpers.getEnvConfig(),
    posts: Post.find({}).sort({posted: 'ascending'})
  }, this.createResponder(res, 'Error while rendering home page'));
};

PostHandler.prototype.getPost = function(req, res) {
  res.render('post.jade', {
    moment: moment,
    marked: marked,
    config: helpers.getEnvConfig(),
    post: Post.findOne({slug: req.params.slug})
  }, this.createResponder(res, 'Error while rendering post page'))
};

PostHandler.prototype.getWrite = function(req, res) {
  res.render('write.jade', {
    config: helpers.getEnvConfig()
  }, this.createResponder(res, 'Error while rendering write page'));
};

PostHandler.prototype.createOrUpdatePost = function(req, res) {
  return Post.update({slug: req.body.slug}, req.body, {upsert: true}).exec().then(function() {
    res.redirect(303, '/post/' + req.body.slug);
  });
};

exports.PostHandler = PostHandler;
