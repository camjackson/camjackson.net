'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const Q = require('q');

const moment = require('moment');
const marked = require('marked');

const PostHandler = require('../../../src/handlers/postHandler').PostHandler;
const helpers = require('../../../src/helpers');
const Post = require('../../../src/models').Post;
const Profile = require('../../../src/models').Profile;

describe('PostHandler', function() {
  let sandbox;
  let response;
  const postHandler = new PostHandler(function(){return 'a responder';});

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(helpers, 'getEnvConfig').returns('the config');
    response = {
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy()
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('createOrUpdatePost', function() {
    const promiseWithData = Q.fcall(function() {return 'data'});
    const promiseWithoutData = Q.fcall(function() {});

    const requestBody = {
      title: 'Some Title',
      slug: 'some-slug',
      text: 'Some text.'
    };

    it('errors if no slug is given', () => {
      sandbox.spy(Post, 'findOneAndUpdate');
      postHandler.createOrUpdatePost({body: {title: 'Hey', text: 'Sup.'}}, response)
      expect(Post.findOneAndUpdate).not.to.have.been.called;
      expect(response.status).to.have.been.calledWithExactly(400);
      expect(response.send).to.have.been.calledWithExactly('You need to give a slug');
    });

    it('updates the post if it already exists', function() {
      sandbox.stub(Post, 'findOneAndUpdate').returns({exec: function() {return promiseWithData;}});
      return postHandler.createOrUpdatePost({body: requestBody}, response).then(function() {
        expect(Post.findOneAndUpdate).to.have.been.calledWithExactly({slug: 'some-slug'}, requestBody);
        expect(response.redirect).to.have.been.calledWithExactly(303, '/post/some-slug');
      });
    });

    it('creates the post if it does not already exist', function() {
      sandbox.stub(Post, 'findOneAndUpdate').returns({exec: function() {return promiseWithoutData;}});
      sandbox.stub(Post, 'create').returns(promiseWithoutData);
      sandbox.useFakeTimers(42);

      return postHandler.createOrUpdatePost({body: requestBody}, response).then(function() {
        expect(Post.create).to.have.been.calledWithExactly({
          title: 'Some Title',
          slug: 'some-slug',
          text: 'Some text.',
          posted: 42
        });
        expect(response.redirect).to.have.been.calledWithExactly(303, '/post/some-slug');
      })
    });
  });
});
