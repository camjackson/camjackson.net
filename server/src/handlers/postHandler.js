var Post = require('../models').Post;

function root(req, res) {
  Post.find({}, function(err, posts) {
    if (err) {
      res.send(500, 'Whoops');
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

exports.root = root;





var postService = require('../services/postService');

function getPost(req, res) {
  var post = postService.getPost(req.params.id);
  if (post === null) {
    res.send(500, 'Could not retrieve post ' + req.params.id + '.');
  } else {
    res.send(200, post);
  }
}

function createPost(req, res) {
  var post = postService.createPost(req.body.title, req.body.text, null);
  if (post === null) {
    res.send(500, 'Could not create post.');
  } else {
    res.send(201, post);
  }
}

function deletePost(req, res) {
  result = postService.deletePost(req.params.id);
  if (result === null) {
    res.send(500, 'Could not delete post ' + req.params.id + '.');
  } else {
    res.send(204, result);
  }
}


exports.getPost = getPost;
exports.createPost = createPost;
exports.deletePost = deletePost;
