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
      var sortable = { sort: function() {return 'sorted posts'} }
      sandbox.stub(Post, 'find').returns(sortable);
      postHandler.getRoot(null, response);

      expect(response.render).to.have.been.calledWith(
        'pages/index.jade',
        { moment: moment, marked: marked, config: 'the config', posts: 'sorted posts' },
        'a responder'
      );
    });
  });

  describe('getPost', function() {
    it('sends the single post page with the correct data', function() {
      sandbox.stub(Post, 'findOne').returns('the post');
      postHandler.getPost({params: {slug: 'some-slug'}}, response);

      expect(Post.findOne).to.have.been.calledWithExactly({slug: 'some-slug'});
      expect(response.render).to.have.been.calledWith(
        'pages/post.jade',
        { moment: moment, marked: marked, config: 'the config', post: 'the post' },
        'a responder'
      );
    });
  });

  describe('getWrite', function() {
    it('sends the write page with config', function() {
      postHandler.getWrite(null, response);
      expect(response.render).to.have.been.calledWith(
        'pages/write.jade',
        { config: 'the config' },
        'a responder'
      );
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
