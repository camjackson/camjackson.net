'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const PostPreview = require('../../src/components/postPreview');

describe('PostPreview', () => {
  const post = {title: 'My Post', slug: 'my-post', blurb: '**This is a post**', posted: '2015-06-02'};
  const postPreview = shallowRender(<PostPreview post={post}/>);

  it('renders the title as a link to the post', () => {
    const link = postPreview.props.children[0].props.children;
    const title = link.props.children;

    expect(link.props.href).to.equal('/post/my-post');
    expect(title).to.equal('My Post');
  });

  it('renders the date of the post', () => {
    expect(postPreview.props.children[1].props.children.props.children).to.equal('2nd June 2015');
  });

  it('transforms and renders the blurb', () => {
    const blurb = postPreview.props.children[2].props.children[0];
    expect(blurb.props.dangerouslySetInnerHTML.__html).to.equal('<p><strong>This is a post</strong></p>\n');
  });

  it('renders a link to the post', () => {
    expect(postPreview.props.children[2].props.children[1].props.href).to.equal('/post/my-post');
  });
});
