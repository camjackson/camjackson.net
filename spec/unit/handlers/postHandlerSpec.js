var marked = require('marked');
var postHandler = require('../../../lib/handlers/postHandler');
var models = require('../../../lib/models');
var Post = models.Post;
var Config = models.Config;

describe('postHandler', function(){
  describe('root', function() {

    var result;
    var config = { a: 'b', c: 'd' };
    var posts = ['post 1', 'post 2'];
    beforeEach(function() {
      result = jasmine.createSpyObj('result', ['render']);
      spyOn(Config, 'find').and.callFake(function(id, callback) {
        callback(null, [config]);
      });

      spyOn(Post, 'find').and.callFake(function(id, callback) {
        callback(null, posts);
      });
    });

    it('renders the index with config data and marked posts', function() {
      postHandler.root(null, result);

      var data = {config: config, posts: posts};
      expect(result.render).toHaveBeenCalledWith('index.jade', data);
    });

    it('passes each post through marked', function() {
      postHandler.root(null, result);
    });

    it('renders an error page when we cannot get posts', function() {
      spyOn(Post, 'find').and.callFake(function(id, callback) {
        callback('Some error.', null);
      });

      postHandler.root(null, result);

      expect(result.render).toHaveBeenCalledWith('error.jade');
    });

    it('renders an error page when we cannot get config', function() {
      spyOn(Config, 'find').and.callFake(function(id, callback) {
        callback('Some error.', null);
      });

      postHandler.root(null, result);

      expect(result.render).toHaveBeenCalledWith('error.jade');
    });
  });
});
