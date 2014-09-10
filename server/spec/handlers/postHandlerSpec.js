var postHandler = require('../../src/handlers/postHandler');
var models = require('../../src/models');
var Post = models.Post;

describe('postHandler', function(){
  var result;
  beforeEach(function() {
    result = jasmine.createSpyObj('result', ['render']);
  });

  describe('root', function() {
    it('renders all the stored posts', function() {
      var posts = ['post 1', 'post 2'];
      spyOn(Post, 'find').and.callFake(function(id, callback) {
        callback(null, posts);
      });

      postHandler.root(null, result);

      expect(result.render).toHaveBeenCalledWith('index.jade', jasmine.objectContaining({'posts': posts}));
    });

    it('renders an error page on error', function() {
      spyOn(Post, 'find').and.callFake(function(id, callback) {
        callback('Some error.', null);
      });

      postHandler.root(null, result);

      expect(result.render).toHaveBeenCalledWith('error.jade');
    });
  });
});
