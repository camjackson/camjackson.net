var mongoose = require('mongoose');
var request = require('supertest');

var models = require('../../lib/models');
var Post = models.Post;
var Config = models.Config;

var app = require('../../lib/app');

describe('app', function() {
  beforeEach(function () {
    mongoose.connect('mongodb://localhost/writeitdown-test');
  });

  afterEach(function (done) {
    mongoose.connection.close(done)
  });

  describe('GET /', function () {
    beforeEach(function(done) {
      Config.remove({}).exec().then(function() {
        return Config.create({
          title: 'site title',
          heading: 'site heading'
        });
      }).then(function () {
        return Post.remove({}).exec();
      }).then(function() {
        return Post.create({
          title: 'Post title',
          text: '*emphasised*'
        });
      }).then(done);
    });

    it('renders the home page successfully', function(done) {
      request(app.app)
        .get('/')
        .end(function (err, res) {
          expect(err).toBeNull();
          expect(res.statusCode).toBe(200);
          expect(res.text).toMatch(/<title>site title<\/title>/);
          expect(res.text).toMatch(/<em>emphasised<\/em>/);
          done();
        });
    });
  });

  describe('GET /write', function () {
    it('renders the post creation page successfully', function(done) {
      request(app.app)
        .get('/write')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.statusCode).toBe(200);
          expect(res.text).toMatch(/<title>site title<\/title>/);
          expect(res.text).toMatch(/<input type=['"]submit['"]/);
          done();
        });
    })
  });

  describe('errors', function () {
    it('gives a 404 for a bad path', function (done) {
      request(app.app)
        .get('/does_not_exist')
        .end(function(err, res) {
          expect(res.statusCode).toBe(404);
          done();
        });
    });
  });
});
