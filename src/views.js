const Post = require('./models').Post;

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');
const LoginComponent = require('./components/login');
const WriteComponent = require('./components/write');

exports.index = (_, context) => {
  Post.find({}).sort({posted: 'descending'}).limit(2).exec().then((posts) => {
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    context.succeed(ReactDOMServer.renderToStaticMarkup(<IndexComponent posts={posts}/>));
  });
};

exports.archive = (_, context) => {
  Post.find({}).sort({posted: 'descending'}).exec().then((posts) => {
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    context.succeed(ReactDOMServer.renderToStaticMarkup(<ArchiveComponent posts={posts}/>));
  });
};

exports.post = (event, context) => {
  Post.findOne({slug: event.payload.slug}).exec().then((post) => {
    context.succeed(ReactDOMServer.renderToStaticMarkup(<PostComponent post={post}/>));
  });
};

exports.login = (event, context) => {
  if (event.payload.isAuthenticated) {
    context.fail(303, '/write')
  } else {
    context.succeed(ReactDOMServer.renderToStaticMarkup(<LoginComponent/>))
  }
};

exports.write = (event, context) => {
  Post.findOne({ slug: event.payload.slug }).exec().then(function(post) {
    context.succeed(ReactDOMServer.renderToStaticMarkup(<WriteComponent post={post || {}}/>))
  });
};
