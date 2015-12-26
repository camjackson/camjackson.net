'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Page = require('../../src/components/page');

describe('Page', function() {
  it('renders the children with their props', function() {
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

  it('passes the page script name to the head element', () => {
    const scripts = ["/1.js", "/2.js"];
    const page = shallowRender(<Page pageScripts={scripts}/>);
    const head = page.props.children[0];
    expect(head.props.pageScripts).to.equal(scripts);
  })
});
