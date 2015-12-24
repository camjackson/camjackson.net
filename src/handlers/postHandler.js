'use strict';
const moment = require('moment');
const marked = require('marked');
const highlightjs = require('highlight.js');

const helpers = require('../helpers');
const log = require('../logging').logger;
const Post = require('../models').Post;

marked.setOptions({
  highlight: function(code) {
    return highlightjs.highlightAuto(code).value;
  }
});

function PostHandler(createResponder) {
  this.createResponder = createResponder || require('../helpers').createResponder;
}

PostHandler.prototype.getWrite = function(req, res) {
  const responder = this.createResponder(res, 'Error while rendering write page');
  return Post.findOne({ slug: req.query.post }).exec().then(function(post) {
    const renderArgs = { config: helpers.getEnvConfig() };
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
