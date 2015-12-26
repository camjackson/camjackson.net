'use strict';

const React = require('react');
const moment = require('moment');
const marked = require('marked');
const highlightjs = require('highlight.js');

marked.setOptions({
  highlight: function(code) {
    return highlightjs.highlightAuto(code).value;
  }
});

const Page = require('./page');

const ArchiveComponent = (props) => (
  <Page>
    <div className="container latest-posts">
      <div className="row"><h1>Archive</h1></div>
      {
        props.posts.map(post => (
          <article key={post.slug} className="container post">
            <h1><a href={`/post/${post.slug}`}>{post.title}</a></h1>
            <time pubdate className="pull-right"><em>{moment(post.posted).format('Do MMMM YYYY')}</em></time>
            <hr/>
            <div dangerouslySetInnerHTML={{__html: marked(post.blurb)}}></div>
            <a className="pull-right" href={`/post/${post.slug}`}>Read more...</a>
          </article>
        ))
      }
    </div>
  </Page>
);

ArchiveComponent.propTypes = {
  posts: React.PropTypes.arrayOf(React.PropTypes.object)
};

module.exports = ArchiveComponent;
