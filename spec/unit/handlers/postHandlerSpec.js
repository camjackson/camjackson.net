var marked = require('marked');
var postHandler = require('../../../lib/handlers/postHandler');
var models = require('../../../lib/models');
var Post = models.Post;
var Config = models.Config;

describe('postHandler', function() {
  var result;
  beforeEach(function() {
    result = jasmine.createSpyObj('result', ['render']);
  });

  describe('root', function() {
    it('renders the index with marked, posts, and config', function() {
      spyOn(Config, 'findOne').and.returnValue('config');
      spyOn(Post, 'find').and.returnValue(['post 1', 'post 2']);

      postHandler.root(null, result);

      var data = { marked: marked, config: 'config', posts: ['post 1', 'post 2'] };
      expect(result.render).toHaveBeenCalledWith('index.jade', data);
    });
  });
});
