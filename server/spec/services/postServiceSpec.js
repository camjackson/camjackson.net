var postService = require('../../src/services/postService');
var models = require('../../src/models');
var Post = models.Post;

describe('postService', function(){
  var errorValue = 'Some error.';

  describe('getPost', function() {
    it('gets a post matching the given id', function() {
      var post = 'some Post';
      spyOn(Post, 'findById').and.callFake(function(id, callback) {
        callback(null, post)
      });

      expect(postService.getPost()).toBe(post);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'findById').and.callFake(function(id, callback) {
        callback(errorValue, null)
      });

      expect(postService.getPost()).toBe(null);
    });
  });

  describe('createPost', function() {
    it('creates a new post with the given data', function() {
      var createdPost = 'the new post';
      spyOn(Post, 'create').and.callFake(function(document, callback) {
        callback(null, createdPost);
      });

      expect(postService.createPost('Hello, world!', 'Lorem ipsum.', null)).toBe(createdPost);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'create').and.callFake(function(document, callback) {
        callback(errorValue, null);
      });

      expect(postService.createPost('', '', null)).toBe(null);
    });
  });

  describe('deletePost', function() {
    it('deletes the post with the given id', function() {
      var deleteResult = 'success';
      spyOn(Post, 'findByIdAndRemove').and.callFake(function(id, callback) {
        callback(null, deleteResult)
      });

      expect(postService.deletePost(3)).toBe(deleteResult);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'findByIdAndRemove').and.callFake(function(id, callback) {
        callback(errorValue, null);
      });

      expect(postService.deletePost(null)).toBe(null);
    });
  });
});
