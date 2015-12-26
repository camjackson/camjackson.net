'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Head = require('../../src/components/head');

describe('Head', () => {
  it('includes extra page scripts if they are given', () => {
    const head = shallowRender(<Head pageScripts={['/1.js', '/2.js']}/>);
    const extraScripts = head.props.children[head.props.children.length - 1];

    expect(extraScripts.length).to.equal(2);
    expect(extraScripts[0].props.src).to.equal('/1.js');
    expect(extraScripts[1].props.src).to.equal('/2.js');
  });

  it('puts an empty element if no extra page scripts are given', () => {
    const head = shallowRender(<Head/>);
    const extraScripts = head.props.children[head.props.children.length - 1];

    expect(extraScripts).to.equal(undefined);
  })
});
