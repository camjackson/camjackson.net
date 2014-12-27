var request = require('supertest-as-promised');
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
          text: '*emphasised*',
          posted: Date.now()
        },
        {
          title: 'Second post',
          slug: 'second-slug',
          text: '**strong**',
          posted: Date.now()
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
      it('renders the login page successfully', function() {
        var req = request(app).get('/login');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title<\/title>');
          expect(res.text).to.include('name="password"');
          expect(res.text).to.include('<input type="submit"');
        });
      });
    });

    describe('POST /login', function() {
      it('redirects to the profile page when credentials are valid', function() {
        var req = request(app).post('/login')
          .type('form')
          .send({
            username: 'test-user',
            password: 'test-password'
          });
        return req.then(function(res) {
          expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
          expect(res.headers.location).to.equal('/profile');
        });
      });

      it('redirects to the login page when credentials are invalid', function() {
        var req = request(app)
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
        var req = request(app)
          .post('/logout')
          .type('form')
          .send({});
        return req.then(function(res) {
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('/');
        });
      })
    });

    describe('GET /', function() {
      it('renders the home page successfully', function() {
        var req = request(app).get('/');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title</title>');
          expect(res.text).to.include('<h1 id="heading">integration heading</h1>');
          expect(res.text).to.include('<em>emphasised</em>');
          expect(res.text).to.include('<strong>strong</strong>');
        });
      });
    });

    describe('GET /post/:slug', function() {
      it('renders the post page successfully', function() {
        var req = request(app).get('/post/post-slug');
        return req.then(function(res) {
          expect(res.text).to.include('<title>integration title</title>');
          expect(res.text).to.include('<em>emphasised</em>');
          expect(res.text).not.to.include('<strong>strong</strong>');
        });
      });
    });

    describe('non-existent endpoint', function() {
      it('gives a 404', function() {
        var req = request(app).get('/does-not-exist');
        return req.then(function(res) {
            expect(res.statusCode).to.equal(404);
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

    describe('GET /profile', function() {
      it('renders the profile page successfully', function() {
        var req = request(app).get('/profile');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title<\/title>');
          expect(res.text).to.include('Welcome, test-user!');
          expect(res.text).to.include('name="confirmPassword"');
          expect(res.text).to.include('<input type="submit"');
        });
      });
    });

    describe('PUT /user/:username', function() {
      it('updates the given user', function() {
        var req = request(app).post('/user/test-user')
          .type('form')
          .send({
            _method: 'PUT',
            username: 'new-username',
            password: 'new-password',
            confirmPassword: 'new-password'
          });
        return req.then(function(res) {
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('/profile');
          return User.find().exec();
        }).then(function(users) {
          expect(users).to.have.length(1);
          expect(users[0].username).to.equal('new-username');
          expect(bcrypt.compareSync('new-password', users[0].password)).to.be.true;
        });
      });
    });

    describe('GET /write', function() {
      it('renders the post creation page successfully', function() {
        var req = request(app).get('/write');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title<\/title>');
          expect(res.text).to.include('integration.com');
          expect(res.text).to.include('name="slug"');
          expect(res.text).to.include('<input type="submit"');
        });
      });
    });

    describe('PUT /posts/', function() {
      describe('when there is no post with the given slug', function() {
        it('creates a new post and redirects to it', function() {
          var req = request(app).post('/posts/')
            .type('form')
            .send({
              _method: 'PUT',
              title: 'New Post',
              slug: 'new-post',
              text: 'This is my newest post.'
            });
          return req.then(function(res) {
            expect(res.statusCode).to.equal(303);
            expect(res.headers.location).to.equal('/post/new-post');
            return Post.find({}).exec();
          }).then(function(posts) {
            expect(posts).to.have.length(3);
            return Post.find({slug: 'new-post'}).exec();
          }).then(function(posts) {
            expect(posts).to.have.length(1);
            expect(posts[0].title).to.equal('New Post');
            expect(posts[0].slug).to.equal('new-post');
            expect(posts[0].text).to.equal('This is my newest post.');
            var timeSincePosted = Date.now() - posts[0].posted;
            expect(timeSincePosted).to.be.within(1, 10); //ms
          });
        });
      });

      describe('when there is an existing post with the given slug', function() {
        it('overwrites the existing post without modifying the time', function() {
          var originalTime;
          return Post.findOne({slug: 'post-slug'}).exec().then(function(post) {
            originalTime = post.posted;
            return request(app).post('/posts/')
              .type('form')
              .send({
                _method: 'PUT',
                title: 'Post title (updated)',
                slug: 'post-slug',
                text: '*still emphasised*'
              });
          }).then(function(res) {
            expect(res.statusCode).to.equal(303);
            expect(res.headers.location).to.equal('/post/post-slug');
            return Post.find({}).exec();
          }).then(function(posts) {
            expect(posts).to.have.length(2);
            return Post.find({slug: 'post-slug'}).exec();
          }).then(function(posts) {
            expect(posts).to.have.length(1);
            expect(posts[0].title).to.equal('Post title (updated)');
            expect(posts[0].slug).to.equal('post-slug');
            expect(posts[0].text).to.equal('*still emphasised*');
            expect(posts[0].posted.getTime()).to.equal(originalTime.getTime());
          });
        })
      });
    });
  });
});
