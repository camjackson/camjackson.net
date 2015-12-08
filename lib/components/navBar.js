'use strict';

const React = require('react');

module.exports = () => (
  <nav className="navbar navbar-fixed-top navbar-inverse">
    <div className="container">
      <a className="navbar-brand" href="/">Home</a>
      <a className="navbar-brand" href="/archive">Archive</a>
      <a className="navbar-brand navbar-right" href="https://github.com/camjackson"><i className="fa fa-2x fa-github"/></a>
      <a className="navbar-brand navbar-right" href="https://twitter.com/camjackson89"><i className="fa fa-2x fa-twitter"/></a>
      <a className="navbar-brand navbar-right" href="https://linkedin.com/pub/cam-jackson/30/60a/192"><i className="fa fa-2x fa-linkedin"/></a>
    </div>
  </nav>
);
