'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const Q = require('q');

const moment = require('moment');
const marked = require('marked');

const PostHandler = require('../../../lib/handlers/postHandler').PostHandler;
const helpers = require('../../../lib/helpers');
const Post = require('../../../lib/models').Post;
const Profile = require('../../../lib/models').Profile;

describe('PostHandler', function() {
  let sandbox;
  let response;
  const postHandler = new PostHandler(function(){return 'a responder';});

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(helpers, 'getEnvConfig').returns('the config');
    response = {
      render: sandbox.spy(),
      redirect: sandbox.spy()
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('getWrite', function() {
    describe('with no post parameter', function() {
      it('renders the write page with config', function() {
        const promise_without_data = Q.fcall(function() {});
        sandbox.stub(Post, 'findOne').returns({ exec: function() {return promise_without_data} });
        return postHandler.getWrite({ query: {} }, response).then(function() {
          expect(response.render).to.have.been.calledWithExactly(
            'pages/write.jade',
            { config: 'the config' },
            'a responder'
          );
        });
      });
    });

    describe('with a post parameter', function() {
      it('renders the write page without a post when the post does not exist', function() {
        const promise_without_data = Q.fcall(function() {});
        sandbox.stub(Post, 'findOne').returns({ exec: function() {return promise_without_data} });
        return postHandler.getWrite({ query: { post: 'does_not_exist' } }, response).then(function() {
          expect(response.render).to.have.been.calledWithExactly(
            'pages/write.jade',
            { config: 'the config' },
            'a responder'
          );
        });
      });

      it('renders the write page with the given post when the post does exist', function() {
        const existing_post = { title: 'some title', slug: 'some slug', text: 'some text' };
        const promise_with_data = Q.fcall(function() {return existing_post});
        sandbox.stub(Post, 'findOne').returns({ exec: function() {return promise_with_data} });
        return postHandler.getWrite({ query: { post: 'does_exist' } }, response).then(function() {
          expect(response.render).to.have.been.calledWithExactly(
            'pages/write.jade',
            { config: 'the config', postTitle: 'some title', postSlug: 'some slug', postText: 'some text'  },
            'a responder'
          );
        });
      });
    });
  });

  describe('createOrUpdatePost', function() {
    const promiseWithData = Q.fcall(function() {return 'data'});
    const promiseWithoutData = Q.fcall(function() {});

    const requestBody = {
      title: 'Some Title',
      slug: 'some-slug',
      text: 'Some text.'
    };

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
