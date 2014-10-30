var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var Q = require('q');

var marked = require('marked');

var PostHandler = require('../../../lib/handlers/postHandler').PostHandler;
var Config = require('../../../lib/models').Config;
var Post = require('../../../lib/models').Post;

describe('PostHandler', function() {
  var sandbox;
  var result;
  var postHandler = new PostHandler(function(){return 'a responder';});

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Config, 'findOne').returns('the config');
    result = {
      render: sandbox.spy(),
      redirect: sandbox.spy()
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('getRoot', function() {
    it('renders the index page with correct data', function() {
      sandbox.stub(Post, 'find').returns('some posts');
      postHandler.getRoot(null, result);

      expect(result.render).to.have.been.calledWith(
        'index.jade',
        { marked: marked, config: 'the config', posts: 'some posts' },
        'a responder'
      );
    });
  });

  describe('getPost', function() {
    it('sends the single post page with the correct data', function() {
      sandbox.stub(Post, 'findOne').returns('the post');
      postHandler.getPost({params: {slug: 'some-slug'}}, result);

      expect(Post.findOne).to.have.been.calledWithExactly({slug: 'some-slug'});
      expect(result.render).to.have.been.calledWith(
        'post.jade',
        { marked: marked, config: 'the config', post: 'the post' },
        'a responder'
      );
    });
  });

  describe('getWrite', function() {
    it('sends the write page with config', function() {
      postHandler.getWrite(null, result);
      expect(result.render).to.have.been.calledWith(
        'write.jade',
        { config: 'the config' },
        'a responder'
      );
    });
  });

  describe('createOrUpdatePost', function() {
    var promise = Q.fcall(function() {});

    it('upserts the post and redirects to it', function(done) {
      sandbox.stub(Post, 'update').returns({exec: function() {return promise;}});
      var postBody = {
        title: 'Some Title',
        slug: 'some-slug',
        text: 'Some text.'
      };
      postHandler.createOrUpdatePost({body: postBody}, result).then(function() {
        expect(Post.update).to.have.been.calledWithExactly({slug: 'some-slug'}, postBody, {upsert: true});
        expect(result.redirect).to.have.been.calledWithExactly(303, '/posts/some-slug');
        done();
      });
    });
  });
});
