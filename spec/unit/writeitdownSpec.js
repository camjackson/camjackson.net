var request = require('supertest-as-promised');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var WriteItDown = require('../../lib/writeitdown').WriteItDown;
var AuthHandler = require('../../lib/handlers/authHandler').AuthHandler;
var UserHandler = require('../../lib/handlers/userHandler').UserHandler;
var SettingsHandler = require('../../lib/handlers/settingsHandler').SettingsHandler;
var PostHandler = require('../../lib/handlers/postHandler').PostHandler;

describe('WriteItDown', function() {
  var sandbox;
  var authHandler = new AuthHandler();
  var userHandler = new UserHandler();
  var settingsHandler = new SettingsHandler();
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
    it('returns the login page using the authHandler', function() {
      sandbox.stub(authHandler, 'getLogin', function(req, res) {
        res.status(200).send('This is the login page');
      });

      var req = request(new WriteItDown({authHandler: authHandler}).app).get('/login');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('This is the login page');
      });
    });
  });

  describe('POST /login', function() {
    it('authenticates using the authHandler', function() {
      sandbox.stub(authHandler, 'authenticate', function(req, res) {
        res.redirect(303, '/settings');
      });

      var req = request(new WriteItDown({authHandler: authHandler}).app).post('/login')
        .type('form')
        .send({
          username: 'some-user',
          password: 'some-pass'
        });
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/settings');
      });
    });
  });

  describe('POST /logout', function () {
    it('logs out using the authHandler', function () {
      sandbox.stub(authHandler, 'logOut', function(req, res) {
        res.redirect(303, '/');
      });

      var req = request(new WriteItDown({authHandler: authHandler}).app).post('/logout')
        .type('form')
        .send({});
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/');
      });
    });
  });

  describe('GET /', function () {
    it('returns the homepage using the postHandler', function () {
      sandbox.stub(postHandler, 'getRoot', function(req, res) {
        res.status(200).send('This is the home page');
      });

      var req = request(new WriteItDown({postHandler: postHandler}).app).get('/');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('This is the home page');
      });
    });
  });

  describe('GET /settings', function () {
    it('redirects to the login page when the user is not authenticated', function() {
      var req = request(new WriteItDown({authHandler: authHandler}).app).get('/settings');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/login');
      });
    });

    it('renders the settings page using the settingsHandler when the user is authenticated', function () {
      authorise();
      sandbox.stub(settingsHandler, 'getSettings', function(req, res) {
        res.status(200).send("This is the settings page");
      });

      var req = request(new WriteItDown({settingsHandler: settingsHandler, authHandler: authHandler}).app).get('/settings');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal("This is the settings page");
      });
    });
  });

  describe('PUT /user/:username', function() {
    it('redirects to the login page when the user is not authenticated', function() {
      var req = request(new WriteItDown({userHandler: userHandler, authHandler: authHandler}).app).post('/user/test-user')
        .type('form')
        .send({
          _method: 'PUT',
          username: 'new-username',
          password: 'new-password',
          confirmPassword: 'new-password'
        });
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/login');
      });
    });

    it ('updates the user and redirects to the settings page using the userHandler when the user is authenticated', function() {
      authorise();
      sandbox.stub(userHandler, 'updateUser', function(req, res) {
        res.redirect(303, '/settings');
      });

      var req = request(new WriteItDown({userHandler: userHandler, authHandler: authHandler}).app).post('/user/test-user')
        .type('form')
        .send({
          _method: 'PUT',
          username: 'new-username',
          password: 'new-password',
          confirmPassword: 'new-password'
        });
      return req.then(function (res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/settings');
      });
    })
  });

  describe('GET /post/:slug', function() {
    it('renders the post using the postHandler', function() {
      sandbox.stub(postHandler, 'getPost', function(req, res) {
        res.status(200).send('This is a single post');
      });

      var req = request(new WriteItDown({postHandler: postHandler}).app).get('/post/some-post');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('This is a single post');
      });
    });
  });

  describe('GET /write', function () {
    it('redirects to the login page when the user is not authenticated', function() {
      var req = request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app).get('/write');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/login');
      });
    });

    it('returns the new post page using the postHandler when the user is authenticated', function () {
      authorise();
      sandbox.stub(postHandler, 'getWrite', function(req, res) {
        res.status(200).send('Hi');
      });

      var req = request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app).get('/write');
      return req.then(function(res) {
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('Hi');
      });
    });
  });

  describe('PUT /posts/', function() {
    it('redirects to the login page when the user is not authenticated', function() {
      var req = request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app).post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        });
      return req.then(function(res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/login');
      });
    });

    it ('creates and redirects to a new post using the postHandler when the user is authenticated', function() {
      authorise();
      sandbox.stub(postHandler, 'createOrUpdatePost', function(req, res) {
        res.redirect(303, '/post/some-slug');
      });
      var req = request(new WriteItDown({postHandler: postHandler, authHandler: authHandler}).app).post('/posts/')
        .type('form')
        .send({
          _method: 'PUT',
          title: 'Hey',
          slug: 'some-slug',
          text: 'Here is some text'
        });
      return req.then(function (res) {
        expect(res.statusCode).to.equal(303);
        expect(res.headers.location).to.equal('/post/some-slug');
      });
    })
  })
});
