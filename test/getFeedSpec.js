'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const Q = require('q');
const moment = require('moment');

const getFeed = require('../src/getFeed');
const Post = require('../src/models').Post;

describe('getFeed', () => {
  it('returns the proper feed', () => {
    const posts = [
      {title: 'Most Recent', slug: 'recent', text: 'The full content.', posted: new Date('2015-12-25')},
      {title: 'First Post', slug: 'first', text: 'The full content.', posted: new Date('2015-12-01')}
    ];
    const postsPromise = Q.fcall(() => (posts));
    sinon.stub(Post, 'find').returns({sort: () => ({exec: () => (postsPromise)})});

    const response = {set: sinon.spy(), send: sinon.spy()};

    return getFeed(null, response).then(() => {
      expect(response.send).to.have.been.called;
      const feed = response.send.args[0][0];
      expect(feed).to.contain('<title>camjackson.net</title>');
      expect(feed.match(/2015-12-25/g).length).to.equal(3); //Twice for post, once for feed
      expect(feed.match(/2015-12-01/g).length).to.equal(2); //Twice for post only
    });
  });
});
