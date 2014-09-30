var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');

var models = require('../../lib/models');
var Config = models.Config;
var Post = models.Post;
var WriteItDown = require('../../lib/writeitdown').WriteItDown;

describe('WriteItDown', function() {
  beforeEach(function (done) {
    mongoose.connect('mongodb://localhost/writeitdown-test');
    Config.remove({}).exec().then(function() {
      return Config.create({
        title: 'site title',
        heading: 'site heading'
      });
    }).then(function() {
      done()
    });
  });

  afterEach(function (done) {
    mongoose.connection.close(done)
  });

  describe('GET /', function () {
    beforeEach(function(done) {
      Post.remove({}).exec().then(function() {
        return Post.create({
          title: 'Post title',
          text: '*emphasised*'
        });
      }).then(function() {
        done();
      });
    });

    it('renders the home page successfully', function(done) {
      request(new WriteItDown().app)
        .get('/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>site title</title>');
          expect(res.text).to.include('<em>emphasised</em>');
          done();
        });
    });
  });

  describe('GET /write', function () {
    it('renders the post creation page successfully', function(done) {
      request(new WriteItDown().app)
        .get('/write')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.include('<title>site title<\/title>');
          expect(res.text).to.include('<input type="submit"');
          done();
        });
    })
  });

  describe('errors', function () {
    it('gives a 404 for a bad path', function (done) {
      request(new WriteItDown().app)
        .get('/does_not_exist')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });
});
