'use strict';
const request = require('supertest-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const App = require('../../src/app').App;
const AuthHandler = require('../../src/handlers/authHandler').AuthHandler;
const PostHandler = require('../../src/handlers/postHandler').PostHandler;

describe('App', function() {
  let sandbox;
  const authHandler = new AuthHandler();
  const postHandler = new PostHandler();

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  function authorise() {
    sandbox.stub(authHandler, 'authorise', function(req, res, next) {
      next();
    });
  }

  describe('POST /login', function() {
    it('authenticates using the authHandler', function() {
      sandbox.stub(authHandler, 'authenticate', function(req, res) {
        res.redirect(303, '/write');
      });

      const req = request(new App({authHandler: authHandler}).app).post('/login')
        .type('form')
        .send({
          username: 'some-user',
          password: 'some-pass'
        });
      return req.then(null, function(err) {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/write');
      });
    });
  });

  describe('POST /logout', function () {
    it('logs out using the authHandler', function () {
      sandbox.stub(authHandler, 'logOut', function(req, res) {
        res.redirect(303, '/');
      });

      const req = request(new App({authHandler: authHandler}).app).post('/logout')
        .type('form')
        .send({});
      return req.then(null, function(err) {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/');
      });
    });
  });

  describe('GET /write', function () {
    it('redirects to the login page when the user is not authenticated', function() {
      const req = request(new App({postHandler: postHandler, authHandler: authHandler}).app).get('/write');
      return req.then(null, function(err) {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/login');
      });
    });
  });

  describe('PUT /posts/', function() {
    it('redirects to the login page when the user is not authenticated', function() {
      const req = request(new App({postHandler: postHandler, authHandler: authHandler}).app).post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        });
      return req.then(null, function(err) {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/login');
      });
    });

    it ('creates and redirects to a new post using the postHandler when the user is authenticated', function() {
      authorise();
      sandbox.stub(postHandler, 'createOrUpdatePost', function(req, res) {
        res.redirect(303, '/post/some-slug');
      });
      const req = request(new App({postHandler: postHandler, authHandler: authHandler}).app).post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        });
      return req.then(null, function (err) {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/post/some-slug');
      });
    })
  })
});
