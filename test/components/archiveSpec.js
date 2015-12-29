'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Archive = require('../../src/components/archive');

describe('Archive', () => {
  const posts = [
    {title: 'My Post', posted: '2016-03-06', slug: 'my-post', blurb: '*This is a post*'}
  ];
  const archiveComponent = shallowRender(<Archive posts={posts}/>);
  const firstPost = archiveComponent.props.children.props.children[1][0];

  it('renders the title as a link to the post', () => {
    const link = firstPost.props.children[0].props.children;
    const title = link.props.children;

    expect(link.props.href).to.equal('/post/my-post');
    expect(title).to.equal('My Post');
  });

  it('renders the date of the post', () => {
    expect(firstPost.props.children[1].props.children.props.children).to.equal('6th March 2016');
  });

  it('transforms and renders the blurb', () => {
    const blurb = firstPost.props.children[3];
    expect(blurb.props.dangerouslySetInnerHTML.__html).to.equal('<p><em>This is a post</em></p>\n');
  });

  it('renders a link to the post', () => {
    expect(firstPost.props.children[4].props.href).to.equal('/post/my-post');
  });
});
