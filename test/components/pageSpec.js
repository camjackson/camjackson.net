'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Page = require('../../src/components/page');

describe('Page', () => {
  it('renders the children with their props', () => {
    const page = shallowRender(
      <Page>
        <div className="some-class"></div>
        <div className="some-other-class">
          <img src="photo.png"/>
        </div>
      </Page>
    );
    const children = page.props.children[1].props.children.props.children[1].props.children;
    const firstDiv = children[0];
    const secondDiv = children[1];
    const img = secondDiv.props.children;

    expect(firstDiv.props.className).to.equal('some-class');
    expect(secondDiv.props.className).to.equal('some-other-class');
    expect(img.props.src).to.equal("photo.png");
  });
});
