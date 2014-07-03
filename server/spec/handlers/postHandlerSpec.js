postHandler = require('../../src/handlers/postHandler');
models      = require('../../src/models');
var Post = models.Post;

describe('postHandler', function(){
    var request;
    var result;

    beforeEach(function() {
        request = null;
        result = jasmine.createSpyObj('result', ['json', 'send']);
    });

    describe('getPosts', function() {
        it('gets all stored posts', function() {
            var posts = ['post 1', 'post 2'];
            spyOn(Post, 'find').and.callFake(function (conditions, callback) {
                callback(null, posts);
            });

            postHandler.getPosts(request, result);

            expect(result.json).toHaveBeenCalledWith(posts);
            expect(result.send).not.toHaveBeenCalled();
        });

        it('sends the error back upon failure', function() {
            var error = 'Broken!';
            spyOn(Post, 'find').and.callFake(function(conditions, callback) {
                callback(error, null);
            });

            postHandler.getPosts(request, result);

            expect(result.send).toHaveBeenCalledWith(error);
            expect(result.json).not.toHaveBeenCalled();
        });
    });

    describe('getPost', function() {
        it('gets a post matching the given id', function() {
            var post = 'some Post';
            spyOn(Post, 'findById').and.callFake(function(id, callback) {
                callback(null, post)
            });

            var postId = 7;
            request = {'params' : {'post_id' : postId}};
            postHandler.getPost(request, result);

            expect(Post.findById).toHaveBeenCalledWith(postId, jasmine.any(Function));
            expect(result.json).toHaveBeenCalledWith(post);
            expect(result.send).not.toHaveBeenCalled();
        });

        it('sends the error back upon failure', function() {
            var error = 'Whoops!';
            spyOn(Post, 'findById').and.callFake(function(id, callback) {
               callback(error, null)
            });

            var badId = ':(';
            request = {'params' : {'post_id' : badId}};
            postHandler.getPost(request, result);

            expect(Post.findById).toHaveBeenCalledWith(badId, jasmine.any(Function));
            expect(result.send).toHaveBeenCalledWith(error);
            expect(result.json).not.toHaveBeenCalled();
        });
    });

    describe('createPost', function() {

    });

    describe('deletePost', function() {

    });
});
