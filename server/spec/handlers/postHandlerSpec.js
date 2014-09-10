var postHandler = require('../../src/handlers/postHandler');
var postService = require('../../src/services/postService');

describe('postHandler', function(){
  var result;

  beforeEach(function() {
    result = jasmine.createSpyObj('result', ['send']);
  });

  afterEach(function() {
    expect(result.send.calls.count()).toEqual(1);
  });

  describe('getPost', function() {
    it('gets a post matching the given id', function() {
      var post = 'some Post';
      spyOn(postService, 'getPost').and.returnValue(post);

      postHandler.getPost({'params': {'id': 7}}, result);

      expect(postService.getPost).toHaveBeenCalledWith(7);
      expect(result.send).toHaveBeenCalledWith(200, post);
    });

    it('sends an error back upon failure', function() {
      spyOn(postService, 'getPost').and.returnValue(null);

      postHandler.getPost({'params': {'id': 7}}, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not retrieve post 7.');
    });

    //TODO: When request is invalid (e.g. no id)
  });

  describe('createPost', function() {
    it('creates a new post with the given data', function() {
      var createdPost = 'the new post';
      spyOn(postService, 'createPost').and.returnValue(createdPost);

      var title = 'Hello, world!';
      var text = 'Lorem ipsum.';
      postHandler.createPost({'body': {'title': title, 'text': text}}, result);

      expect(postService.createPost).toHaveBeenCalledWith(title, text, null);
      expect(result.send).toHaveBeenCalledWith(201, createdPost);
    });

    it('sends an error back upon failure', function() {
      spyOn(postService, 'createPost').and.returnValue(null);

      postHandler.createPost({'body': {'title': '', 'text': ''}}, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not create post.');
    });

    //TODO: When request is invalid (e.g. no title, no text)
  });

  describe('deletePost', function() {
    it('deletes the post with the given id', function() {
      var deletedPost = 'Bye bye';
      spyOn(postService, 'deletePost').and.returnValue(deletedPost);

      postHandler.deletePost({'params': {'id': 3}}, result);

      expect(postService.deletePost).toHaveBeenCalledWith(3);
      expect(result.send).toHaveBeenCalledWith(204, deletedPost);
    });

    it('sends an error back upon failure', function() {
      spyOn(postService, 'deletePost').and.returnValue(null);

      postHandler.deletePost({'params': {'id': 3}}, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not delete post 3.');
    });

    //TODO: When request is invalid (e.g. no id)
  });
});
