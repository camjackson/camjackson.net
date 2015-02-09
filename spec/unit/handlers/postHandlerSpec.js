var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var Q = require('q');

var moment = require('moment');
var marked = require('marked');

var PostHandler = require('../../../lib/handlers/postHandler').PostHandler;
var helpers = require('../../../lib/helpers');
var Post = require('../../../lib/models').Post;
var Profile = require('../../../lib/models').Profile;

describe('PostHandler', function() {
  var sandbox;
  var response;
  var postHandler = new PostHandler(function(){return 'a responder';});

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

  describe('getRoot', function() {
    it('renders the index page with correct data', function() {
      var posts = { sort: function() {return 'sorted posts'} };
      sandbox.stub(Post, 'find').returns(posts);
      sandbox.stub(Profile, 'findOne').returns('profile');
      postHandler.getRoot(null, response);

      expect(response.render).to.have.been.calledWithExactly(
        'pages/index.jade',
        { moment: moment, marked: marked, trimPost: helpers.trimPost, config: 'the config', posts: 'sorted posts', profile: 'profile' },
        'a responder'
      );
    });
  });

  describe('getPost', function() {
    it('sends the single post page with the correct data', function() {
      sandbox.stub(Post, 'findOne').returns('the post');
      postHandler.getPost({params: {slug: 'some-slug'}}, response);

      expect(Post.findOne).to.have.been.calledWithExactly({slug: 'some-slug'});
      expect(response.render).to.have.been.calledWithExactly(
        'pages/post.jade',
        { moment: moment, marked: marked, config: 'the config', post: 'the post' },
        'a responder'
      );
    });
  });

  describe('getWrite', function() {
    describe('with no post parameter', function() {
      it('renders the write page with config', function() {
        var promise_without_data = Q.fcall(function() {});
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
        var promise_without_data = Q.fcall(function() {});
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
        var existing_post = { title: 'some title', slug: 'some slug', text: 'some text' };
        var promise_with_data = Q.fcall(function() {return existing_post});
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
    var promiseWithData = Q.fcall(function() {return 'data'});
    var promiseWithoutData = Q.fcall(function() {});

    var requestBody = {
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
