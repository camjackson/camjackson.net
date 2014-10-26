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
  var Post = models.Post;
  var db_host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
  var connection;

  var prompt = '\n\n***WARNING: THIS OPERATION WILL DESTROY DATA!***\nAre you sure you want to seed the database at ' + db_host + '/writeitdown?';
  return confirm(prompt).then(function() {
    connection = mongoose.connect('mongodb://'+ db_host +'/writeitdown');
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
    return Post.remove({}).exec();
  }).then(function() {
    mongoose.disconnect();
  });
}
