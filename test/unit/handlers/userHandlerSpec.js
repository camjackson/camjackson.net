'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const Q = require('q');

const marked = require('marked');

const UserHandler = require('../../../src/handlers/userHandler').UserHandler;
const helpers = require('../../../src/helpers');
const User = require('../../../src/models').User;

describe('UserHandler', function() {
  let sandbox;
  let response;
  const userHandler = new UserHandler(function(){return 'a responder';});

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(helpers, 'getEnvConfig').returns('the config');
    response = { redirect: sandbox.spy() };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('updateUser', function() {
    let requestBody;

    beforeEach(function() {
      requestBody = {
        username: 'new-username',
        password: 'new-password',
        confirmPassword: 'new-password'
      };
    });

    it('flashes an error and redirects to the settings page when the username field is blank', function() {
      sandbox.spy(User, 'update');
      requestBody.username = '';
      const request = { body: requestBody, params: {username: 'some-user'}, flash: sandbox.spy() };

      userHandler.updateUser(request, response);
      expect(User.update).not.to.have.been.called;
      expect(request.flash).to.have.been.calledWithExactly('errorMessage', 'Please enter a username');
      expect(response.redirect).to.have.been.calledWithExactly(303, '/settings');
    });

    it('flashes an error and redirects to the settings page when the password field is blank', function() {
      sandbox.spy(User, 'update');
      requestBody.password = '';
      const request = { body: requestBody, params: {username: 'some-user'}, flash: sandbox.spy() };

      userHandler.updateUser(request, response);
      expect(User.update).not.to.have.been.called;
      expect(request.flash).to.have.been.calledWithExactly('errorMessage', 'Please enter a password');
      expect(response.redirect).to.have.been.calledWithExactly(303, '/settings');
    });

    it('flashes an error and redirects to the settings page when the passwords do not match', function() {
      sandbox.spy(User, 'update');
      requestBody.confirmPassword = 'typo-password';
      const request = { body: requestBody, params: {username: 'some-user'}, flash: sandbox.spy() };

      userHandler.updateUser(request, response);
      expect(User.update).not.to.have.been.called;
      expect(request.flash).to.have.been.calledWithExactly('errorMessage', 'Passwords do not match');
      expect(response.redirect).to.have.been.calledWithExactly(303, '/settings');
    });

    it('updates the user and redirects to the settings page when everything is OK', function() {
      const foundUser = { save: sandbox.spy() };
      const promiseWithUser = Q.fcall(function() {return foundUser});
      sandbox.stub(User, 'findOne').returns({exec: function() {return promiseWithUser;}});
      const request = { body: requestBody, params: {username: 'some-user'}};

      return userHandler.updateUser(request, response).then(function() {
        expect(User.findOne).to.have.been.calledWithExactly({username: 'some-user'});
        expect(foundUser.username).to.equal('new-username');
        expect(foundUser.password).to.equal('new-password');
        expect(foundUser.save).to.have.been.calledOnce;
        expect(response.redirect).to.have.been.calledWithExactly(303, '/settings');
      });
    });

    it('flashes an error and redirects to the settings page when the username is taken', function() {
      const failingPromise = Q.fcall(function() {throw new Error();});
      sandbox.stub(User, 'findOne').returns({ exec: function() {return failingPromise;} });
      const request = { body: requestBody, params: {username: 'some-user'}, flash: sandbox.spy() };

      return userHandler.updateUser(request, response).then(function() {
        expect(request.flash).to.have.been.calledWithExactly('errorMessage', 'Sorry, that username is taken');
        expect(response.redirect).to.have.been.calledWithExactly(303, '/settings');
      });
    });
  });
});
