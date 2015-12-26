'use strict';
const xml = require('xml');
const moment = require('moment');
const marked = require('marked');
const highlightjs = require('highlight.js');
const Post = require('./models').Post;

marked.setOptions({
  highlight: (code) => {
    return highlightjs.highlightAuto(code).value;
  }
});

module.exports = (_, res) => {
  return Post.find({}).sort({posted: 'descending'}).exec().then((posts) => {
    const format = date => moment(date).format();
    const link = (rel, href) => ([
      { _attr: {rel: rel} },
      { _attr: {href: href} }
    ]);
    const render_markdown = markdown => ({
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
      { updated: format(posts[0].posted) },
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
          { updated: format(post.posted) },
          { published: format(post.posted) },
          { author: me },
          { content: render_markdown(post.text) },
          { link: link('alternate', uri)},
          { summary: render_markdown(post.text.substr(0, post.text.indexOf('[//]: # (fold)'))) }
        ]
      });
    });

    res.set('Content-Type', 'application/atom+xml');
    res.send(xml({feed}, {indent: true, declaration: true}));
  });
};
