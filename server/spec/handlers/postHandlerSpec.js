var postHandler = require('../../src/handlers/postHandler');
var models = require('../../src/models');
var Post = models.Post;
var Config = models.Config;

describe('postHandler', function(){
  var result;
  beforeEach(function() {
    result = jasmine.createSpyObj('result', ['render']);
  });

  describe('root', function() {
    it('renders the index with config and post data', function() {
      var config = { a: 'b', c: 'd' };
      spyOn(Config, 'find').and.callFake(function(id, callback) {
        callback(null, [config]);
      });
      var posts = ['post 1', 'post 2'];
      spyOn(Post, 'find').and.callFake(function(id, callback) {
        callback(null, posts);
      });

      postHandler.root(null, result);

      var data = {config: config, posts: posts};
      expect(result.render).toHaveBeenCalledWith('index.jade', data);
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
