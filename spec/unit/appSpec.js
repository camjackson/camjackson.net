var request = require('supertest');
var postHandler = require('../../lib/handlers/postHandler');

describe('app', function() {

  spyOn(postHandler, 'getRoot').and.callFake(function(req, res) {
    res.status(200).send('Hey');
  });

  spyOn(postHandler, 'getWrite').and.callFake(function(req, res) {
    res.status(200).send('Hi');
  });

  spyOn(postHandler, 'createPost').and.callFake(function(req, res) {
    res.redirect(303, 'some-url');
  });

  var app = require('../../lib/app');

  describe('GET /', function () {
    it('returns the homepage using the postHandler', function (done) {
      request(app.app)
        .get('/')
        .end(function(err, res) {
//          expect(postHandler.getRoot).toHaveBeenCalled(); TODO
          expect(err).toBeNull();
          expect(res.statusCode).toBe(200);
          expect(res.text).toBe('Hey');
          done();
        });
    });
  });

  describe('GET /write', function () {
    it('returns the new post page using the postHandler', function (done) {
      request(app.app)
        .get('/write')
        .end(function(err, res) {
//          expect(postHandler.getWrite).toHaveBeenCalled(); TODO
          expect(err).toBeNull();
          expect(res.statusCode).toBe(200);
          expect(res.text).toBe('Hi');
          done();
        });
    });
  });

  describe('PUT /posts/slug', function() {
    it ('creates a new post using the postHandler', function(done) {
      request(app.app)
        .put('/posts/slug')
        .send({
          title: 'Hey',
          slug: 'hello-world',
          text: 'Here is some text'
        })
        .end(function (err, res) {
//          var req = jasmine.objectContaining({body: 'whatever'}); TODO
//          expect(postHandler.createPost).toHaveBeenCalledWith(req, jasmine.any(Object)); TODO
          expect(err).toBeNull();
          expect(res.statusCode).toBe(303);
          expect(res.headers.location).toBe('some-url');
          done();
        });
    })
  })

});