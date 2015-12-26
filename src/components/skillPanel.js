'use strict';

const React = require('react');

const SkillPanelComponent = (props) => (
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

SkillPanelComponent.propTypes = {
  skill: React.PropTypes.shape({
    title: React.PropTypes.string,
    body: React.PropTypes.string,
    tools: React.PropTypes.string
  })
};

module.exports = SkillPanelComponent;
