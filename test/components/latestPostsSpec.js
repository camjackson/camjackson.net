'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const LatestPosts = require('../../src/components/latestPosts');

describe('LatestPosts', () => {
  it('renders 2 posts', () => {
    const posts = [{slug: 'post1'}, {slug: 'post2'}];
    const latestPosts = shallowRender(<LatestPosts posts={posts}/>);
    const postPreviews = latestPosts.props.children[1].props.children;

    expect(postPreviews[0].props.post).to.deep.equal({slug: 'post1'});
    expect(postPreviews[1].props.post).to.deep.equal({slug: 'post2'});
  });
});
