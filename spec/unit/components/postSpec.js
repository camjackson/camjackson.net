'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Post = require('../../../lib/components/post');

describe('Post', function() {
  const post = {title: 'My Post', text: '*This is a post*'};
  const postComponent = shallowRender(<Post post={post}/>);
  const container = postComponent.props.children[1].props.children[1];

  it('renders the title', function() {
    expect(container.props.children[0].props.children).to.equal('My Post');
  });

  it('transforms and renders the blurb', function() {
    const body = container.props.children[2];
    expect(body.props.dangerouslySetInnerHTML.__html).to.equal('<p><em>This is a post</em></p>\n');
  });
});
