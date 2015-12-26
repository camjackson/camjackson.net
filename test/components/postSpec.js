'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Post = require('../../src/components/post');

describe('Post', () => {
  const post = {title: 'My Post', text: '*This is a post*', posted: new Date('2016-03-06')};
  const postComponent = shallowRender(<Post post={post}/>);
  const container = postComponent.props.children;

  it('renders the title', () => {
    expect(container.props.children[0].props.children).to.equal('My Post');
  });

  it('renders the date of the post', () => {
    expect(container.props.children[1].props.children.props.children).to.equal('6th March 2016');
  });

  it('transforms and renders the text', () => {
    const body = container.props.children[3];
    expect(body.props.dangerouslySetInnerHTML.__html).to.equal('<p><em>This is a post</em></p>\n');
  });
});
