postHandler = require('../../src/handlers/postHandler');
models      = require('../../src/models');
var Post = models.Post;

describe('postHandler', function(){

    describe('getPosts', function() {
        it('gets all stored posts', function() {
            var posts = ['post 1', 'post 2'];
            spyOn(Post, 'find').and.callFake(function (conditions, callback) {
                callback(null, posts);
            });

            var resultObject = jasmine.createSpyObj('resultObject', ['json']);

            postHandler.getPosts(null, resultObject);

            expect(resultObject.json).toHaveBeenCalledWith(posts);
        });

        it ('sends the error back upon failure', function() {
            var error = 'Broken!';
            spyOn(Post, 'find').and.callFake(function(conditions, callback) {
                callback(error, null);
            });

            var resultObject = jasmine.createSpyObj('resultObject', ['send']);

            postHandler.getPosts(null, resultObject);

            expect(resultObject.send).toHaveBeenCalledWith(error)
        })
    });

    describe('getPost', function() {

    });

    describe('createPost', function() {

    });

    describe('deletePost', function() {

    });
});
