'use strict';

const React = require('react');

module.exports = (props) => (
  <div className="col-md-4 col-sm-6 skill-panel">
    <div className="panel panel-default">
      <div className="panel-heading text-center">
        <h3 className="panel-title">{props.skill.title}</h3>
      </div>
      <div className="panel-body">
        <p>{props.skill.body}</p>
        <p>{props.skill.tools}</p>
      </div>
    </div>
  </div>
);
