var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

function hash(string) {
  return bcrypt.hashSync(string, 8);
}

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String, set: hash}
});

var postSchema = new mongoose.Schema({
  title: String,
  slug: {type: String, unique: true},
  text: String,
  posted: { type: Date, default: Date.now }
});

var configSchema = new mongoose.Schema({
  title: String,
  heading: String,
  domain: String
});

exports.Post = mongoose.model('Post', postSchema);
exports.Config = mongoose.model('Config', configSchema);
exports.User = mongoose.model('User', userSchema);
