'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const renderAtomFeed = require('../src/renderAtomFeed');

describe('renderAtomFeed', () => {
  it('renders the feed', () => {
    const posts = [
      {title: 'Most Recent', slug: 'recent', text: 'The full content.', blurb: 'The', posted: new Date('2015-12-25')},
      {title: 'First Post', slug: 'first', text: 'The full content.', blurb: 'The', posted: new Date('2015-12-01')}
    ];

    const feed = renderAtomFeed(posts);
    expect(feed).to.contain('<title>camjackson.net</title>');
    expect(feed.match(/2015-12-25/g).length).to.equal(3); //Twice for post, once for feed
    expect(feed.match(/2015-12-01/g).length).to.equal(2); //Twice for post only
  });
});
