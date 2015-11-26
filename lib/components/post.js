'use strict';

const React = require('react');
const marked = require('marked');
const highlightjs = require('highlight.js');

marked.setOptions({
  highlight: function(code) {
    return highlightjs.highlightAuto(code).value;
  }
});

const Head = require('./head');
const NavBar = require('./navBar');

module.exports = (props) => (
  <html>
    <Head/>
    <body>
      <NavBar/>
      <div className="container">
        <h1>{props.post.title}</h1>
        <hr/>
        <div dangerouslySetInnerHTML={{__html: marked(props.post.text)}}></div>
      </div>
    </body>
  </html>
);
