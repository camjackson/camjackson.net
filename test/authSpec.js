'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const auth = require('../src/auth');

describe('auth', function() {
  let sandbox;
  let response;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    response = {
      render: sandbox.spy(),
      redirect: sandbox.spy()
    }
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('authorise', function() {
    it('redirects to the login page if the user is not authenticated', function() {
      const reqWithoutAuth = { isAuthenticated: () => false };
      const next = sandbox.spy();
      auth.authorise(reqWithoutAuth, response, next);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
      expect(next).not.to.have.been.called;
    });

    it('calls next if the user is authenticated', function() {
      const reqWithAuth = {
        isAuthenticated: () => true,
        params: {}
      };
      const next = sandbox.spy();
      auth.authorise(reqWithAuth, null, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('logOut', function () {
    it('logs the user out and redirects to the home page', function () {
      const reqWithLogout = { logout: sandbox.spy() };
      auth.logOut(reqWithLogout, response);
      expect(reqWithLogout.logout).to.have.been.calledOnce;
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });
  });

});
