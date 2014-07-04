postHandler = require('../../src/handlers/postHandler');
models      = require('../../src/models');
var Post = models.Post;
var any = jasmine.any;

describe('postHandler', function(){
  var result;

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

    it('sends the error back upon failure', function() {
      var error = 'Broken!';
      spyOn(Post, 'find').and.callFake(function(conditions, callback) {
        callback(error, null);
      });

      postHandler.getPosts(null, result);

      expect(result.send).toHaveBeenCalledWith(500, error);
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

    it('sends the error back upon failure', function() {
      var error = 'Whoops!';
      spyOn(Post, 'findById').and.callFake(function(id, callback) {
        callback(error, null)
      });

      postHandler.getPost({'params': {'id': ':('}}, result);

      expect(result.send).toHaveBeenCalledWith(500, error);
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

    it('sends the error back upon failure', function() {
      var error = 'Could not create!';
      spyOn(Post, 'create').and.callFake(function(document, callback) {
        callback(error, null);
      });

      postHandler.createPost({'body': {'title': '', 'text': ''}}, result);

      expect(result.send).toHaveBeenCalledWith(500, error);
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

    it('sends the error back upon failure', function() {
      var error = 'Could not delete!';
      spyOn(Post, 'findByIdAndRemove').and.callFake(function(id, callback) {
        callback(error, null);
      });

      postHandler.deletePost({'params': {'id': 3}}, result);

      expect(result.send).toHaveBeenCalledWith(500, error);
    });

    //TODO: When request is invalid (e.g. no id)
  });
});
