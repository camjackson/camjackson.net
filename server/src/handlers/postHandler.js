var models = require('../models');
var Post = models.Post;

function getPosts(req, res) {
  Post.find({}, function (err, posts) {
    if (posts) {
      res.send(200, posts);
    } else {
      res.send(500, err);
    }
  });
}

function getPost(req, res) {
  Post.findById(req.params.post_id, function (err, post) {
    if (post) {
      res.send(200, post);
    } else {
      res.send(500, err);
    }
  });
}

function createPost(req, res) {
  Post.create({
    title: req.body.title,
    text: req.body.text,
    authorId: null
  }, function (err, post) {
    if (post) {
      res.send(201, post);
    } else {
      res.send(500, err);
    }
  });
}

function deletePost(req, res) {
  Post.findByIdAndRemove(req.params.post_id, function (err, post) {
    if (post) {
      res.send(204, post);
    } else {
      res.send(500, err);
    }
  });
}

exports.getPosts = getPosts;
exports.getPost = getPost;
exports.createPost = createPost;
exports.deletePost = deletePost;
