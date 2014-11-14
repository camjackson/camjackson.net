var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var AuthHandler = require('../../../lib/handlers/authHandler').AuthHandler;
var helpers = require('../../../lib/helpers');

describe('AuthHandler', function() {
  var sandbox;
  var response;
  var createResponder = function(){return 'a responder';};

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(helpers, 'getEnvConfig').returns('config');
    response = {
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
      new AuthHandler(createResponder).getLogin(reqWithAuth, response);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });

    it('sends the login page with correct data when the user is not already authenticated', function() {
      var reqWithFlashAndAuth = {
        flash: function () {return ['some auth error']},
        isAuthenticated: function() {return false}
      };
      new AuthHandler(createResponder).getLogin(reqWithFlashAndAuth, response);
      expect(response.render).to.have.been.calledWith(
        'login.jade',
        { config: 'config', errorMessage: 'some auth error' },
        'a responder'
      );
    });
  });

  describe('authorise', function() {
    it('redirects to the login page if the user is not authenticated', function() {
      var reqWithoutAuth = { isAuthenticated: function() {return false} };
      new AuthHandler().authorise(reqWithoutAuth, response);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
    });

    it('redirects to the login page when trying to modify a different user', function() {
      var reqWithUserMismatch = {
        isAuthenticated: function() {return true},
        params: { username: 'requested-user' },
        user: { username: 'logged-in-user' }
      };
      new AuthHandler().authorise(reqWithUserMismatch, response);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
    });

    it('does nothing when trying to modify the logged in user', function() {
      var reqWithUserMatch = {
        isAuthenticated: function() {return true},
        params: { username: 'logged-in-user' },
        user: { username: 'logged-in-user' }
      };
      var next = sandbox.spy();
      new AuthHandler().authorise(reqWithUserMatch, null, next);
      expect(next).to.have.been.calledOnce;
    });

    it('does nothing if the user is authenticated, and not trying to access a user', function() {
      var reqWithAuth = {
        isAuthenticated: function() {return true},
        params: {}
      };
      var next = sandbox.spy();
      new AuthHandler().authorise(reqWithAuth, null, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('logOut', function () {
    it('logs the user out and redirects to the home page', function () {
      var reqWithLogout = { logout: sandbox.spy() };
      new AuthHandler().logOut(reqWithLogout, response);
      expect(reqWithLogout.logout).to.have.been.calledOnce;
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });
  });

});
