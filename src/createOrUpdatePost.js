'use strict';

const moment = require('moment');
const log = require('./logging').logger;
const Posts = require('./db').Posts;

module.exports = (req, res) => {
  if (!req.body.slug) {
    res.status(400);
    res.send('You need to give a slug');
    return;
  }
  return Posts.findAll(req.body.slug).then((post) => {
    if (post.length > 0) {
      log.info('Updating existing post:', req.body.slug);
      return Posts.update(
        { hash: post[0].slug, range: post[0].posted },
        { title: req.body.title, text:req.body.text }
      )
    } else {
      log.info('Inserting new post:', req.body.slug);
      return Posts.insert({
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.text,
        posted: moment(Date.now()).format()
      });
    }
  }).then(() => {
    res.redirect(303, '/post/' + req.body.slug);
  });
};
