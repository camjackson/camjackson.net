const moment = require('moment');
const Posts = require('./db').Posts;

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');
const LoginComponent = require('./components/login');
const WriteComponent = require('./components/write');

const attrsGet = ['slug', 'title', 'posted', 'text'];
exports.index = (_, context) => {
  //TODO: Query + sort + limit, pending release of https://github.com/victorquinn/dynasty/pull/71
  Posts.scan({attrsGet}).then((posts) => {
    posts.sort((a, b) => a.posted < b.posted);
    posts = posts.slice(0, 2);
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    context.succeed(ReactDOMServer.renderToStaticMarkup(<IndexComponent posts={posts}/>));
  });
};

exports.archive = (_, context) => {
  //TODO: Query + sort, pending release of https://github.com/victorquinn/dynasty/pull/71
  Posts.scan({attrsGet}).then((posts) => {
    posts.sort((a, b) => a.posted < b.posted);
    posts.forEach((post) => {
      post.blurb = post.text.substr(0, post.text.indexOf('[//]: # (fold)'));
    });
    context.succeed(ReactDOMServer.renderToStaticMarkup(<ArchiveComponent posts={posts}/>));
  });
};

exports.post = (event, context) => {
  Posts.findAll(event.slug).then((posts) => {
    context.succeed(ReactDOMServer.renderToStaticMarkup(<PostComponent post={posts[0]}/>));
  });
};

exports.login = (event, context) => {
  if (event.isAuthenticated) {
    context.fail(303, '/write');
  } else {
    context.succeed(ReactDOMServer.renderToStaticMarkup(<LoginComponent/>));
  }
};

exports.write = (event, context) => {
  if (event.slug) {
    Posts.findAll(event.slug).then((posts) => {
      context.succeed(ReactDOMServer.renderToStaticMarkup(<WriteComponent post={posts[0]}/>));
    });
  } else {
    context.succeed(ReactDOMServer.renderToStaticMarkup(<WriteComponent post={{}}/>));
  }
};
