var marked = require('marked');
var postHandler = require('../../../lib/handlers/postHandler');
var models = require('../../../lib/models');
var Post = models.Post;
var Config = models.Config;

describe('postHandler', function() {
  describe('root', function() {
    var config = { a: 'b', c: 'd' };
    function configSuccess() {
      spyOn(Config, 'find').and.callFake(function (id, callback) {
        callback(null, [config]);
      });
    }
    function configError() {
      spyOn(Config, 'find').and.callFake(function (id, callback) {
        callback('error', null);
      });
    }

    var posts = [
      {title: 'hey', text: 'jude', posted: 'yesterday'},
      {title: 'bye', text: 'now', posted: 'today'}
    ];
    function postSuccess() {
      spyOn(Post, 'find').and.callFake(function (id, callback) {
        callback(null, posts);
      });
    }
    function postError() {
      spyOn(Post, 'find').and.callFake(function (id, callback) {
        callback('error', null);
      });
    }

    var result;
    beforeEach(function() {
      result = jasmine.createSpyObj('result', ['render']);
    });

    it('renders the index with config data and marked posts', function() {
      configSuccess();
      postSuccess();
      postHandler.root(null, result);

      var data = {config: config, posts: posts, marked: marked};
      expect(result.render).toHaveBeenCalledWith('index.jade', data);
    });

    it('renders an error page when we cannot get posts', function() {
      configSuccess();
      postError();

      postHandler.root(null, result);

      expect(result.render).toHaveBeenCalledWith('error.jade');
    });

    it('renders an error page when we cannot get config', function() {
      postSuccess();
      configError();

      postHandler.root(null, result);

      expect(result.render).toHaveBeenCalledWith('error.jade');
    });
  });
});
