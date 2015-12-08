'use strict';
const request = require('supertest-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
mongoose.models = {};
mongoose.modelSchemas = {};
const bcrypt = require('bcrypt');
const models = require('../../lib/models');
const User = models.User;
const Post = models.Post;
const Profile = models.Profile;
const WriteItDown = require('../../lib/writeitdown').WriteItDown;
const AuthHandler = require('../../lib/handlers/authHandler').AuthHandler;
const helpers = require('../../lib/helpers');

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

  const first_body_text = '*emphasised*\r\n\r\n' +
    '[//]: # (fold)\r\n\r\n' +
    'behind a click';

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
          text: first_body_text,
          posted: Date.now()
        },
        {
          title: 'Second post',
          slug: 'second-slug',
          text: '**strong**',
          posted: Date.now()
        }
      ]);
    }).then(function() {
      return Profile.remove({}).exec();
    }).then(function() {
      return Profile.create({
        text: 'profile text',
        image: 'http://www.example.com/profile_image.jpg'
      });
    });
  });

  afterEach(function (done) {
    mongoose.connection.close(done)
  });

  describe('endpoints that do not need auth', function() {
    const app = new WriteItDown({}).app;
    describe('GET /login', function() {
      it('renders the login page successfully', function() {
        const req = request(app).get('/login');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title<\/title>');
          expect(res.text).to.include('name="password"');
          expect(res.text).to.include('<input type="submit"');
        });
      });
    });

    describe('POST /login', function() {
      it('redirects to the settings page when credentials are valid', function() {
        const req = request(app).post('/login')
          .type('form')
          .send({
            username: 'test-user',
            password: 'test-password'
          });
        return req.then(function(res) {
          expect(res.statusCode).to.equal(302); //TODO: This should be 303. Pending passport pull request #298
          expect(res.headers.location).to.equal('/settings');
        })
      });

      it('redirects to the login page when credentials are invalid', function() {
        const req = request(app)
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
        const req = request(app)
          .post('/logout')
          .type('form')
          .send({});
        return req.then(function(res) {
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('/');
        });
      })
    });

    describe('non-existent endpoint', function() {
      it('gives a 404', function() {
        const req = request(app).get('/does-not-exist');
        return req.then(null, function(err) {
            expect(err.response.res.statusCode).to.equal(404);
        });
      });
    });
  });

  describe('endpoints that need auth', function() {
    const authHandler = new AuthHandler();
    sinon.stub(authHandler, 'authorise', function(req, res, next) {
      next();
    });
    sinon.stub(helpers, 'addUserToResLocals', function(req, res, next) {
      res.locals.user = { username: 'test-user', password: 'test-password' };
      next();
    });
    const app = new WriteItDown({authHandler: authHandler}).app;

    describe('GET /settings', function() {
      it('renders the settings page correctly', function() {
        const req = request(app).get('/settings');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title<\/title>');
          expect(res.text).to.include('Welcome, test-user!');
          expect(res.text).to.include('name="confirmPassword"');
          expect(res.text).to.include('<input type="submit"');
          expect(res.text).to.include('value="http://www.example.com/profile_image.jpg"');
          expect(res.text).to.include('>profile text</textarea>');
        });
      });
    });

    describe('PUT /settings', function() {
      describe('with no existing profile exists', function() {

        beforeEach(function() {
          return Profile.remove({}).exec();
        });

        it('creates the user profile', function() {
          const req = request(app).post('/settings')
            .type('form')
            .send({
              _method: 'PUT',
              profileImage: 'an image',
              profileText: 'the text'
            });
          return req.then(function(res) {
            expect(res.statusCode).to.equal(303);
            return Profile.find({}).exec().then(function(profiles) {
              expect(profiles).to.have.length(1);
              expect(profiles[0].text).to.equal('the text');
              expect(profiles[0].image).to.equal('an image');
            });
          });
        });
      });

      describe('with an existing profile', function() {
        it('updates the existing profile', function() {
          const req = request(app).post('/settings')
            .type('form')
            .send({
              _method: 'PUT',
              profileImage: 'new image',
              profileText: 'new text'
            });
          return req.then(function(res) {
            expect(res.statusCode).to.equal(303);
            return Profile.find({}).exec().then(function(profiles) {
              expect(profiles).to.have.length(1);
              expect(profiles[0].text).to.equal('new text');
              expect(profiles[0].image).to.equal('new image');
            });
          });
        });
      });
    });

    describe('PUT /user/:username', function() {
      it('updates the given user', function() {
        const req = request(app).post('/user/test-user')
          .type('form')
          .send({
            _method: 'PUT',
            username: 'new-username',
            password: 'new-password',
            confirmPassword: 'new-password'
          });
        return req.then(function(res) {
          expect(res.statusCode).to.equal(303);
          expect(res.headers.location).to.equal('/settings');
          return User.find().exec();
        }).then(function(users) {
          expect(users).to.have.length(1);
          expect(users[0].username).to.equal('new-username');
          expect(bcrypt.compareSync('new-password', users[0].password)).to.be.true;
        });
      });
    });

    describe('GET /write', function() {
      it('renders the post creation page successfully with no post parameter', function() {
        const req = request(app).get('/write');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>integration title<\/title>');
          expect(res.text).to.include('integration.com');
          expect(res.text).to.include('name="slug"');
          expect(res.text).to.include('<input type="submit"');
        });
      });

      it('allows slug editing with no post parameter', function() {
        const req = request(app).get('/write');
        return req.then(function(res) {
          expect(res.text).to.not.include('readonly');
        });
      });

      it('renders the post creation page with existing data when there is a post parameter', function() {
        const req = request(app).get('/write?post=second-slug');
        return req.then(function(res) {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.match(/input.*id="title".*value="Second post"/);
          expect(res.text).to.match(/input.*id="slug".*value="second-slug".*readonly/);
          expect(res.text).to.match(/textarea.*\*\*strong\*\*/);
        });
      });
    });

    describe('PUT /posts/', function() {
      describe('when there is no post with the given slug', function() {
        it('creates a new post and redirects to it', function() {
          const req = request(app).post('/posts/')
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
            const timeSincePosted = Date.now() - posts[0].posted;
            expect(timeSincePosted).to.be.within(1, 20); //ms
          });
        });
      });

      describe('when there is an existing post with the given slug', function() {
        it('overwrites the existing post without modifying the time', function() {
          let originalTime;
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
