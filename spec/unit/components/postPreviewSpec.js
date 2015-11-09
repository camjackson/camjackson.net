'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const PostPreview = require('../../../lib/components/postPreview');

describe('PostPreview', function() {
  const post = {title: 'My Post', slug: 'my-post', blurb: 'This is a post'};
  const postPreview = shallowRender(<PostPreview post={post}/>);

  it('renders the title', function() {
    expect(postPreview.props.children[0].props.children).to.equal('My Post');
  });

  it('renders the blurb', function() {
    expect(postPreview.props.children[1].props.children[0]).to.equal('This is a post');
  });

  it('renders a link to the post', function() {
    expect(postPreview.props.children[1].props.children[1].props.href).to.equal('my-post');
  });
});
