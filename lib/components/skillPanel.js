'use strict';

let React = require('react');

class SkillPanel extends React.Component {
  render() {
    return (
      <div className="col-md-4 col-sm-6">
        <div className="panel panel-default">
          <div className="panel-heading text-center">
            <h3 className="panel-title">{this.props.skill.title}</h3>
          </div>
          <div className="panel-body">
            <p>{this.props.skill.body}</p>
            <p>{this.props.skill.tools}</p>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = SkillPanel;
