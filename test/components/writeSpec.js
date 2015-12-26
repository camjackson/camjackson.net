'use strict';
const expect = require('chai').expect;
const React = require('react');
const shallowRender = require('./shallowRender');
const Write = require('../../src/components/write');

describe('Write', () => {
  it('shows the form with default data', () => {
    const post = { title: 'My Title', slug: '/post', text: 'Hello there!'};
    const write = shallowRender(<Write post={post}/>);
    const formGroups = write.props.children.props.children.props.children;
    const titleInput = formGroups[0].props.children[1].props.children;
    const slugInput = formGroups[1].props.children[1].props.children;
    const textInput = formGroups[2].props.children;

    expect(titleInput.props.defaultValue).to.equal(post.title);
    expect(slugInput.props.defaultValue).to.equal(post.slug);
    expect(slugInput.props.readOnly).to.equal(post.slug);
    expect(textInput.props.defaultValue).to.equal(post.text);
  });

  it('renders empty fields when no post is given', () => {
    //Just make sure it doesn't blow up
    shallowRender(<Write post={{}}/>);
  })
});
