var request = require('supertest');
var postHandler = require('../../lib/handlers/postHandler');

describe('app', function() {

  spyOn(postHandler, 'root').and.callFake(function(req, res) {
    res.status(999).send('Hey');
  });

  spyOn(postHandler, 'write').and.callFake(function(req, res) {
    res.status(990).send('Hi');
  });

  var app = require('../../lib/app');

  describe('/', function () {
    it('returns the homepage using the postHandler', function (done) {
      request(app.app)
        .get('/')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.statusCode).toBe(999);
          expect(res.text).toBe('Hey');
          done();
        });
    });
  });

  describe('/write', function () {
    it('returns the new post page using the postHandler', function (done) {
      request(app.app)
        .get('/write')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.statusCode).toBe(990);
          expect(res.text).toBe('Hi');
          done();
        });
    });
  });
});