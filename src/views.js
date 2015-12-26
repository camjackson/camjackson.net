const Post = require('./models').Post;

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');
const LoginComponent = require('./components/login');
const WriteComponent = require('./components/write');

exports.index = (_, res) => {
  Post.find({}).sort({posted: 'descending'}).limit(2).exec().then((posts) => {
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    res.send(ReactDOMServer.renderToStaticMarkup(<IndexComponent posts={posts}/>));
  });
};

exports.archive = (_, res) => {
  Post.find({}).sort({posted: 'descending'}).exec().then((posts) => {
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    res.send(ReactDOMServer.renderToStaticMarkup(<ArchiveComponent posts={posts}/>));
  });
};

exports.post = (req, res) => {
  Post.findOne({slug: req.params.slug}).exec().then((post) => {
    res.send(ReactDOMServer.renderToStaticMarkup(<PostComponent post={post}/>));
  });
};

exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(303, '/write')
  } else {
    res.send(ReactDOMServer.renderToStaticMarkup(<LoginComponent/>))
  }
};

exports.write = (req, res) => {
  Post.findOne({ slug: req.query.post }).exec().then(function(post) {
    res.send(ReactDOMServer.renderToStaticMarkup(<WriteComponent post={post || {}}/>))
  });
};
