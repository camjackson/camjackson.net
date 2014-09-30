var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var WriteItDown = require('../../lib/writeitdown').WriteItDown;
var PostHandler = require('../../lib/handlers/postHandler').PostHandler;

describe('WriteItDown', function() {

  describe('GET /', function () {
    it('returns the homepage using the postHandler', function (done) {
      var postHandler = new PostHandler();
      sinon.stub(postHandler, 'getRoot', function(req, res) {
        res.status(200).send('Hey');
      });

      request(new WriteItDown(postHandler).app)
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('Hey');
          done();
        });
    });
  });

  describe('GET /write', function () {
    it('returns the new post page using the postHandler', function (done) {
      var postHandler = new PostHandler();
      sinon.stub(postHandler, 'getWrite', function(req, res) {
        res.status(200).send('Hi');
      });

      request(new WriteItDown(postHandler).app)
        .get('/write')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('Hi');
          done();
        });
    });
  });

  describe('PUT /posts/slug', function() {
    var postHandler = new PostHandler();
    it ('creates a new post using the postHandler', function(done) {
      sinon.stub(postHandler, 'createPost', function(req, res) {
        res.redirect(303, 'some-url');
      });
      request(new WriteItDown(postHandler).app)
        .put('/posts/slug')
        .send({
          title: 'Hey',
          slug: 'hello-world',
          text: 'Here is some text'
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('some-url');
          done();
        });
    })
  })
});
