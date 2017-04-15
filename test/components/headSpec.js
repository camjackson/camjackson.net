'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Head = require('../../src/components/head');

describe('Head', () => {
  it('has my name as the title by default', () => {
    const head = shallowRender(<Head/>);
    expect(head.props.children[7].props.children).to.equal('Cam Jackson');
  });

  it('supports title overrides, with my name as a suffix', () => {
    const head = shallowRender(<Head title="Custom Title"/>);
    expect(head.props.children[7].props.children).to.equal('Custom Title - Cam Jackson');
  });
});
