var Post = require('../models').Post;

exports.root = function(req, res) {
  Post.find({}, function(err, posts) {
    if (err) {
      res.render('error.jade');
    }

    res.render('index.jade', {
      'config': {
        'title': 'camjackson.net',
        'heading': 'CamJackson.net'
      },
      'posts': posts
    });
  })
}
