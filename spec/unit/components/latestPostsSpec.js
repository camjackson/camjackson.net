'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const LatestPosts = require('../../../lib/components/latestPosts');

describe('LatestPosts', function() {
  it('renders 2 posts', function() {
    const posts = ['post1', 'post2'];
    const latestPosts = shallowRender(<LatestPosts posts={posts}/>);
    const postPreviews = latestPosts.props.children[1].props.children;

    expect(postPreviews[0].props.post).to.equal('post1');
    expect(postPreviews[1].props.post).to.equal('post2');
  });
});
