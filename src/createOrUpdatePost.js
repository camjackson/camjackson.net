'use strict';

const log = require('./logging').logger;
const Post = require('./models').Post;

module.exports = (req, res) => {
  if (!req.body.slug) {
    res.status(400);
    res.send('You need to give a slug');
    return;
  }
  return Post.findOneAndUpdate({slug: req.body.slug}, req.body).exec().then((post) => {
    if (post) {
      log.info('Updated existing post ' + req.body.slug);
      res.redirect(303, '/post/' + req.body.slug);
    } else {
      return Post.create({
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.text,
        posted: Date.now()
      }).then(() => {
        log.info('Created new post ' + req.body.slug);
        res.redirect(303, '/post/' + req.body.slug);
      });
    }
  });
};
