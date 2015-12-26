'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const auth = require('../src/auth');

describe('auth', () => {
  let sandbox;
  let response;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    response = {
      render: sandbox.spy(),
      redirect: sandbox.spy()
    }
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('authorise', () => {
    it('redirects to the login page if the user is not authenticated', () => {
      const reqWithoutAuth = { isAuthenticated: () => false };
      const next = sandbox.spy();
      auth.authorise(reqWithoutAuth, response, next);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
      expect(next).not.to.have.been.called;
    });

    it('calls next if the user is authenticated', () => {
      const reqWithAuth = {
        isAuthenticated: () => true,
        params: {}
      };
      const next = sandbox.spy();
      auth.authorise(reqWithAuth, null, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('logOut', () => {
    it('logs the user out and redirects to the home page', () => {
      const reqWithLogout = { logout: sandbox.spy() };
      auth.logOut(reqWithLogout, response);
      expect(reqWithLogout.logout).to.have.been.calledOnce;
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });
  });

});
