var gulp = require('gulp');
var mocha = require('gulp-mocha');
var spawn = require('child_process').spawn;
var Q = require('q');
var confirm = require('./lib/helpers').confirm;

gulp.task('seed', seed);
gulp.task('test', test);
gulp.task('test:unit', testUnit);
gulp.task('test:integration', testIntegration);

function test() {
  return testUnit().then(function() {
    return testIntegration();
  });
}

function testUnit() {
  return Q.Promise(function(resolve, reject) {
    var stream = gulp.src(['spec/unit/**/*.js'], {read: false})
      .pipe(mocha({
        reporter: 'dot'
      }));
    stream.on('end', function() {
      resolve();
    });
    stream.on('error', function(err) {
      reject(err);
    })
  });
}

function testIntegration() {
  var mongoProcess = spawn('mongod');

  return Q.Promise(function(resolve, reject) {
    var stream = gulp.src(['spec/integration/**/*.js'], {read: false})
      .pipe(mocha({
        reporter: 'dot'
      }));
    stream.on('end', function () {
      mongoProcess.kill();
      resolve();
    });
    stream.on('error', function(err) {
      mongoProcess.kill();
      reject(err);
    });
  });
}

function seed() {
  var mongoose = require('mongoose');
  var models = require('./lib/models');
  var User = models.User;
  var Post = models.Post;
  var Profile = models.Profile;
  var db_connection_string = process.env.DB_CONNECTION_STRING || 'mongodb://localhost/writeitdown';
  var connection;

  var prompt = '\n\n***WARNING: THIS OPERATION WILL DESTROY DATA!***\nAre you sure you want to seed the database at ' + db_connection_string;
  return confirm(prompt).then(function() {
    connection = mongoose.connect(db_connection_string);
    return User.remove({}).exec();
  }, function() {
    console.log('Aborting database seed.');
  }).then(function() {
    return User.create({
      username: 'admin',
      password: 'admin'
    });
  }).then(function() {
    return Post.remove({}).exec();
  }).then(function() {
    return Post.create({
      title: 'Hello, world!',
      slug: 'hello-world',
      text: firstPostText,
      posted: Date.now()
    });
  }).then(function() {
    return Profile.remove({}).exec();
  }).then(function() {
    return Profile.create({
      text: profileText,
      image: 'http://placehold.it/150x200'
    });
  }).then(function() {
    mongoose.disconnect();
  });
}

var firstPostText = 'This is your first post.\n\n Log in with the default credentials to ' +
  'edit or delete it, and to start making posts of your own.';
var profileText = 'This is some profile text. Write a short intro on the profile ' +
  'page to explain who you are, and what your blog is about.\n\n You can also specify an ' +
  'image url, to fit in a 150x200 pixel area. Larger images will be squashed into the box.\n\n' +
  '*Markdown works here, too!*';
