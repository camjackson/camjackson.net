postHandler = require('../../src/handlers/postHandler');
models      = require('../../src/models');
var Post = models.Post;
var any = jasmine.any;

describe('postHandler', function(){
  var result;
  var errorValue = 'Some error.';

  beforeEach(function() {
    result = jasmine.createSpyObj('result', ['send']);
  });

  afterEach(function() {
    expect(result.send.calls.count()).toEqual(1);
  });

  describe('getPosts', function() {
    it('gets all stored posts', function() {
      var posts = ['post 1', 'post 2'];
      spyOn(Post, 'find').and.callFake(function (conditions, callback) {
        callback(null, posts);
      });

      postHandler.getPosts(null, result);

      expect(result.send).toHaveBeenCalledWith(200, posts);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'find').and.callFake(function(conditions, callback) {
        callback(errorValue, null);
      });

      postHandler.getPosts(null, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not retrieve posts.');
    });
  });

  describe('getPost', function() {
    it('gets a post matching the given id', function() {
      var post = 'some Post';
      spyOn(Post, 'findById').and.callFake(function(id, callback) {
        callback(null, post)
      });

      postHandler.getPost({'params': {'id': 7}}, result);

      expect(Post.findById).toHaveBeenCalledWith(7, any(Function));
      expect(result.send).toHaveBeenCalledWith(200, post);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'findById').and.callFake(function(id, callback) {
        callback(errorValue, null)
      });

      postHandler.getPost({'params': {'id': '7'}}, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not retrieve post 7.');
    });

    //TODO: When request is invalid (e.g. no id)
  });

  describe('createPost', function() {
    it('creates a new post with the given data', function() {
      var createdPost = 'the new post';
      spyOn(Post, 'create').and.callFake(function(document, callback) {
        callback(null, createdPost);
      });

      postHandler.createPost({'body': {'title': 'Hello, world!', 'text': 'Lorem ipsum.'}}, result);

      var document = {'title': 'Hello, world!', 'text': 'Lorem ipsum.', 'authorId': null};
      expect(Post.create).toHaveBeenCalledWith(document, any(Function));
      expect(result.send).toHaveBeenCalledWith(201, createdPost);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'create').and.callFake(function(document, callback) {
        callback(errorValue, null);
      });

      postHandler.createPost({'body': {'title': '', 'text': ''}}, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not create post.');
    });

    //TODO: When request is invalid (e.g. no title, no text)
  });

  describe('deletePost', function() {
    it('deletes the post with the given id', function() {
      var deletedPost = 'Bye bye';
      spyOn(Post, 'findByIdAndRemove').and.callFake(function(id, callback) {
        callback(null, deletedPost)
      });

      postHandler.deletePost({'params': {'id': 3}}, result);

      expect(Post.findByIdAndRemove).toHaveBeenCalledWith(3, any(Function));
      expect(result.send).toHaveBeenCalledWith(204, deletedPost);
    });

    it('sends an error back upon failure', function() {
      spyOn(Post, 'findByIdAndRemove').and.callFake(function(id, callback) {
        callback(errorValue, null);
      });

      postHandler.deletePost({'params': {'id': 3}}, result);

      expect(result.send).toHaveBeenCalledWith(500, 'Could not delete post 3.');
    });

    //TODO: When request is invalid (e.g. no id)
  });
});
