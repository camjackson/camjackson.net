var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var AuthHandler = require('../../../lib/handlers/authHandler').AuthHandler;
var Config = require('../../../lib/models').Config;

describe('AuthHandler', function() {
  var sandbox;
  var result;
  var createResponder = function(){return 'a responder';};

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Config, 'findOne').returns('config');
    result = {
      render: sandbox.spy(),
      redirect: sandbox.spy()
    }
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('getLogin', function() {
    it('redirects to the home page if the user is already authenticated', function() {
      var reqWithAuth = { isAuthenticated: function() {return true} };
      new AuthHandler(createResponder).getLogin(reqWithAuth, result);
      expect(result.redirect).to.have.been.calledWithExactly('/');
    });

    it('sends the login page with correct data when the user is not already authenticated', function() {
      var reqWithFlashAndAuth = {
        flash: function () {return ['some auth error']},
        isAuthenticated: function() {return false}
      };
      new AuthHandler(createResponder).getLogin(reqWithFlashAndAuth, result);
      expect(result.render).to.have.been.calledWith(
        'login.jade',
        { config: 'config', errorMessage: 'some auth error' },
        'a responder'
      );
    });
  });

  describe('authorise', function() {
    it('does nothing if the user is authenticated', function() {
      var reqWithAuth = { isAuthenticated: function() {return true} };
      var next = sandbox.spy();
      new AuthHandler().authorise(reqWithAuth, null, next);
      expect(next).to.have.been.calledOnce;
    });

    it('redirects to the login page if the user is not authenticated', function() {
      var reqWithoutAuth = { isAuthenticated: function() {return false} };
      var res = { redirect: sandbox.spy() };
      new AuthHandler().authorise(reqWithoutAuth, res);
      expect(res.redirect).to.have.been.calledWithExactly('/login');
    });
  })
});
