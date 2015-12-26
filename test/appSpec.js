'use strict';
const request = require('supertest-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const App = require('../src/app');

describe('App', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('GET /write', function () {
    it('redirects to the login page when the user is not authenticated', function() {
      const req = request(new App().app).get('/write');
      return req.then(null, function(err) {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/login');
      });
    });
  });

  describe('PUT /posts/', function() {
    it('redirects to the login page when the user is not authenticated', function() {
      const req = request(new App().app).post('/posts/')
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
  })
});
