'use strict';

const React = require('react');
const Page = require('./page');
const marked = require('marked');
const highlightjs = require('highlight.js');

marked.setOptions({
  highlight: function(code) {
    return highlightjs.highlightAuto(code).value;
  }
});

module.exports = (props) => (
  <Page>
    <div className="container">
      <h1>{props.post.title}</h1>
      <hr/>
      <div dangerouslySetInnerHTML={{__html: marked(props.post.text)}}></div>
    </div>
  </Page>
);
