'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const AuthHandler = require('../../../src/handlers/authHandler').AuthHandler;
const helpers = require('../../../src/helpers');

describe('AuthHandler', function() {
  let sandbox;
  let response;
  const createResponder = function(){return 'a responder';};

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
      const reqWithAuth = { isAuthenticated: function() {return true} };
      new AuthHandler(createResponder).getLogin(reqWithAuth, response);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });

    it('sends the login page with correct data when the user is not already authenticated', function() {
      const reqWithFlashAndAuth = {
        flash: function () {return ['some auth error']},
        isAuthenticated: function() {return false}
      };
      new AuthHandler(createResponder).getLogin(reqWithFlashAndAuth, response);
      expect(response.render).to.have.been.calledWith(
        'pages/login.jade',
        { config: 'config', errorMessage: 'some auth error' },
        'a responder'
      );
    });
  });

  describe('authorise', function() {
    it('redirects to the login page if the user is not authenticated', function() {
      const reqWithoutAuth = { isAuthenticated: function() {return false} };
      new AuthHandler().authorise(reqWithoutAuth, response);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
    });

    it('redirects to the login page when trying to modify a different user', function() {
      const reqWithUserMismatch = {
        isAuthenticated: function() {return true},
        params: { username: 'requested-user' },
        user: { username: 'logged-in-user' }
      };
      new AuthHandler().authorise(reqWithUserMismatch, response);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
    });

    it('does nothing when trying to modify the logged in user', function() {
      const reqWithUserMatch = {
        isAuthenticated: function() {return true},
        params: { username: 'logged-in-user' },
        user: { username: 'logged-in-user' }
      };
      const next = sandbox.spy();
      new AuthHandler().authorise(reqWithUserMatch, null, next);
      expect(next).to.have.been.calledOnce;
    });

    it('does nothing if the user is authenticated, and not trying to access a user', function() {
      const reqWithAuth = {
        isAuthenticated: function() {return true},
        params: {}
      };
      const next = sandbox.spy();
      new AuthHandler().authorise(reqWithAuth, null, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('logOut', function () {
    it('logs the user out and redirects to the home page', function () {
      const reqWithLogout = { logout: sandbox.spy() };
      new AuthHandler().logOut(reqWithLogout, response);
      expect(reqWithLogout.logout).to.have.been.calledOnce;
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });
  });

});
