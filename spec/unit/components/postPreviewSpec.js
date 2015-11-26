'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const PostPreview = require('../../../lib/components/postPreview');

describe('PostPreview', function() {
  const post = {title: 'My Post', slug: 'my-post', blurb: '**This is a post**'};
  const postPreview = shallowRender(<PostPreview post={post}/>);

  it('renders the title as a link to the post', function() {
    const link = postPreview.props.children[0].props.children;
    const title = link.props.children;

    expect(link.props.href).to.equal('/new/post/my-post');
    expect(title).to.equal('My Post');
  });

  it('transforms and renders the blurb', function() {
    const blurb = postPreview.props.children[1].props.children[0];
    expect(blurb.props.dangerouslySetInnerHTML.__html).to.equal('<p><strong>This is a post</strong></p>\n');
  });

  it('renders a link to the post', function() {
    expect(postPreview.props.children[1].props.children[1].props.href).to.equal('/new/post/my-post');
  });
});
