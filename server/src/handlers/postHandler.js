var models = require('../models');
var Post = models.Post;

function getPosts(req, res) {
    Post.find({}, function (err, posts) {
        if (posts) {
            res.json(posts);
        } else {
            res.send(err);
        }
    });
}

function getPost(req, res) {
    Post.findById(req.params.post_id, function (err, post) {
        if (post) {
            res.json(post)
        } else {
            res.send(err);
        }
    });
}

function createPost(req, res) {
    Post.create({
        title: req.body.title,
        text: req.body.text,
        authorId: null
    }, function (err, post) {
        if (err)
            res.send(err);
        res.json(post);
    });
}

function deletePost(req, res) {
    Post.remove({
        _id: req.params.post_id
    }, function (err, post) {
        if (err)
            res.send(err)
    });
}

exports.getPosts = getPosts;
exports.getPost = getPost;
