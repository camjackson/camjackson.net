'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const SkillPanel = require('../../src/components/skillPanel');

describe('SkillPanel', function() {
  const skill = {title: 'such skills', body: 'many talent', tools: 'wow'};
  const skillPanel = shallowRender(<SkillPanel skill={skill}/>);
  const panel = skillPanel.props.children;

  it('renders the title', function() {
    expect(panel.props.children[0].props.children.props.children).to.equal('such skills');
  });

  it('renders the body', function() {
    expect(panel.props.children[1].props.children[0].props.children).to.equal('many talent');
  });

  it('renders the tools', function() {
    expect(panel.props.children[1].props.children[1].props.children).to.equal('wow');
  });
});
