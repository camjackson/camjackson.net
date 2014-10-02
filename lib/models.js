var mongoose = require('mongoose');

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
