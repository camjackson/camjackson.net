var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var marked = require('marked');

var PostHandler = require('../../../lib/handlers/postHandler').PostHandler;
var Config = require('../../../lib/models').Config;
var Post = require('../../../lib/models').Post;

describe('PostHandler', function() {
  before(function() {
      sinon.stub(Config, 'findOne').returns('config');
      sinon.stub(Post, 'find').returns('posts');
  });

  describe('render success', function() {
    var result;
    beforeEach(function() {
      result = {
        render: sinon.spy(function(_, __, callback) {callback(null, 'html');}),
        status: sinon.spy(function(_) {return result;}),
        send: sinon.spy()
      };
    });

    describe('getRoot', function() {
      it('sends the index page with correct data', function() {
        new PostHandler().getRoot(null, result);

        var data = { marked: marked, config: 'config', posts: 'posts' };
        expect(result.render).to.have.been.calledWith('index.jade', data, sinon.match.func);
        expect(result.status).to.have.been.calledWithExactly(200);
        expect(result.send).to.have.been.calledWithExactly('html');
      });
    });

    describe('getWrite', function() {
      it('sends the write page with config', function() {
        new PostHandler().getWrite(null, result);

        expect(result.render).to.have.been.calledWith('write.jade', { config: 'config' }, sinon.match.func);
        expect(result.status).to.have.been.calledWithExactly(200);
        expect(result.send).to.have.been.calledWithExactly('html');
      });
    });
  });


  describe('render failure', function() {
    it('sends the error page', function () {
      var result = {
        render: sinon.spy(function(_, __, callback) {if (callback) callback('error', null);}),
        status: sinon.spy(function(_) {return result;}),
        send: sinon.spy()
      };
      new PostHandler().getRoot(null, result);

      expect(result.status).to.have.been.calledWithExactly(500);
      expect(result.render).to.have.been.calledWithExactly('error.jade');
    });
  })
});
