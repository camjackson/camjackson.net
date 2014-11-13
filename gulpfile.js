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
  var Config = models.Config;
  var User = models.User;
  var Post = models.Post;
  var db_connection_string = process.env.DB_CONNECTION_STRING || 'mongodb://localhost/writeitdown';
  var connection;

  var prompt = '\n\n***WARNING: THIS OPERATION WILL DESTROY DATA!***\nAre you sure you want to seed the database at ' + db_connection_string;
  return confirm(prompt).then(function() {
    connection = mongoose.connect(db_connection_string);
    return Config.remove({}).exec();
  }, function() {
    console.log('Aborting database seed.');
  }).then(function() {
    return Config.create({
      title: 'Site Title',
      heading: 'Site Heading',
      domain: 'example.com' //TODO
    });
  }).then(function() {
    return User.remove({}).exec();
  }).then(function() {
    return User.create({
      username: 'defaultUser',
      password: 'defaultPassword'
    });
  }).then(function() {
    return Post.remove({}).exec();
  }).then(function() {
    return Post.create({
      title: 'Hello, world!',
      slug: 'hello-world',
      text: firstPostText
    });
  }).then(function() {
    mongoose.disconnect();
  });
}

var firstPostText = 'This is your first post.\n\n Log in with the default credentials to ' +
  'edit or delete it, and to start making posts of your own.';
