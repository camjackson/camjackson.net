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
  posted: Date
});

var profileSchema = new mongoose.Schema({
  text: String,
  image: String
});

exports.User = mongoose.model('User', userSchema);
exports.Post = mongoose.model('Post', postSchema);
exports.Profile = mongoose.model('Profile', profileSchema);
