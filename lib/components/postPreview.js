'use strict';

const React = require('react');

module.exports = (props) => (
  <div className="col-md-6">
    <h3>{props.post.title}</h3>
    <p>
      {props.post.blurb}
      <a className="pull-right" href={props.post.slug}>Read more...</a>
    </p>
  </div>
);
