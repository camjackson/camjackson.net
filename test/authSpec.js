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
      const request = { isAuthenticated: () => false };
      const next = sandbox.spy();
      auth.authorise(request, response, next);
      expect(response.redirect).to.have.been.calledWithExactly(303, '/login');
      expect(next).not.to.have.been.called;
    });

    it('calls next if the user is authenticated', () => {
      const request = { isAuthenticated: () => true };
      const next = sandbox.spy();
      auth.authorise(request, null, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('logOut', () => {
    it('logs the user out and redirects if the user is logged in', () => {
      const request = { isAuthenticated: () => true, logout: sandbox.spy() };
      auth.logOut(request, response);
      expect(request.logout).to.have.been.calledOnce;
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });

    it('just redirects if the user is not logged in', () => {
      const request = { isAuthenticated: () => false, logout: sandbox.spy() };
      auth.logOut(request, response);
      expect(request.logout).not.to.have.been.called;
      expect(response.redirect).to.have.been.calledWithExactly(303, '/');
    });
  });

});
