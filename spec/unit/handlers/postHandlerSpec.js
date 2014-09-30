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

  function createExpressResultObject(renderSuccess) {
    var res = {
      render: sinon.spy(function(_, __, callback) {
        if (renderSuccess) callback(null, 'html');
        else if (callback) callback('error', null);
      }),
      status: sinon.spy(function(_) {
        return res;
      }),
      send: sinon.spy()
    };
    return res;
  }

  describe('getRoot', function() {
    it('sends the index page with correct data when render succeeds', function() {
      var result = createExpressResultObject(true);
      new PostHandler().getRoot(null, result);

      var data = { marked: marked, config: 'config', posts: 'posts' };
      expect(result.render).to.have.been.calledWith('index.jade', data, sinon.match.func);
      expect(result.status).to.have.been.calledWithExactly(200);
      expect(result.send).to.have.been.calledWithExactly('html');
    });

    it('sends the error page when render fails', function () {
      var result = createExpressResultObject(false);
      new PostHandler().getRoot(null, result);

      expect(result.status).to.have.been.calledWithExactly(500);
      expect(result.render).to.have.been.calledWithExactly('error.jade');
    });
  });

  describe('getWrite', function() {
    it('sends the write page with config when render succeeds', function() {
      var result = createExpressResultObject(true);
      new PostHandler().getWrite(null, result);

      expect(result.render).to.have.been.calledWith('write.jade', { config: 'config' }, sinon.match.func);
      expect(result.status).to.have.been.calledWithExactly(200);
      expect(result.send).to.have.been.calledWithExactly('html');
    });

    it('sends the error page when render fails', function () {
      var result = createExpressResultObject(false);
      new PostHandler().getWrite(null, result);

      expect(result.status).to.have.been.calledWithExactly(500);
      expect(result.render).to.have.been.calledWithExactly('error.jade');
    });
  });
});
