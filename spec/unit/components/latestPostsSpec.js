'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const LatestPosts = require('../../../lib/components/latestPosts');

describe('LatestPosts', function() {
  it('renders 2 posts', function() {
    const latestPosts = shallowRender(<LatestPosts/>);
    expect(latestPosts.props.children[1].props.children.length).to.equal(2);
  });
});
