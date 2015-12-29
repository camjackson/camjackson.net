'use strict';
const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const app = require('../src/app');
const models = require('../src/models');
const User = models.User;

describe('Integration Test', () => {
  beforeEach(() => {
    mongoose.connect('mongodb://localhost/camjackson-net-test');
    return User.remove({}).exec().then(() => {
      return User.create({
        username: 'test-user',
        password: 'test-password'
      });
    })
  });

  afterEach((done) => {
    mongoose.connection.close(done)
  });

  describe('GET /login', () => {
    it('renders the login page successfully', () => {
      return request(app).get('/login').then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.include('<title>Cam Jackson<\/title>');
        expect(res.text).to.include('name="password"');
        expect(res.text).to.include('<input type="submit"');
      });
    });
  });

  describe('POST /login', () => {
    it('redirects to the write page when credentials are valid', () => {
      const req = request(app).post('/login')
        .type('form')
        .send({
          username: 'test-user',
          password: 'test-password'
        });
      return req.then((res) => {
        expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
        expect(res.headers.location).to.equal('/write');
      })
    });

    it('redirects to the login page when credentials are invalid', () => {
      const req = request(app)
        .post('/login')
        .type('form')
        .send({
          username: 'bad-user',
          password: 'bad-password'
        });
      return req.then((res) => {
        expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
        expect(res.headers.location).to.equal('/login');
      });
    });
  });

  describe('POST /logout', () => {
    it('redirects to the home page', () => {
      return request(app).get('/logout').then((res) => {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/');
      });
    })
  });

  describe('non-existent endpoint', () => {
    it('gives a 404', () => {
      const req = request(app).get('/does-not-exist');
      return req.then(null, (err) => {
          expect(err.response.res.statusCode).to.equal(404);
      });
    });
  });
});
