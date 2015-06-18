var moment = require('moment');
var marked = require('marked');
var highlightjs = require('highlight.js');

var helpers = require('../helpers');
var log = require('../logging').logger;
var Post = require('../models').Post;
var Profile = require('../models').Profile;

marked.setOptions({
  highlight: function(code) {
    return highlightjs.highlightAuto(code).value;
  }
});

function PostHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

PostHandler.prototype.getRoot = function(req, res) {
  res.render('pages/index.jade', {
    moment: moment,
    marked: marked,
    trimPost: helpers.trimPost,
    config: helpers.getEnvConfig(),
    profile: Profile.findOne(),
    posts: Post.find({}).sort({posted: 'descending'})
  }, this.createResponder(res, 'Error while rendering home page'));
};

PostHandler.prototype.getPost = function(req, res) {
  res.render('pages/post.jade', {
    moment: moment,
    marked: marked,
    config: helpers.getEnvConfig(),
    post: Post.findOne({slug: req.params.slug})
  }, this.createResponder(res, 'Error while rendering post page'))
};

PostHandler.prototype.getWrite = function(req, res) {
  var responder = this.createResponder(res, 'Error while rendering write page');
  return Post.findOne({ slug: req.query.post }).exec().then(function(post) {
    var renderArgs = { config: helpers.getEnvConfig() };
    if (post) {
      renderArgs.postTitle = post.title;
      renderArgs.postSlug = post.slug;
      renderArgs.postText = post.text;
    }
    res.render('pages/write.jade', renderArgs, responder);
  });
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
