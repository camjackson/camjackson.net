'use strict';
const request = require('supertest-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
mongoose.models = {};
mongoose.modelSchemas = {};
const bcrypt = require('bcrypt');
const models = require('../src/models');
const User = models.User;
const Post = models.Post;
const App = require('../src/app');

describe('Integration Test', function() {
  before(function() {
    process.env.SITE_TITLE = 'integration title';
    process.env.SITE_HEADING = 'integration heading';
    process.env.SITE_DOMAIN = 'integration.com';
  });

  after(function() {
    process.env.SITE_TITLE = '';
    process.env.SITE_HEADING = '';
    process.env.SITE_DOMAIN = '';
  });

  const first_body_text = '*emphasised*\r\n\r\n' +
    '[//]: # (fold)\r\n\r\n' +
    'behind a click';

  beforeEach(function () {
    mongoose.connect('mongodb://localhost/camjackson-net-test');
    return User.remove({}).exec().then(function() {
      return User.create({
        username: 'test-user',
        password: 'test-password'
      });
    }).then(function() {
      return Post.remove({}).exec();
    }).then(function() {
      return Post.create([
        {
          title: 'Post title',
          slug: 'post-slug',
          text: first_body_text,
          posted: Date.now()
        },
        {
          title: 'Second post',
          slug: 'second-slug',
          text: '**strong**',
          posted: Date.now()
        }
      ]);
    });
  });

  afterEach(function (done) {
    mongoose.connection.close(done)
  });

  const app = new App().app;
  describe('GET /login', function() {
    it('renders the login page successfully', function() {
      const req = request(app).get('/login');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.include('<title>Cam Jackson<\/title>');
        expect(res.text).to.include('name="password"');
        expect(res.text).to.include('<input type="submit"');
      });
    });
  });

  describe('POST /login', function() {
    it('redirects to the write page when credentials are valid', function() {
      const req = request(app).post('/login')
        .type('form')
        .send({
          username: 'test-user',
          password: 'test-password'
        });
      return req.then(function(res) {
        expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
        expect(res.headers.location).to.equal('/write');
      })
    });

    it('redirects to the login page when credentials are invalid', function() {
      const req = request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'bad-user',
          password: 'bad-password'
        });
      return req.then(function(res) {
        expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
        expect(res.headers.location).to.equal('/login');
      });
    });
  });

  describe('POST /logout', function() {
    it('redirects to the home page', function() {
      const req = request(app)
        .post('/logout')
        .type('form')
        .send({});
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/');
      });
    })
  });

  describe('non-existent endpoint', function() {
    it('gives a 404', function() {
      const req = request(app).get('/does-not-exist');
      return req.then(null, function(err) {
          expect(err.response.res.statusCode).to.equal(404);
      });
    });
  });
});
