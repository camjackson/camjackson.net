var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var models = require('../../lib/models');
var Post = models.Post;
var User = models.User;
var WriteItDown = require('../../lib/writeitdown').WriteItDown;
var AuthHandler = require('../../lib/handlers/authHandler').AuthHandler;
var helpers = require('../../lib/helpers');

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

  beforeEach(function () {
    mongoose.connect('mongodb://localhost/writeitdown-test');
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
          text: '*emphasised*'
        },
        {
          title: 'Second post',
          slug: 'second-slug',
          text: '**strong**'
        }
      ]);
    })
  });

  afterEach(function (done) {
    mongoose.connection.close(done)
  });

  describe('endpoints that do not need auth', function() {
    var app = new WriteItDown({}).app;
    describe('GET /login', function() {
      it('renders the login page successfully', function(done) {
        request(app)
          .get('/login')
          .end(function (err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.include('<title>integration title<\/title>');
            expect(res.text).to.include('name="password"');
            expect(res.text).to.include('<input type="submit"');
            done();
          });
      });
    });

    describe('POST /login', function() {
      it('redirects to the profile page when credentials are valid', function(done) {
        request(app)
          .post('/login')
          .type('form')
          .send({
            username: 'test-user',
            password: 'test-password'
          })
          .end(function (err, res) {
            expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
            expect(res.headers.location).to.equal('/profile');
            done();
          });
      });

      it('redirects to the login page when credentials are invalid', function(done) {
        request(app)
          .post('/login')
          .type('form')
          .send({
            username: 'bad-user',
            password: 'bad-password'
          })
          .end(function (err, res) {
            expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
            expect(res.headers.location).to.equal('/login');
            done();
          });
      });
    });

    describe('POST /logout', function() {
      it('redirects to the home page', function(done) {
        request(app)
          .post('/logout')
          .type('form')
          .send({})
          .end(function (err, res) {
            expect(res.statusCode).to.equal(303);
            expect(res.headers.location).to.equal('/');
            done();
          });
      })
    });

    describe('GET /', function () {
      it('renders the home page successfully', function(done) {
        request(app)
          .get('/')
          .end(function (err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.include('<title>integration title</title>');
            expect(res.text).to.include('<h1 id="heading">integration heading</h1>');
            expect(res.text).to.include('<em>emphasised</em>');
            expect(res.text).to.include('<strong>strong</strong>');
            done();
          });
      });
    });

    describe('GET /post/:slug', function() {
      it('renders the post page successfully', function(done) {
        request(app)
          .get('/post/post-slug')
          .end(function(req, res) {
            expect(res.text).to.include('<title>integration title</title>');
            expect(res.text).to.include('<em>emphasised</em>');
            expect(res.text).not.to.include('<strong>strong</strong>');
            done();
          });
      });
    });

    describe('non-existent endpoint', function () {
      it('gives a 404', function (done) {
        request(app)
          .get('/does-not-exist')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(404);
            done();
          });
      });
    });
  });

  describe('endpoints that need auth', function() {
    var authHandler = new AuthHandler();
    sinon.stub(authHandler, 'authorise', function(req, res, next) {
      next();
    });
    sinon.stub(helpers, 'addUserToResLocals', function(req, res, next) {
      res.locals.user = { username: 'test-user', password: 'test-password' };
      next();
    });
    var app = new WriteItDown({authHandler: authHandler}).app;

    describe('GET /profile', function () {
      it('renders the profile page successfully', function (done) {
        request(app)
          .get('/profile')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.include('<title>integration title<\/title>');
            expect(res.text).to.include('Welcome, test-user!');
            expect(res.text).to.include('name="confirmPassword"');
            expect(res.text).to.include('<input type="submit"');
            done();
          });
      });
    });

    describe('PUT /user/:username', function () {
      it('updates the given user', function (done) {
        request(app)
          .post('/user/test-user')
          .type('form')
          .send({
            _method: 'PUT',
            username: 'new-username',
            password: 'new-password',
            confirmPassword: 'new-password'
          })
          .end(function (err, res) {
            expect(res.statusCode).to.equal(303);
            expect(res.headers.location).to.equal('/profile');

            User.find().exec().then(function(users) {
              expect(users).to.have.length(1);
              expect(users[0].username).to.equal('new-username');
              expect(bcrypt.compareSync('new-password', users[0].password)).to.be.true;
              done();
            });
          })
      });
    });

    describe('GET /write', function () {
      it('renders the post creation page successfully', function(done) {
        request(app)
          .get('/write')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.text).to.include('<title>integration title<\/title>');
            expect(res.text).to.include('integration.com');
            expect(res.text).to.include('name="slug"');
            expect(res.text).to.include('<input type="submit"');
            done();
          });
      })
    });

    describe('PUT /posts/', function() {
      describe('when there is no post with the given slug', function() {
        it('creates a new post and redirects to it', function(done) {
          request(app)
            .post('/posts/')
            .type('form')
            .send({
              _method: 'PUT',
              title: 'New Post',
              slug: 'new-post',
              text: 'This is my newest post.'
            })
            .end(function (err, res) {
              expect(res.statusCode).to.equal(303);
              expect(res.headers.location).to.equal('/post/new-post');

              Post.find({}).exec().then(function(posts) {
                expect(posts).to.have.length(3);
                return Post.findOne({slug: 'new-post'}).exec()
              }).then(function(post) {
                expect(post.title).to.equal('New Post');
                expect(post.slug).to.equal('new-post');
                expect(post.text).to.equal('This is my newest post.');
                done();
              });
            });
        });
      });

      describe('when there is an existing post with the given slug', function() {
        it('overwrites the existing post', function(done) {
          request(app)
            .post('/posts/')
            .type('form')
            .send({
              _method: 'PUT',
              title: 'Post title (updated)',
              slug: 'post-slug',
              text: '*still emphasised*'
            })
            .end(function (err, res) {
              expect(res.statusCode).to.equal(303);
              expect(res.headers.location).to.equal('/post/post-slug');

              Post.find({}).exec().then(function(posts) {
                expect(posts).to.have.length(2);
                return Post.find({slug: 'post-slug'}).exec()
              }).then(function(posts) {
                expect(posts).to.have.length(1);
                expect(posts[0].title).to.equal('Post title (updated)');
                expect(posts[0].slug).to.equal('post-slug');
                expect(posts[0].text).to.equal('*still emphasised*');
                done();
              });
            });
        })
      });
    });
  });
});
