'use strict';

const React = require('react');
const marked = require('marked');
const highlightjs = require('highlight.js');

marked.setOptions({
  highlight: function(code) {
    return highlightjs.highlightAuto(code).value;
  }
});

module.exports = (props) => (
  <div className="col-md-6">
    <h3><a href={`/post/${props.post.slug}`}>{props.post.title}</a></h3>
    <p>
      <span dangerouslySetInnerHTML={{__html: marked(props.post.blurb)}}/>
      <a className="pull-right" href={`/post/${props.post.slug}`}>Read more...</a>
    </p>
  </div>
);
