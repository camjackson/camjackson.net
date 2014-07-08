var models = require('../models');
var Post = models.Post;

function getPosts() {
  var result;
  Post.find({}, function (err, posts) {
    if (err) {
      result =  null;
    } else {
      result = posts;
    }
  });
  return result;
}

function getPost(id) {
  var result;
  Post.findById(id, function (err, post) {
    if (err) {
      result = null;
    } else {
      result = post;
    }
  });
  return result;
}

function createPost(title, text, authorId) {
  var result;
  Post.create({title: title, text: text, authorId: authorId}, function (err, post) {
    if (err) {
      result = null;
    } else {
      result = post;
    }
  });
  return result
}

function deletePost(id) {
  var result;
  Post.findByIdAndRemove(id, function (err, post) {
    if (err) {
      result = null;
    } else {
      result = post;
    }
  });
  return result;
}

exports.getPosts = getPosts;
exports.getPost = getPost;
exports.createPost = createPost;
exports.deletePost = deletePost;
