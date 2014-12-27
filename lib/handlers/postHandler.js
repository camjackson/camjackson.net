var moment = require('moment');
var marked = require('marked');

var helpers = require('../helpers');
var log = require('../logging').logger;
var Post = require('../models').Post;

function PostHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

PostHandler.prototype.getRoot = function(req, res) {
  res.render('index.jade', {
    moment: moment,
    marked: marked,
    config: helpers.getEnvConfig(),
    posts: Post.find({}).sort({posted: 'descending'})
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
  return Post.findOneAndUpdate({slug: req.body.slug}, req.body).exec().then(function(post) {
    if (post) {
      log.info('Updated existing post ' + req.body.slug);
      res.redirect(303, '/post/' + req.body.slug);
    } else {
      return Post.create({
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.text,
        posted: Date.now()
      }).then(function() {
        log.info('Created new post ' + req.body.slug);
        res.redirect(303, '/post/' + req.body.slug);
      });
    }
  });
};

exports.PostHandler = PostHandler;
