var marked = require('marked');
var postHandler = require('../../../lib/handlers/postHandler');
var models = require('../../../lib/models');
var Post = models.Post;
var Config = models.Config;

describe('postHandler', function() {
  var result;
  beforeEach(function() {
    result = jasmine.createSpyObj('result', ['render', 'status', 'send']);
    result.status.and.returnValue(result);
  });

  describe('getRoot', function() {
    describe('when render succeeds', function () {
      beforeEach(function() {
        result.render.and.callFake(function(_, __, callback) {
          callback(null, 'success');
        });
      });

      it('renders the index with correct data', function() {
        spyOn(Config, 'findOne').and.returnValue('config');
        spyOn(Post, 'find').and.returnValue('posts');

        postHandler.getRoot(null, result);

        var data = { marked: marked, config: 'config', posts: 'posts' };
        expect(result.render).toHaveBeenCalledWith('index.jade', data, jasmine.any(Function));
        expect(result.status).toHaveBeenCalledWith(200);
        expect(result.send).toHaveBeenCalledWith('success');
      });
    });

    describe('when render fails', function () {
      beforeEach(function() {
        result.render.and.callFake(function(_, __, callback) {
          if (callback) {
            callback('failure', null);
          }
        });
      });

      it('renders the error page', function () {
        postHandler.getRoot(null, result);

        expect(result.status).toHaveBeenCalledWith(500);
        expect(result.render).toHaveBeenCalledWith('error.jade');
      });
    });
  });

  describe('getWrite', function() {
    describe('when render succeeds', function () {
      beforeEach(function() {
        result.render.and.callFake(function(_, __, callback) {
          callback(null, 'success');
        });
      });

      it('renders the write page with config', function() {
        spyOn(Config, 'findOne').and.returnValue('config');

        postHandler.getWrite(null, result);

        expect(result.render).toHaveBeenCalledWith('write.jade', { config: 'config' }, jasmine.any(Function));
        expect(result.status).toHaveBeenCalledWith(200);
        expect(result.send).toHaveBeenCalledWith('success');
      });
    });

    describe('when render fails', function () {
      beforeEach(function() {
        result.render.and.callFake(function(_, __, callback) {
          if (callback) {
            callback('failure', null);
          }
        });
      });

      it('renders the error page', function () {
        postHandler.getWrite(null, result);

        expect(result.status).toHaveBeenCalledWith(500);
        expect(result.render).toHaveBeenCalledWith('error.jade');
      });
    });
  });
});
