var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var WriteItDown = require('../../lib/writeitdown').WriteItDown;
var PostHandler = require('../../lib/handlers/postHandler').PostHandler;
var AuthHandler = require('../../lib/handlers/authHandler').AuthHandler;

describe('WriteItDown', function() {
  var sandbox;
  var authHandler = new AuthHandler();
  var postHandler = new PostHandler();

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

  describe('GET /login', function() {
    it('returns the login page using the authHandler', function(done) {
      sandbox.stub(authHandler, 'getLogin', function(req, res) {
        res.status(200).send('This is the login page');
      });

      request(new WriteItDown({authHandler: authHandler}).app)
        .get('/login')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('This is the login page');
          done()
        });
    });
  });

  describe('POST /login', function() {
    it('authenticates using the authHandler', function(done) {
      sandbox.stub(authHandler, 'authenticate', function(req, res) {
        res.redirect(303, '/');
      });

      request(new WriteItDown({authHandler: authHandler}).app)
        .post('/login')
        .type('form')
        .send({
          username: 'some-user',
          password: 'some-pass'
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('/');
          done();
        });
    });
  });

  describe('GET /', function () {
    it('returns the homepage using the postHandler', function (done) {
      sandbox.stub(postHandler, 'getRoot', function(req, res) {
        res.status(200).send('This is the home page');
      });

      request(new WriteItDown({postHandler: postHandler}).app)
        .get('/')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('This is the home page');
          done();
        });
    });
  });

  describe('GET /post/:slug', function() {
    it('renders the post using the postHandler', function(done) {
      sandbox.stub(postHandler, 'getPost', function(req, res) {
        res.status(200).send('This is a single post');
      });

      request(new WriteItDown({postHandler: postHandler}).app)
        .get('/post/some-post')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('This is a single post');
          done();
        });
    });
  });

  describe('GET /write', function () {
    it('redirects to the login page when the user is not authenticated', function(done) {
      request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app)
        .get('/write')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
    });

    it('returns the new post page using the postHandler when the user is authenticated', function (done) {
      authorise();
      sandbox.stub(postHandler, 'getWrite', function(req, res) {
        res.status(200).send('Hi');
      });

      request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app)
        .get('/write')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('Hi');
          done();
        });
    });
  });

  describe('PUT /posts/', function() {
    it('redirects to the login page when the user is not authenticated', function(done) {
      request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app)
        .post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
    });

    it ('creates a new post using the postHandler when the user is authenticated', function(done) {
      authorise();
      sandbox.stub(postHandler, 'createOrUpdatePost', function(req, res) {
        res.redirect(303, '/posts/some-slug');
      });
      request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app)
        .post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        })
        .end(function (err, res) {
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('/posts/some-slug');
          done();
        });
    })
  })
});
