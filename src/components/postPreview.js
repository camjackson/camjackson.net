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

module.exports = (props) => (
  <article className="col-md-6">
    <h3><a href={`/post/${props.post.slug}`}>{props.post.title}</a></h3>
    <time pubdate className="pull-right"><em>{moment(props.post.posted).format('Do MMMM YYYY')}</em></time>
    <div className="post-preview">
      <span dangerouslySetInnerHTML={{__html: marked(props.post.blurb)}}/>
      <a className="pull-right" href={`/post/${props.post.slug}`}>Read more...</a>
    </div>
  </article>
);
