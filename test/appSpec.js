'use strict';
const request = require('supertest-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const app = require('../src/app');

describe('app', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /write', () => {
    it('redirects to the login page when the user is not authenticated', () => {
      const req = request(app).get('/write');
      return req.then(null, (err) => {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/login');
      });
    });
  });

  describe('PUT /posts/', () => {
    it('redirects to the login page when the user is not authenticated', () => {
      const req = request(app).post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        });
      return req.then(null, (err) => {
        expect(err.response.res.statusCode).to.equal(303);
        expect(err.response.res.headers.location).to.equal('/login');
      });
    });
  })
});
