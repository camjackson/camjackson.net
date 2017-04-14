'use strict';
const xml = require('xml');
const moment = require('moment');
const marked = require('marked');
const highlightjs = require('highlight.js');
const Posts = require('./db').Posts;

marked.setOptions({
  highlight: (code) => {
    return highlightjs.highlightAuto(code).value;
  }
});

const renderFeedXml = posts => {
  const formatDate = date => moment(date).format();
  const link = (rel, href) => ([
    { _attr: {rel: rel} },
    { _attr: {href: href} }
  ]);
  const renderMarkdown = markdown => ({
    _attr: { type: 'html' },
    _cdata: marked(markdown)
  });

  const me = [
    { name: 'Cam Jackson' },
    { uri: 'https://camjackson.net/' }
  ];

  const feed = [
    { _attr: { xmlns: 'http://www.w3.org/2005/Atom' } },
    { id: 'https://camjackson.net/' },
    { title: 'camjackson.net' },
    { updated: formatDate(posts[0].posted) },
    { subtitle: 'A feed of blog posts from camjackson.net' },
    { author: me },
    { link: link('alternate', 'https://camjackson.net/')},
    { link: link('self', 'https://camjackson.net/atom.xml')},
    { icon: 'https://camjackson.net/favicon.ico' },
    { logo: 'https://camjackson.net/profile.jpg' }
  ];

  posts.forEach(post => {
    const uri = `https://camjackson.net/post/${post.slug}`;
    feed.push({
      entry: [
        { id: uri },
        { title: {_cdata: post.title} },
        { updated: formatDate(post.posted) },
        { published: formatDate(post.posted) },
        { author: me },
        { content: renderMarkdown(post.text) },
        { link: link('alternate', uri)},
        { summary: renderMarkdown(post.blurb) }
      ]
    });
  });
  return xml({feed}, {indent: true, declaration: true});
}

const addBlurbs = posts => (
  posts.map(post => ({
    ...post,
    blurb: post.text.substr(0, post.text.indexOf('[//]: # (fold)'))
  }))
);

module.exports = (_, res) => {
  const attrsGet = ['slug', 'title', 'posted', 'text'];
  return Posts.scan({attrsGet})
    .then(addBlurbs)
    .then(renderFeedXml)
    .then(feed => {
      res.set('Content-Type', 'application/atom+xml');
      res.send(feed);
    });
};
